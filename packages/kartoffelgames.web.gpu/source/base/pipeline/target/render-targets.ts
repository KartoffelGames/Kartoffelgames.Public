import { Dictionary, Exception } from '@kartoffelgames/core';
import { TextureAspect } from '../../../constant/texture-aspect.enum';
import { TextureOperation } from '../../../constant/texture-operation.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObject, GpuObjectSetupReferences, NativeObjectLifeTime } from '../../gpu/object/gpu-object';
import { UpdateReason } from '../../gpu/object/gpu-object-update-reason';
import { IGpuObjectNative } from '../../gpu/object/interface/i-gpu-object-native';
import { IGpuObjectSetup } from '../../gpu/object/interface/i-gpu-object-setup';
import { CanvasTexture } from '../../texture/canvas-texture';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';
import { TextureFormatCapability } from '../../texture/texture-format-capabilities';
import { RenderTargetSetupReferenceData, RenderTargetsSetup } from './render-targets-setup';

/**
 * Group of textures with the same size and multisample level.
 */
export class RenderTargets extends GpuObject<GPURenderPassDescriptor, RenderTargetsSetup> implements IGpuObjectSetup<RenderTargetsSetup>, IGpuObjectNative<GPURenderPassDescriptor> {
    private readonly mColorTextures: Dictionary<string, RenderTargetsColorTarget>; // TODO: Maybe use a ordered array for that.
    private mDepthStencilTexture: RenderTargetsDepthStencilTexture | null;
    private readonly mSize: TextureSize;

    /**
     * Color attachment textures.
     */
    public get colorTextures(): Array<FrameBufferTexture | CanvasTexture> {
        // Ensure setup was called.
        this.ensureSetup();

        // Create color attachment list in order.
        const lColorAttachmentList: Array<FrameBufferTexture | CanvasTexture> = new Array<FrameBufferTexture | CanvasTexture>();
        for (const lColorAttachment of this.mColorTextures.values()) {
            lColorAttachmentList[lColorAttachment.index] = lColorAttachment.texture.target;
        }

        return lColorAttachmentList;
    }

