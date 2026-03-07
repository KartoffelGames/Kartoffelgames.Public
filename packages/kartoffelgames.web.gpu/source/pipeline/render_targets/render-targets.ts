import { Exception } from '@kartoffelgames/core';
import { TextureDimension } from '../../constant/texture-dimension.enum.ts';
import { TextureUsage } from '../../constant/texture-usage.enum.ts';
import { TextureViewDimension } from '../../constant/texture-view-dimension.enum.ts';
import type { GpuDevice } from '../../device/gpu-device.ts';
import { GpuObject } from '../../gpu_object/gpu-object.ts';
import { GpuResourceObjectInvalidationType } from '../../gpu_object/gpu-resource-object.ts';
import type { IGpuObjectNative } from '../../gpu_object/interface/i-gpu-object-native.ts';
import type { CanvasTexture } from '../../texture/canvas-texture.ts';
import { GpuTexture } from '../../texture/gpu-texture.ts';
import type { GpuTextureView } from '../../texture/gpu-texture-view.ts';
import type { RenderTargetsLayout } from './render-targets-layout.ts';

/**
 * Group of textures with the same size and multisample level.
 * Bundled for attaching it to render passes.
 * Textures are auto-created from layout metadata.
 */
export class RenderTargets extends GpuObject<GPURenderPassDescriptor, RenderTargetsInvalidationType> implements IGpuObjectNative<GPURenderPassDescriptor> {
    private readonly mLayout: RenderTargetsLayout;
    private readonly mResolveCanvasList: Array<RenderTargetResolveCanvas>;
    private readonly mSize: RenderTargetsTextureSize;
    private readonly mTargetViewUpdateQueue: Set<number>;
    private readonly mTargets: RenderTargetsTextures;
    


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
     * List of all resolve canvases.
     */
    public get resolveCanvasList(): Array<RenderTargetResolveCanvas> {
        return this.mResolveCanvasList;
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
        this.mTargetViewUpdateQueue = new Set<number>();
        this.mResolveCanvasList = new Array<RenderTargetResolveCanvas>();

        // Setup textures from layout.
        this.mTargets = this.setupTextures();
    }

    /**
     * Get color target texture by name.
     *
     * @param pTargetName - Target name.
     *
     * @returns target texture view.
     */
    public colorTarget(pTargetName: string): GpuTextureView {
        // Validate target exists in layout.
        if (!this.mLayout.hasColorTarget(pTargetName)) {
            throw new Exception(`Color target "${pTargetName}" does not exists.`, this);
        }

        // Get the index from the layout.
        const lIndex: number = this.mLayout.colorTarget(pTargetName).index;

        return this.mTargets.color[lIndex].texture.target;
    }

