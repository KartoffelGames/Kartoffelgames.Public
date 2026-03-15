import { Exception } from '@kartoffelgames/core';
import { TextureUsage } from '../../constant/texture-usage.enum.ts';
import type { GpuDevice } from '../../device/gpu-device.ts';
import { GpuObject, type GpuObjectSetupReferences } from '../../gpu_object/gpu-object.ts';
import { GpuResourceObjectInvalidationType } from '../../gpu_object/gpu-resource-object.ts';
import type { IGpuObjectNative } from '../../gpu_object/interface/i-gpu-object-native.ts';
import type { GpuTextureView } from '../../texture/gpu-texture-view.ts';
import { GpuTexture } from '../../texture/gpu-texture.ts';
import type { IGpuTexture } from '../../texture/i-gpu-texture.ts';
import type { RenderTargetsLayout, RenderTargetsLayoutColorTarget, RenderTargetsLayoutDepthStencil } from './render-targets-layout.ts';
import { RenderTargetsSetup, type RenderTargetsSetupData } from './render-targets-setup.ts';
import type { TextureFormat } from '../../constant/texture-format.type.ts';

/**
 * Group of textures with the same size and multisample level.
 * Bundled for attaching it to render passes.
 * Textures are auto-created from layout metadata.
 */
export class RenderTargets extends GpuObject<GPURenderPassDescriptor, RenderTargetsInvalidationType, RenderTargetsSetup> implements IGpuObjectNative<GPURenderPassDescriptor> {
    private static readonly DEPTH_STENCIL_KEY: string = Symbol('DepthStencil') as unknown as string;

    private readonly mLayout: RenderTargetsLayout;
    private readonly mSize: RenderTargetsTextureSize;
    private readonly mTargetViewUpdateQueue: Set<string>;
    private readonly mTargets: Map<string, RenderTargetsTargetTexture>;

    /**
     * Render target height.
     */
    public get height(): number {
        return this.mSize.height;
    }

