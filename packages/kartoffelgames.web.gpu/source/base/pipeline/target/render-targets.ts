import { Dictionary, Exception } from '@kartoffelgames/core';
import { TextureAspect } from '../../../constant/texture-aspect.enum';
import { TextureOperation } from '../../../constant/texture-operation.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../../gpu/gpu-native-object';
import { UpdateReason } from '../../gpu/gpu-object-update-reason';
import { CanvasTexture } from '../../texture/canvas-texture';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';
import { TextureFormatCapability } from '../../texture/texture-format-capabilities';
import { RenderTargetsSetup } from './render-targets-setup';

/**
 * Group of textures with the same size and multisample level.
 */
export class RenderTargets extends GpuNativeObject<GPURenderPassDescriptor> {
    private readonly mColorTextures: Dictionary<string, RenderTargetsColorTarget>;
    private readonly mDepthStencilTexture: RenderTargetsDepthStencilTexture;
    private mIsSetup: boolean;
    private readonly mSize: TextureSize;

    /**
     * Color attachment textures.
     */
    public get colorTextures(): Array<FrameBufferTexture | CanvasTexture> {
        // Create color attachment list in order.
        const lColorAttachmentList: Array<FrameBufferTexture | CanvasTexture> = new Array<FrameBufferTexture | CanvasTexture>();
        for (const lColorAttachment of this.mColorTextures.values()) {
            if (!lColorAttachment.texture) {
                throw new Exception(`Missing color attachment texture for "${lColorAttachment.name}".`, this);
            }

            lColorAttachmentList[lColorAttachment.index] = lColorAttachment.texture.target;
        }

        return lColorAttachmentList;
    }

    /**
     * Depth attachment texture.
     */
    public get depthTexture(): FrameBufferTexture | null {
        return this.mDepthStencilTexture.depth ? this.mDepthStencilTexture.target : null;
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
     * Stencil attachment texture.
     */
    public get stencilTexture(): FrameBufferTexture | null {
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
        this.mDepthStencilTexture = { target: null };
        this.mColorTextures = new Dictionary<string, RenderTargetsColorTarget>();

        // Init setup object.
        this.mIsSetup = false;
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
     * Setup render targets.
     * Can only be called once and is the only way to create or add target textures.
     * 
     * @param pSetup - Setup call.
     * 
     * @returns this. 
     */
    public setup(pSetup: (pSetup: RenderTargetsSetup) => void): this {
        // Dont call twice.
        if (this.mIsSetup) {
            throw new Exception(`Render targets setup can't be called twice.`, this);
        }

        // Create references to internal resources.
        const lSetupReference: RenderTargetSetupReference = {
            device: this.device,
            renderTarget: this,
            inSetup: true,
            colorTargetReference: this.mColorTextures,
            depthStencilTargetReference: this.mDepthStencilTexture
        };

        // Call setup.
        pSetup(new RenderTargetsSetup(lSetupReference));

        // Lock setup.
        this.mIsSetup = true;

        // Lock setup reference.
        lSetupReference.inSetup = false;

        return this;
    }

    /**
     * Nothing to destroy.
     */
    protected override destroy(): void {
        // Nothing to destroy as it is only a configuration object.
    }

    /**
     * Generate native gpu bind data group.
     */
    protected override generate(): GPURenderPassDescriptor {
        // Must be setup.
        if (!this.mIsSetup) {
            throw new Exception(`Render targets must be setup.`, this);
        }

        // Apply all resize and multisample changes.
        // Cool side effect is, that it validates the existence of all textures.
        this.applyResize();

        // Create color attachment list in order.
        const lColorAttachmentList: Array<RenderTargetsColorTarget> = new Array<RenderTargetsColorTarget>();
        for (const lColorAttachment of this.mColorTextures.values()) {
            lColorAttachmentList[lColorAttachment.index] = lColorAttachment;
        }

        // Validate attachment list.
        if (lColorAttachmentList.length !== this.mColorTextures.size) {
            throw new Exception(`Color attachment locations must be in order.`, this);
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
        if (this.mDepthStencilTexture.depth || this.mDepthStencilTexture.stencil) {
            const lDepthStencilTexture: FrameBufferTexture = this.mDepthStencilTexture.target!;

            // Add texture view for depth.
            lDescriptor.depthStencilAttachment = {
                view: lDepthStencilTexture.native,
            };

            // Read capability of used depth stencil texture format.
            const lFormatCapability: TextureFormatCapability = this.device.formatValidator.capabilityOf(lDepthStencilTexture.memoryLayout.format);

            // Add depth values when depth formats are used.
            if (this.mDepthStencilTexture.depth) {
                // Validate if depth texture
                if (lFormatCapability.aspect.types.includes(TextureAspect.Depth)) {
                    throw new Exception('Used texture for the depth texture attachment must have a depth aspect. ', this);
                }

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
                // Validate if stencil texture
                if (lFormatCapability.aspect.types.includes(TextureAspect.Stencil)) {
                    throw new Exception('Used texture for the stencil texture attachment must have a stencil aspect. ', this);
                }

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
     * Resize all textures.
     */
    private applyResize(): void {
        // Update buffer texture multisample level.
        for (const lAttachment of this.mColorTextures.values()) {
            // Validate existance of depth stencil texture.
            if (!lAttachment.texture) {
                throw new Exception(`Color attachment defined but no texture was assigned.`, this);
            }

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
        if (this.mDepthStencilTexture.depth || this.mDepthStencilTexture.stencil) {
            // Validate existance of depth stencil texture.
            if (!this.mDepthStencilTexture.target) {
                throw new Exception(`DepthStencil target defined but no texture was assigned.`, this);
            }

            this.mDepthStencilTexture.target.multiSampleLevel = this.mSize.multisampleLevel;
        }

        // Update buffer texture sizes.
        for (const lAttachment of this.mColorTextures.values()) {
            lAttachment.texture!.target.height = this.mSize.height;
            lAttachment.texture!.target.width = this.mSize.width;

            if (lAttachment.texture!.resolve) {
                lAttachment.texture!.resolve.height = this.mSize.height;
                lAttachment.texture!.resolve.width = this.mSize.width;
            }
        }

        // Update target texture sizes.
        if (this.mDepthStencilTexture.depth || this.mDepthStencilTexture.stencil) {
            this.mDepthStencilTexture.target!.height = this.mSize.height;
            this.mDepthStencilTexture.target!.width = this.mSize.width;
        }
    }
}

type TextureSize = {
    width: number;
    height: number;
    multisampleLevel: number;
};

export type RenderTargetsDepthStencilTexture = {
    target: FrameBufferTexture | null;
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
    texture: RenderTargetsColorTexture | null;
};

export type RenderTargetSetupReference = {
    renderTarget: RenderTargets;
    device: GpuDevice;
    inSetup: boolean;
    colorTargetReference: Dictionary<string, RenderTargetsColorTarget>;
    depthStencilTargetReference: RenderTargetsDepthStencilTexture;
};