    /**
     * Get depth attachment texture.
     */
    public depthStencilTarget(): GpuTextureView {
        // No depth texture.
        if (!this.mTargets.depthStencil) {
            throw new Exception(`Depth or stencil target does not exists.`, this);
        }

        return this.mTargets.depthStencil.target;
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
     * Set resolve canvas for a named color target.
     *
     * @param pColorTargetName - Color target name.
     * @param pCanvas - Canvas texture to resolve into.
     *
     * @returns this.
     */
    public setResolveCanvas(pColorTargetName: string, pCanvas: CanvasTexture): this {
        // Validate target exists in layout.
        if (!this.mLayout.hasColorTarget(pColorTargetName)) {
            throw new Exception(`Color target "${pColorTargetName}" does not exist.`, this);
        }

        const lIndex: number = this.mLayout.colorTarget(pColorTargetName).index;
        const lTarget: RenderTargetsColorTarget = this.mTargets.color[lIndex];

        // Add copy source to texture usage to be copied into canvas.
        lTarget.texture.target.texture.extendUsage(TextureUsage.CopySource);
        lTarget.texture.resolveCanvas = pCanvas;

        this.mResolveCanvasList.push({
            source: lTarget.texture.target,
            canvas: pCanvas
        });

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
            const lLayoutTarget = this.mLayout.colorTarget(lColorTargetName);
            const lColorTarget = this.mTargets.color[lLayoutTarget.index];

            // Convert keep flag to store operations.
            const lStoreOperation: GPUStoreOp = lLayoutTarget.keepOnEnd ? 'store' : 'discard';

            // Create basic color attachment.
            const lPassColorAttachment: GPURenderPassColorAttachment = {
                view: lColorTarget.texture.target.native,
                storeOp: lStoreOperation,
                loadOp: 'clear', // Placeholder
                clearValue: lLayoutTarget.clearValue
            };

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
        if (this.mTargets.depthStencil) {
            const lDepthStencilTexture: GpuTextureView = this.mTargets.depthStencil.target;
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
     * Try to update views of pass descriptor.
     *
     * @param pNative - Native pass descriptor.
     *
     * @returns true when native was updated.
     */
    protected override updateNative(pNative: GPURenderPassDescriptor): boolean {
        // Update depth stencil view. -1 Marks depth stencil texture updates.
        if (this.mTargetViewUpdateQueue.has(-1) && pNative.depthStencilAttachment) {
            pNative.depthStencilAttachment.view = this.mTargets.depthStencil!.target.native;

            // Remove depth stencil from update queue.
            this.mTargetViewUpdateQueue.delete(-1);
        }

        // Update color attachments.
        for (const lTargetIndex of this.mTargetViewUpdateQueue) {
            // Read current attachment.
            const lCurrentAttachment: GPURenderPassColorAttachment = (<Array<GPURenderPassColorAttachment>>pNative.colorAttachments)[lTargetIndex];

            // Read setup attachments.
            const lColorAttachment = this.mTargets.color[lTargetIndex];

            // Update view.
            lCurrentAttachment.view = lColorAttachment.texture.target.native;
        }

        // Reset updateable views.
        this.mTargetViewUpdateQueue.clear();

        return true;
    }

    /**
     * Resize all textures.
     */
    private applyResize(): void {
        // Update buffer texture sizes.
        for (const lAttachment of this.mTargets.color) {
            lAttachment.texture.target.texture.height = this.mSize.height;
            lAttachment.texture.target.texture.width = this.mSize.width;

            if (lAttachment.texture.resolveCanvas) {
                lAttachment.texture.resolveCanvas.height = this.mSize.height;
                lAttachment.texture.resolveCanvas.width = this.mSize.width;
            }
        }

        // Update target texture sizes.
        if (this.mTargets.depthStencil) {
            this.mTargets.depthStencil.target.texture.height = this.mSize.height;
            this.mTargets.depthStencil.target.texture.width = this.mSize.width;
        }
    }

    /**
     * Add all needed texture invalidation listener for passthrow and descriptor invalidation.
     *
     * @param pTexture - Texture.
     * @param pTextureIndex - Texture index, -1 for depth stencil.
     */
    private setTextureInvalidationListener(pTexture: GpuTextureView, pTextureIndex: number): void {
        // Update descriptor only on view changes.
        pTexture.addInvalidationListener(() => {
            // Invalidate.
            this.invalidate(RenderTargetsInvalidationType.NativeUpdate);

            // Set texture as updateable.
            this.mTargetViewUpdateQueue.add(pTextureIndex);
        }, GpuResourceObjectInvalidationType.ResourceRebuild);
    }

    private setupTextures(): RenderTargetsTextures {
        // Create empty texture data structure.
        const lTextures: RenderTargetsTextures = {
            color: new Array<RenderTargetsColorTarget>(),
            depthStencil: null
        };

        // Create color target textures from layout.
        for (const lName of this.mLayout.colorTargetNames) {
            const lLayoutTarget = this.mLayout.colorTarget(lName);

            const lTexture: GpuTexture = new GpuTexture(this.device, {
                format: lLayoutTarget.format,
                dimension: TextureDimension.TwoDimension,
                multisampled: this.mLayout.multisampled
            });

            const lView: GpuTextureView = lTexture.useAs(TextureViewDimension.TwoDimension);
            lView.texture.extendUsage(TextureUsage.RenderAttachment);

            // Listen for texture invalidation.
            this.setTextureInvalidationListener(lView, lLayoutTarget.index);

            lTextures.color[lLayoutTarget.index] = {
                name: lName,
                index: lLayoutTarget.index,
                texture: {
                    target: lView,
                    resolveCanvas: null
                }
            };
        }

        // Create depth/stencil texture if layout defines one.
        if (this.mLayout.hasDepth || this.mLayout.hasStencil) {
            const lConfig = this.mLayout.depthStencilTarget();

            const lTexture: GpuTexture = new GpuTexture(this.device, {
                format: lConfig.format,
                dimension: TextureDimension.TwoDimension,
                multisampled: this.mLayout.multisampled
            });

            const lView: GpuTextureView = lTexture.useAs(TextureViewDimension.TwoDimension);
            lView.texture.extendUsage(TextureUsage.RenderAttachment);

            // Listen for texture invalidation.
            this.setTextureInvalidationListener(lView, -1);

            lTextures.depthStencil = {
                target: lView
            };
        }

        return lTextures;
    }
}

type RenderTargetsTextureSize = {
    width: number;
    height: number;
};

export type RenderTargetsDepthStencilTexture = {
    target: GpuTextureView;
};

type RenderTargetsColorTexture = {
    resolveCanvas: CanvasTexture | null;
    target: GpuTextureView;
};

export type RenderTargetResolveCanvas = {
    canvas: CanvasTexture;
    source: GpuTextureView;
};

export type RenderTargetsColorTarget = {
    name: string;
    index: number;
    texture: RenderTargetsColorTexture;
};

export enum RenderTargetsInvalidationType {
    NativeUpdate = 'NativeUpdate',
    Resize = 'Resize'
}

type RenderTargetsTextures = {
    color: Array<RenderTargetsColorTarget>;
    depthStencil: RenderTargetsDepthStencilTexture | null;
};