    /**
     * Render targets layout.
     */
    public get layout(): RenderTargetsLayout {
        return this.mLayout;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPURenderPassDescriptor {
        return super.native;
    }

    /**
     * Render target width.
     */
    public get width(): number {
        return this.mSize.width;
    }

    /**
     * Constructor.
     * @param pDevice - Gpu device reference.
     * @param pLayout - Render targets layout with format metadata.
     */
    public constructor(pDevice: GpuDevice, pLayout: RenderTargetsLayout) {
        super(pDevice);

        // Set layout reference.
        this.mLayout = pLayout;

        // Set default size.
        this.mSize = { width: 1, height: 1 };

        // Setup initial data.
        this.mTargetViewUpdateQueue = new Set<string>();

        // Setup textures from layout.
        this.mTargets = new Map<string, RenderTargetsTargetTexture>();
    }

    /**
     * Get color target texture by name.
     *
     * @param pTargetName - Target name.
     *
     * @returns target texture view.
     */
    public colorTarget(pTargetName: string): GpuTextureView {
        // Ensure setup was called.
        this.ensureSetup();

        // Validate target exists in layout.
        if (!this.mTargets.has(pTargetName)) {
            throw new Exception(`Color target "${pTargetName}" does not exists.`, this);
        }

        return this.mTargets.get(pTargetName)!.texture.renderView;
    }

    /**
     * Get depth attachment texture.
     */
    public depthStencilTarget(): GpuTextureView {
        // Ensure setup was called.
        this.ensureSetup();

        // No depth texture.
        if (!this.mTargets.has(RenderTargets.DEPTH_STENCIL_KEY)) {
            throw new Exception(`Depth or stencil target does not exists.`, this);
        }

        return this.mTargets.get(RenderTargets.DEPTH_STENCIL_KEY)!.texture.renderView;
    }

    /**
     * Resize all render targets.
     *
     * @param pHeight - New texture height.
     * @param pWidth - New texture width.
     *
     * @returns this.
     */
    public resize(pHeight: number, pWidth: number): this {
        // Ensure setup was called.
        this.ensureSetup();

        // Set 2D size dimensions
        this.mSize.width = pWidth;
        this.mSize.height = pHeight;

        // Apply resize for all textures.
        // This trigger RenderTargetsInvalidationType.NativeUpdate for textures set in setTextureInvalidationListener.
        this.applyResize();

        // Trigger resize invalidation. Does not automaticly trigger rebuild.
        this.invalidate(RenderTargetsInvalidationType.Resize);

        return this;
    }

    /**
     * Generate native gpu render pass descriptor.
     */
    protected override generateNative(): GPURenderPassDescriptor {
        // Create color attachments.
        const lColorAttachments: Array<GPURenderPassColorAttachment> = new Array<GPURenderPassColorAttachment>();
        for (const lColorTargetName of this.mLayout.colorTargetNames) {
            // Read layout target and texture.
            const lLayoutTarget: RenderTargetsLayoutColorTarget = this.mLayout.colorTarget(lColorTargetName);
            const lColorTarget: RenderTargetsTargetTexture = this.mTargets.get(lColorTargetName)!;

            // Convert keep flag to store operations.
            const lStoreOperation: GPUStoreOp = lLayoutTarget.keepOnEnd ? 'store' : 'discard';

            // Create basic color attachment.
            const lPassColorAttachment: GPURenderPassColorAttachment = {
                view: lColorTarget.texture.renderView.native,
                storeOp: lStoreOperation,
                loadOp: 'clear', // Placeholder
                clearValue: lLayoutTarget.clearValue
            };

            // When canvas is set a resolve target, set it when multisampled.
            if (lColorTarget.texture.resolveView) {
                lPassColorAttachment.resolveTarget = lColorTarget.texture.resolveView.native;
            }

            // Set load op based on clear value presence.
            if (lLayoutTarget.clearValue !== null) {
                lPassColorAttachment.loadOp = 'clear';
            } else {
                lPassColorAttachment.loadOp = 'load';
            }

            lColorAttachments.push(lPassColorAttachment);
        }

        // Create descriptor with color attachments.
        const lDescriptor: GPURenderPassDescriptor = {
            colorAttachments: lColorAttachments
        };

        // Set optional depth attachment.
        if (this.mTargets.has(RenderTargets.DEPTH_STENCIL_KEY)) {
            const lDepthStencilTexture: GpuTextureView = this.mTargets.get(RenderTargets.DEPTH_STENCIL_KEY)!.texture.renderView;
            const lDepthStencilConfig = this.mLayout.depthStencilTarget();

            // Add texture view for depth.
            lDescriptor.depthStencilAttachment = {
                view: lDepthStencilTexture.native,
            };

            // Add depth values when layout has depth.
            if (this.mLayout.hasDepth) {
                // Set clear value of depth texture.
                lDescriptor.depthStencilAttachment.depthClearValue = lDepthStencilConfig.depth!.clearValue;
                lDescriptor.depthStencilAttachment.depthLoadOp = 'clear';

                // Convert keep flag to store operations.
                lDescriptor.depthStencilAttachment.depthStoreOp = lDepthStencilConfig.depth!.keepOnEnd ? 'store' : 'discard';
            }

            // Add stencil values when layout has stencil.
            if (this.mLayout.hasStencil) {
                // Set clear value of stencil texture.
                lDescriptor.depthStencilAttachment.stencilClearValue = lDepthStencilConfig.stencil!.clearValue;
                lDescriptor.depthStencilAttachment.stencilLoadOp = 'clear';

                // Convert keep flag to store operations.
                lDescriptor.depthStencilAttachment.stencilStoreOp = lDepthStencilConfig.stencil!.keepOnEnd ? 'store' : 'discard';
            }
        }

        return lDescriptor;
    }

    /**
     * Setup object based on setup data.
     *
     * @param pReferenceData - Referenced setup data.
     */
    protected override onSetup(pReferenceData: RenderTargetsSetupData): void {
        // Setup textures based on layout and setup data.
        const lCreateOrValidateTexture = (pTargetName: string, pFormat: TextureFormat, pExistingTexture: IGpuTexture | null | undefined): GpuTextureView => {
            const lTexture: IGpuTexture = (() => {
                // Use the existing texture when provided.
                if (pExistingTexture) {
                    return pExistingTexture;
                }

                // Create a new texture when no existing texture is provided.
                return new GpuTexture(this.device, {
                    format: pFormat,
                    dimension: '2d',
                    multisampled: this.mLayout.multisampled
                });
            })();

            const lView: GpuTextureView = lTexture.useAs('2d');
            lView.texture.extendUsage(TextureUsage.RenderAttachment);

            // Listen for texture invalidation.
            this.setTextureInvalidationListener(lView, pTargetName);

            return lView;
        };

        // Create color target textures from layout.
        for (const lTargetName of this.mLayout.colorTargetNames) {
            // Read layout information for this target.
            const lColorTargetLayout: RenderTargetsLayoutColorTarget = this.mLayout.colorTarget(lTargetName);

            // Create or use the provided texture for this target.
            const lView: GpuTextureView = lCreateOrValidateTexture(lTargetName, lColorTargetLayout.format, pReferenceData.colorTargets.get(lTargetName));

            const lColorTexture: Partial<RenderTargetsColorTexture> = {
                primaryView: lView,
            };

            // When the provided texture is not multisampled but the layout is, create a new multisampled texture and use it as render target, while using the provided texture as resolve target.
            if (this.mLayout.multisampled && !lView.texture.multiSampled) {
                // Create multisampled texture.
                const lMultisampledTexture: GpuTexture = new GpuTexture(this.device, {
                    format: lColorTargetLayout.format,
                    dimension: '2d',
                    multisampled: true
                });

                // Create multisampled texture view.
                const lMultisampledView: GpuTextureView = lMultisampledTexture.useAs('2d');
                lMultisampledView.texture.extendUsage(TextureUsage.RenderAttachment);

                // Listen for texture invalidation.
                this.setTextureInvalidationListener(lMultisampledView, lTargetName);

                // Swap view for resolve and render.
                lColorTexture.renderView = lMultisampledView;
                lColorTexture.resolveView = lView;
            } else {
                lColorTexture.renderView = lView;
                lColorTexture.resolveView = null;
            }

            this.mTargets.set(lTargetName, {
                name: lTargetName,
                index: lColorTargetLayout.index,
                texture: lColorTexture as RenderTargetsColorTexture
            });
        }

        // Create depth/stencil texture if layout defines one.
        if (this.mLayout.hasDepth || this.mLayout.hasStencil) {
            // Read layout information for depth stencil target.
            const lDepthStencilTargetLayout: RenderTargetsLayoutDepthStencil = this.mLayout.depthStencilTarget();

            // Create or use the provided texture for this target.
            const lView: GpuTextureView = lCreateOrValidateTexture(RenderTargets.DEPTH_STENCIL_KEY, lDepthStencilTargetLayout.format, pReferenceData.depthStencil);

            // Store depth stencil texture.
            this.mTargets.set(RenderTargets.DEPTH_STENCIL_KEY, {
                name: RenderTargets.DEPTH_STENCIL_KEY,
                index: -1,
                texture: {
                    primaryView: lView,

                    renderView: lView,
                    resolveView: null
                }
            });
        }
    }

    /**
     * Create setup object. Return null to skip any setups.
     * 
     * @param pReferences - Setup references.
     * 
     * @returns setup.
     */
    protected override onSetupObjectCreate(pReferences: GpuObjectSetupReferences<RenderTargetsSetupData>): RenderTargetsSetup {
        return new RenderTargetsSetup(pReferences, this.mLayout);
    }

    /**
     * Try to update views of pass descriptor.
     *
     * @param pNative - Native pass descriptor.
     *
     * @returns true when native was updated.
     */
    protected override updateNative(pNative: GPURenderPassDescriptor): boolean {
        // Update color attachments.
        for (const lTargetName of this.mTargetViewUpdateQueue) {
            // Update depth stencil view when depth stencil target is updated.
            if (lTargetName === RenderTargets.DEPTH_STENCIL_KEY) {
                pNative.depthStencilAttachment!.view = this.mTargets.get(RenderTargets.DEPTH_STENCIL_KEY)!.texture.renderView.native;
                continue;
            }

            // Read target texture.
            const lTextureTarget: RenderTargetsTargetTexture = this.mTargets.get(lTargetName)!;

            // Read current attachment and update view.
            const lCurrentAttachment: GPURenderPassColorAttachment = (<Array<GPURenderPassColorAttachment>>pNative.colorAttachments)[lTextureTarget.index];
            lCurrentAttachment.view = lTextureTarget.texture.renderView.native;

            // Update resolve target as well.
            if (lTextureTarget.texture.resolveView) {
                lCurrentAttachment.resolveTarget = lTextureTarget.texture.resolveView.native;
            }
        }

        // Reset updateable views.
        this.mTargetViewUpdateQueue.clear();

        return true;
    }

    /**
     * Resize all textures.
     */
    private applyResize(): void {
        // Resize each target texture including the depth stencil.
        for (const lTarget of this.mTargets.values()) {
            lTarget.texture.renderView.texture.height = this.mSize.height;
            lTarget.texture.renderView.texture.width = this.mSize.width;

            // When a resolve view is set, resize it as well.
            if (lTarget.texture.resolveView) {
                lTarget.texture.resolveView.texture.height = this.mSize.height;
                lTarget.texture.resolveView.texture.width = this.mSize.width;
            }
        }
    }

    /**
     * Add all needed texture invalidation listener for passthrow and descriptor invalidation.
     *
     * @param pTexture - Texture.
     * @param pTextureIndex - Texture index, -1 for depth stencil.
     */
    private setTextureInvalidationListener(pTexture: GpuTextureView, pName: string): void {
        // Update descriptor only on view changes.
        pTexture.addInvalidationListener(() => {
            // Invalidate.
            this.invalidate(RenderTargetsInvalidationType.NativeUpdate);

            // Set texture as updateable.
            this.mTargetViewUpdateQueue.add(pName);
        }, GpuResourceObjectInvalidationType.ResourceRebuild);
    }
}

type RenderTargetsTextureSize = {
    width: number;
    height: number;
};

type RenderTargetsColorTexture = {
    resolveView: GpuTextureView | null;
    renderView: GpuTextureView;

    /**
     * Eighter the rende ror resolve view determend by layout multisample flag.
     * When multisampled and a resolve view is set, this primary view is the resolve view, otherwise the render view.
     */
    primaryView: GpuTextureView;
};

type RenderTargetsTargetTexture = {
    name: string;
    index: number;
    texture: RenderTargetsColorTexture;
};

export enum RenderTargetsInvalidationType {
    NativeUpdate = 'NativeUpdate',
    Resize = 'Resize'
}