    /**
     * Depth attachment texture.
     */
    public get depthTexture(): FrameBufferTexture | null {
        // Ensure setup was called.
        this.ensureSetup();

        // No depth texture setup.
        if (!this.mDepthStencilTexture || !this.mDepthStencilTexture.depth) {
            return null;
        }

        return this.mDepthStencilTexture.target;
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
    public get multiSampleLevel(): number {
        return this.mSize.multisampleLevel;
    }

    /**
     * Native gpu object.
     */
    public override get native(): GPURenderPassDescriptor {
        return super.native;
    }

    /**
     * Stencil attachment texture.
     */
    public get stencilTexture(): FrameBufferTexture | null {
        // Ensure setup was called.
        this.ensureSetup();

        return this.mDepthStencilTexture?.stencil ? this.mDepthStencilTexture.target : null;
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
    public constructor(pDevice: GpuDevice) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        // Set "fixed" 
        this.mSize = { width: 1, height: 1, multisampleLevel: 1 };

        // Setup initial data.
        this.mDepthStencilTexture = null;
        this.mColorTextures = new Dictionary<string, RenderTargetsColorTarget>();
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
    public resize(pWidth: number, pHeight: number, pMultisampleLevel: number | null = null): this {
        this.mSize.width = pWidth;
        this.mSize.height = pHeight;

        // Optional multisample level.
        if (pMultisampleLevel !== null) {
            this.mSize.multisampleLevel = pMultisampleLevel;
        }

        // Retrigger update.
        this.triggerAutoUpdate(UpdateReason.Setting);

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
    protected override generate(): GPURenderPassDescriptor {
        // Apply all resize and multisample changes.
        this.applyResize();

        // Create color attachment list in order.
        const lColorAttachmentList: Array<RenderTargetsColorTarget> = new Array<RenderTargetsColorTarget>();
        for (const lColorAttachment of this.mColorTextures.values()) {
            lColorAttachmentList[lColorAttachment.index] = lColorAttachment;
        }

        // Create color attachments.
        const lColorAttachments: Array<GPURenderPassColorAttachment> = new Array<GPURenderPassColorAttachment>();
        for (const lColorAttachment of lColorAttachmentList) {
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

            // Resolve optional resolve attachment but only when texture uses multisample.
            if (lColorAttachment.texture!.resolve) {
                lPassColorAttachment.resolveTarget = lColorAttachment.texture!.resolve.native;
            }

            lColorAttachments.push(lPassColorAttachment satisfies GPURenderPassColorAttachment);
        }

        // Create descriptor with color attachments.
        const lDescriptor: GPURenderPassDescriptor = {
            colorAttachments: lColorAttachments
        };

        // Set optional depth attachment.
        if (this.mDepthStencilTexture) {
            const lDepthStencilTexture: FrameBufferTexture = this.mDepthStencilTexture.target;

            // Add texture view for depth.
            lDescriptor.depthStencilAttachment = {
                view: lDepthStencilTexture.native,
            };

            // Add depth values when depth formats are used.
            if (this.mDepthStencilTexture.depth) {
                // Set clear value of depth texture.
                if (this.mDepthStencilTexture.depth.clearValue !== null) {
                    lDescriptor.depthStencilAttachment.depthClearValue = this.mDepthStencilTexture.depth.clearValue;
                    lDescriptor.depthStencilAttachment.depthLoadOp = 'clear';
                } else {
                    lDescriptor.depthStencilAttachment.depthLoadOp = 'load';
                }

                // Convert Texture operation to load operations.
                lDescriptor.depthStencilAttachment.depthStoreOp = this.mDepthStencilTexture.depth.storeOperation === TextureOperation.Keep ? 'store' : 'discard';
            }

            // Add stencil values when stencil formats are used.
            if (this.mDepthStencilTexture.stencil) {
                // Set clear value of stencil texture.
                if (this.mDepthStencilTexture.stencil.clearValue !== null) {
                    lDescriptor.depthStencilAttachment.stencilClearValue = this.mDepthStencilTexture.stencil.clearValue;
                    lDescriptor.depthStencilAttachment.stencilLoadOp = 'clear';
                } else {
                    lDescriptor.depthStencilAttachment.stencilLoadOp = 'load';
                }

                // Convert Texture operation to load operations.
                lDescriptor.depthStencilAttachment.stencilStoreOp = this.mDepthStencilTexture.stencil.storeOperation === TextureOperation.Keep ? 'store' : 'discard';
            }
        }

        return lDescriptor;
    }

    /**
     * Setup object based on setup data.
     * 
     * @param pReferenceData - Referenced setup data.
     */
    protected override onSetup(pReferenceData: RenderTargetSetupReferenceData): void {
        // Setup depth stencil targets.
        if (pReferenceData.depthStencil) {
            // Validate existance of depth stencil texture.
            if (!pReferenceData.depthStencil.texture) {
                throw new Exception(`Depth/ stencil attachment defined but no texture was assigned.`, this);
            }

            // Read capability of used depth stencil texture format.
            const lFormatCapability: TextureFormatCapability = this.device.formatValidator.capabilityOf(pReferenceData.depthStencil.texture.memoryLayout.format);

            // Save setup texture.
            this.mDepthStencilTexture = {
                target: pReferenceData.depthStencil.texture
            };

            // Setup depth texture.
            if (pReferenceData.depthStencil.depth) {
                // Validate if depth texture
                if (lFormatCapability.aspect.types.includes(TextureAspect.Depth)) {
                    throw new Exception('Used texture for the depth texture attachment must have a depth aspect. ', this);
                }

                this.mDepthStencilTexture.depth = {
                    clearValue: pReferenceData.depthStencil.depth.clearValue,
                    storeOperation: pReferenceData.depthStencil.depth.storeOperation
                };
            }

            // Setup stencil texture.
            if (pReferenceData.depthStencil.stencil) {
                // Validate if depth texture
                if (lFormatCapability.aspect.types.includes(TextureAspect.Stencil)) {
                    throw new Exception('Used texture for the depth texture attachment must have a depth aspect. ', this);
                }

                this.mDepthStencilTexture.stencil = {
                    clearValue: pReferenceData.depthStencil.stencil.clearValue,
                    storeOperation: pReferenceData.depthStencil.stencil.storeOperation
                };
            }
        }

        // Setup color targets.
        const lAttachmentLocations: Array<boolean> = new Array<boolean>();
        for (const lAttachment of pReferenceData.colorTargets.values()) {
            // Validate existance of color texture.
            if (!lAttachment.texture) {
                throw new Exception(`Color attachment "${lAttachment.name}" defined but no texture was assigned.`, this);
            }

            // No double names.
            if (this.mColorTextures.has(lAttachment.name)) {
                throw new Exception(`Color attachment name "${lAttachment.name}" can only be defined once.`, this);
            }

            // No double location indices.
            if (lAttachmentLocations[lAttachment.index] === true) {
                throw new Exception(`Color attachment location index "${lAttachment.index}" can only be defined once.`, this);
            }

            // Buffer used location index.
            lAttachmentLocations[lAttachment.index] = true;

            // Convert setup into storage data.
            this.mColorTextures.set(lAttachment.name, {
                name: lAttachment.name,
                index: lAttachment.index,
                clearValue: lAttachment.clearValue,
                storeOperation: lAttachment.storeOperation,
                texture: {
                    target: lAttachment.texture
                }
            });
        }
        
        // Validate attachment list.
        if (lAttachmentLocations.length !== this.mColorTextures.size) {
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
    protected override onSetupObjectCreate(pReferences: GpuObjectSetupReferences<RenderTargetSetupReferenceData>): RenderTargetsSetup {
        return new RenderTargetsSetup(pReferences);
    }

    /**
     * Resize all textures.
     */
    private applyResize(): void {
        // Update buffer texture multisample level.
        for (const lAttachment of this.mColorTextures.values()) {
            // Check for removed or added multisample level.
            if (this.mSize.multisampleLevel === 1) {
                // When the multisample state is removed, use all canvas resolve textures into the actual target and clear the placeholder target buffer.
                if (lAttachment.texture.resolve) {
                    // Destroy buffering textures.
                    lAttachment.texture.target.deconstruct();

                    // Use resolve as target.
                    lAttachment.texture.target = lAttachment.texture.resolve;
                }
            } else {
                // When the multisample state is added, use all canvas targets as a resolve texture used after rendering and create a new target buffer texture with multisampling. 
                if (lAttachment.texture.target instanceof CanvasTexture) {
                    // Move target into resolve.
                    lAttachment.texture.resolve = lAttachment.texture.target;

                    // Create new texture from canvas texture.
                    lAttachment.texture.target = new FrameBufferTexture(this.device, lAttachment.texture.resolve.memoryLayout);
                }
            }

            // Add multisample level only to frame buffers as canvas does not support any mutisampling.
            if (lAttachment.texture.target instanceof FrameBufferTexture) {
                lAttachment.texture.target.multiSampleLevel = this.mSize.multisampleLevel;
            }
        }

        // Update target texture multisample level.
        if (this.mDepthStencilTexture) {
            this.mDepthStencilTexture.target.multiSampleLevel = this.mSize.multisampleLevel;
        }

        // Update buffer texture sizes.
        for (const lAttachment of this.mColorTextures.values()) {
            lAttachment.texture.target.height = this.mSize.height;
            lAttachment.texture.target.width = this.mSize.width;

            if (lAttachment.texture.resolve) {
                lAttachment.texture.resolve.height = this.mSize.height;
                lAttachment.texture.resolve.width = this.mSize.width;
            }
        }

        // Update target texture sizes.
        if (this.mDepthStencilTexture) {
            this.mDepthStencilTexture.target.height = this.mSize.height;
            this.mDepthStencilTexture.target.width = this.mSize.width;
        }
    }
}

type TextureSize = {
    width: number;
    height: number;
    multisampleLevel: number;
};

export type RenderTargetsDepthStencilTexture = {
    target: FrameBufferTexture;
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
    resolve?: CanvasTexture;
    target: FrameBufferTexture | CanvasTexture;
};

export type RenderTargetsColorTarget = {
    name: string;
    index: number;
    clearValue: { r: number; g: number; b: number; a: number; } | null;
    storeOperation: TextureOperation;
    texture: RenderTargetsColorTexture;
};