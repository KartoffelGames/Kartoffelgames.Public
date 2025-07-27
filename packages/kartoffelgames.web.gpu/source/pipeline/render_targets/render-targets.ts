import { Dictionary, Exception } from '@kartoffelgames/core';
import { GpuLimit } from '../../constant/gpu-limit.enum.ts';
import { TextureAspect } from '../../constant/texture-aspect.enum.ts';
import { TextureOperation } from '../../constant/texture-operation.enum.ts';
import { TextureUsage } from '../../constant/texture-usage.enum.ts';
import { TextureViewDimension } from '../../constant/texture-view-dimension.enum.ts';
import type { TextureFormatCapability } from '../../device/capabilities/gpu-texture-format-capabilities.ts';
import type { GpuDevice } from '../../device/gpu-device.ts';
import { GpuObject, type GpuObjectSetupReferences } from '../../gpu_object/gpu-object.ts';
import { GpuResourceObjectInvalidationType } from '../../gpu_object/gpu-resource-object.ts';
import type { IGpuObjectNative } from '../../gpu_object/interface/i-gpu-object-native.ts';
import type { IGpuObjectSetup } from '../../gpu_object/interface/i-gpu-object-setup.ts';
import type { CanvasTexture } from '../../texture/canvas-texture.ts';
import type { GpuTextureView } from '../../texture/gpu-texture-view.ts';
import { type RenderTargetSetupData, RenderTargetsSetup } from './render-targets-setup.ts';

/**
 * Group of textures with the same size and multisample level.
 * Bundled for attaching it to render passes.
 */
export class RenderTargets extends GpuObject<GPURenderPassDescriptor, RenderTargetsInvalidationType, RenderTargetsSetup> implements IGpuObjectSetup<RenderTargetsSetup>, IGpuObjectNative<GPURenderPassDescriptor> {
    private readonly mColorTargetNames: Dictionary<string, number>;
    private readonly mColorTargets: Array<RenderTargetsColorTarget>;
    private mDepthStencilTarget: RenderTargetsDepthStencilTexture | null;
    private readonly mMultisampled: boolean;
    private readonly mResolveCanvasList: Array<RenderTargetResolveCanvas>;
    private readonly mSize: TextureSize;
    private readonly mTargetViewUpdateQueue: Set<number>;

    /**
     * Color attachment names ordered by index.
     */
    public get colorTargetNames(): Array<string> {
        // Ensure setup was called.
        this.ensureSetup();

        // Create color attachment list in order.
        const lColorAttachmentNameList: Array<string> = new Array<string>();
        for (const lColorAttachment of this.mColorTargets.values()) {
            lColorAttachmentNameList[lColorAttachment.index] = lColorAttachment.name;
        }

        return lColorAttachmentNameList;
    }

    /**
     * Stencil attachment texture.
     */
    public get hasDepth(): boolean {
        // Ensure setup was called.
        this.ensureSetup();

        return !!this.mDepthStencilTarget?.depth;
    }

    /**
     * Stencil attachment texture.
     */
    public get hasStencil(): boolean {
        // Ensure setup was called.
        this.ensureSetup();

        return !!this.mDepthStencilTarget?.stencil;
    }

    /**
     * Render target height.
     */
    public get height(): number {
        return this.mSize.height;
    }

    /**
     * Render target multisample level.
     */
    public get multisampled(): boolean {
        return this.mMultisampled;
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
     * Render target height.
     */
    public get width(): number {
        return this.mSize.width;
    }

    /**
     * Constuctor.
     * @param pDevice - Gpu device reference.
     */
    public constructor(pDevice: GpuDevice, pMultisampled: boolean) {
        super(pDevice);

        // Set statics.
        this.mMultisampled = pMultisampled;

        // Set default size. 
        this.mSize = { width: 1, height: 1 };

        // Setup initial data.
        this.mDepthStencilTarget = null;
        this.mColorTargets = new Array<RenderTargetsColorTarget>();
        this.mColorTargetNames = new Dictionary<string, number>();
        this.mTargetViewUpdateQueue = new Set<number>();
        this.mResolveCanvasList = new Array<RenderTargetResolveCanvas>();
    }

    /**
     * Get color target by name.
     * 
     * @param pTargetName - Target name.
     *  
     * @returns target texture. 
     */
    public colorTarget(pTargetName: string): GpuTextureView {
        // Read index of color target.
        const lColorTargetIndex: number | null = this.mColorTargetNames.get(pTargetName) ?? null;
        if (lColorTargetIndex === null) {
            throw new Exception(`Color target "${pTargetName}" does not exists.`, this);
        }

        return this.mColorTargets[lColorTargetIndex].texture.target;
    }

    /**
     * Get depth attachment texture.
     */
    public depthStencilTarget(): GpuTextureView {
        // Ensure setup was called.
        this.ensureSetup();

        // No depth texture setup.
        if (!this.mDepthStencilTarget || !this.mDepthStencilTarget.depth) {
            throw new Exception(`Depth or stencil target does not exists.`, this);
        }

        return this.mDepthStencilTarget.target;
    }

    /**
     * Check for color target existence.
     * 
     * @param pTargetName - Color target name.
     * 
     * @returns true when color target exists. 
     */
    public hasColorTarget(pTargetName: string): boolean {
        return this.mColorTargetNames.has(pTargetName);
    }

    /**
     * Resize all render targets.
     * 
     * @param pWidth - New texture width.
     * @param pHeight - New texture height.
     * @param pMultisampleLevel - New texture multisample level.
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
     * Call setup.
     * Exposes internal setup.
     * 
     * @param pSetupCallback - Setup callback. 
     * 
     * @returns this. 
     */
    public override setup(pSetupCallback?: ((pSetup: RenderTargetsSetup) => void) | undefined): this {
        return super.setup(pSetupCallback);
    }

    /**
     * Generate native gpu bind data group.
     */
    protected override generateNative(): GPURenderPassDescriptor {
        // Create color attachments.
        const lColorAttachments: Array<GPURenderPassColorAttachment> = new Array<GPURenderPassColorAttachment>();
        for (const lColorAttachment of this.mColorTargets) {
            // Convert Texture operation to load operations.
            const lStoreOperation: GPUStoreOp = lColorAttachment.storeOperation === TextureOperation.Keep ? 'store' : 'discard';

            // Create basic color attachment.
            const lPassColorAttachment: GPURenderPassColorAttachment = {
                view: lColorAttachment.texture!.target.native,
                storeOp: lStoreOperation,
                loadOp: 'clear' // Placeholder
            };

            // Set clear value 
            if (lColorAttachment.clearValue !== null) {
                lPassColorAttachment.clearValue = lColorAttachment.clearValue;
                lPassColorAttachment.loadOp = 'clear';
            } else {
                lPassColorAttachment.loadOp = 'load';
            }

            lColorAttachments.push(lPassColorAttachment satisfies GPURenderPassColorAttachment);
        }

        // Create descriptor with color attachments.
        const lDescriptor: GPURenderPassDescriptor = {
            colorAttachments: lColorAttachments
        };

        // Set optional depth attachment.
        if (this.mDepthStencilTarget) {
            const lDepthStencilTexture: GpuTextureView = this.mDepthStencilTarget.target;

            // Add texture view for depth.
            lDescriptor.depthStencilAttachment = {
                view: lDepthStencilTexture.native,
            };

            // Add depth values when depth formats are used.
            if (this.mDepthStencilTarget.depth) {
                // Set clear value of depth texture.
                if (this.mDepthStencilTarget.depth.clearValue !== null) {
                    lDescriptor.depthStencilAttachment.depthClearValue = this.mDepthStencilTarget.depth.clearValue;
                    lDescriptor.depthStencilAttachment.depthLoadOp = 'clear';
                } else {
                    lDescriptor.depthStencilAttachment.depthLoadOp = 'load';
                }

                // Convert Texture operation to load operations.
                lDescriptor.depthStencilAttachment.depthStoreOp = this.mDepthStencilTarget.depth.storeOperation === TextureOperation.Keep ? 'store' : 'discard';
            }

            // Add stencil values when stencil formats are used.
            if (this.mDepthStencilTarget.stencil) {
                // Set clear value of stencil texture.
                if (this.mDepthStencilTarget.stencil.clearValue !== null) {
                    lDescriptor.depthStencilAttachment.stencilClearValue = this.mDepthStencilTarget.stencil.clearValue;
                    lDescriptor.depthStencilAttachment.stencilLoadOp = 'clear';
                } else {
                    lDescriptor.depthStencilAttachment.stencilLoadOp = 'load';
                }

                // Convert Texture operation to load operations.
                lDescriptor.depthStencilAttachment.stencilStoreOp = this.mDepthStencilTarget.stencil.storeOperation === TextureOperation.Keep ? 'store' : 'discard';
            }
        }

        return lDescriptor;
    }

    /**
     * Setup object based on setup data.
     * 
     * @param pReferenceData - Referenced setup data.
     */
    protected override onSetup(pReferenceData: RenderTargetSetupData): void {
        // Enforce gpu color attachment limits.
        const lMaxRenderTargets: number = this.device.capabilities.getLimit(GpuLimit.MaxColorAttachments);
        if (pReferenceData.colorTargets.length > (lMaxRenderTargets - 1)) {
            throw new Exception(`Max color targets count exeeced.`, this);
        }

        // Setup depth stencil targets.
        if (pReferenceData.depthStencil) {
            // Validate existence of depth stencil texture.
            if (!pReferenceData.depthStencil.textureView) {
                throw new Exception(`Depth/ stencil attachment defined but no texture was assigned.`, this);
            }

            // Only two dimensional textures.
            if (pReferenceData.depthStencil.textureView.layout.dimension !== TextureViewDimension.TwoDimension) {
                throw new Exception(`Color attachment can only two dimensional.`, this);
            }

            // Save setup texture.
            this.mDepthStencilTarget = {
                target: pReferenceData.depthStencil.textureView
            };

            // Add render attachment texture usage to depth stencil texture.
            pReferenceData.depthStencil.textureView.texture.extendUsage(TextureUsage.RenderAttachment);

            // Passthrough depth stencil texture changes.
            this.setTextureInvalidationListener(pReferenceData.depthStencil.textureView, -1);

            // Read capability of used depth stencil texture format.
            const lFormatCapability: TextureFormatCapability = this.device.formatValidator.capabilityOf(pReferenceData.depthStencil.textureView.layout.format);

            // Setup depth texture.
            if (pReferenceData.depthStencil.depth) {
                // Validate if depth texture
                if (!lFormatCapability.aspects.has(TextureAspect.Depth)) {
                    throw new Exception('Used texture for the depth texture attachment must have a depth aspect. ', this);
                }

                this.mDepthStencilTarget.depth = {
                    clearValue: pReferenceData.depthStencil.depth.clearValue,
                    storeOperation: pReferenceData.depthStencil.depth.storeOperation
                };
            }

            // Setup stencil texture.
            if (pReferenceData.depthStencil.stencil) {
                // Validate if depth texture
                if (!lFormatCapability.aspects.has(TextureAspect.Stencil)) {
                    throw new Exception('Used texture for the stencil texture attachment must have a depth aspect. ', this);
                }

                this.mDepthStencilTarget.stencil = {
                    clearValue: pReferenceData.depthStencil.stencil.clearValue,
                    storeOperation: pReferenceData.depthStencil.stencil.storeOperation
                };
            }
        }

        // Setup color targets.
        for (const lAttachment of pReferenceData.colorTargets.values()) {
            // Validate existence of color texture.
            if (!lAttachment.textureView) {
                throw new Exception(`Color attachment "${lAttachment.name}" defined but no texture was assigned.`, this);
            }

            // No double names.
            if (this.mColorTargetNames.has(lAttachment.name)) {
                throw new Exception(`Color attachment name "${lAttachment.name}" can only be defined once.`, this);
            }

            // No double location indices.
            if (this.mColorTargets[lAttachment.index]) {
                throw new Exception(`Color attachment location index "${lAttachment.index}" can only be defined once.`, this);
            }

            // When a resolve canvas is specified, the texture must have the same texture format.
            if (lAttachment.resolveCanvas && lAttachment.resolveCanvas.format !== lAttachment.textureView.layout.format) {
                throw new Exception(`Color attachment can only be resolved into a canvas with the same texture format.`, this);
            }

            // Only two dimensional textures.
            if (lAttachment.textureView.layout.dimension !== TextureViewDimension.TwoDimension) {
                throw new Exception(`Color attachment can only two dimensional.`, this);
            }

            // Only two dimensional textures.
            if (lAttachment.textureView.mipLevelStart !== 0) {
                throw new Exception(`Color attachment can only rendered into mip level 0.`, this);
            }

            // Passthrough color texture changes. Any change.
            this.setTextureInvalidationListener(lAttachment.textureView, lAttachment.index);

            // Add render attachment texture usage to color texture.
            lAttachment.textureView.texture.extendUsage(TextureUsage.RenderAttachment);

            // Save color target name and index mapping.
            this.mColorTargetNames.set(lAttachment.name, lAttachment.index);

            // Set resolve canvas.
            if (lAttachment.resolveCanvas) {
                // Add copy source to texture usage to be copied into canvas.
                lAttachment.textureView.texture.extendUsage(TextureUsage.CopySource);

                this.mResolveCanvasList.push({
                    source: lAttachment.textureView,
                    canvas: lAttachment.resolveCanvas
                });
            }

            // Convert setup into storage data.
            this.mColorTargets[lAttachment.index] = {
                name: lAttachment.name,
                index: lAttachment.index,
                clearValue: lAttachment.clearValue,
                storeOperation: lAttachment.storeOperation,
                texture: {
                    target: lAttachment.textureView,
                    resolveCanvas: lAttachment.resolveCanvas
                }
            };
        }

        // Validate attachment list.
        if (this.mColorTargetNames.size !== this.mColorTargets.length) {
            throw new Exception(`Color attachment locations must be in order.`, this);
        }
    }

    /**
     * On setup object creation. Create setup object.
     * 
     * @param pReferences - Setup references.
     * 
     * @returns build setup object. 
     */
    protected override onSetupObjectCreate(pReferences: GpuObjectSetupReferences<RenderTargetSetupData>): RenderTargetsSetup {
        return new RenderTargetsSetup(pReferences, this.mMultisampled);
    }

    /**
     * Try to update views of pass descriptor.
     * 
     * @param pNative - Native pass descriptor.
     * @param pReasons - Update reason.
     * 
     * @returns true when native was updated.
     */
    protected override updateNative(pNative: GPURenderPassDescriptor): boolean {
        // Update depth stencil view. -1 Marks depth stencil texture updates. 
        if (this.mTargetViewUpdateQueue.has(-1) && pNative.depthStencilAttachment) {
            pNative.depthStencilAttachment.view = this.mDepthStencilTarget!.target.native;

            // Remove depth stencil from update queue.
            this.mTargetViewUpdateQueue.delete(-1);
        }

        // Update color attachments.
        for (const lTargetIndex of this.mTargetViewUpdateQueue) {
            // Read current attachment.
            const lCurrentAttachment: GPURenderPassColorAttachment = (<Array<GPURenderPassColorAttachment>>pNative.colorAttachments)[lTargetIndex];

            // Read setup attachments.
            const lColorAttachment = this.mColorTargets[lTargetIndex];

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
        for (const lAttachment of this.mColorTargets) {
            lAttachment.texture.target.texture.height = this.mSize.height;
            lAttachment.texture.target.texture.width = this.mSize.width;

            if (lAttachment.texture.resolveCanvas) {
                lAttachment.texture.resolveCanvas.height = this.mSize.height;
                lAttachment.texture.resolveCanvas.width = this.mSize.width;
            }
        }

        // Update target texture sizes.
        if (this.mDepthStencilTarget) {
            this.mDepthStencilTarget.target.texture.height = this.mSize.height;
            this.mDepthStencilTarget.target.texture.width = this.mSize.width;
        }
    }

    /**
     * Add all needed texture invalidation listener for passthrow and descriptor invalidation. 
     * 
     * @param pTexture - Texture. 
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
}

type TextureSize = {
    width: number;
    height: number;
};

export type RenderTargetsDepthStencilTexture = {
    target: GpuTextureView;
    depth?: {
        clearValue: number | null;
        storeOperation: TextureOperation;
    };
    stencil?: {
        clearValue: number | null;
        storeOperation: TextureOperation;
    };
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
    clearValue: { r: number; g: number; b: number; a: number; } | null;
    storeOperation: TextureOperation;
    texture: RenderTargetsColorTexture;
};

export enum RenderTargetsInvalidationType {
    NativeUpdate = 'NativeUpdate',
    Resize = 'Resize'
}