import { Dictionary, Exception } from '@kartoffelgames/core';
import { TextureOperation } from '../../../constant/texture-operation.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../../gpu/gpu-native-object';
import { UpdateReason } from '../../gpu/gpu-object-update-reason';
import { CanvasTexture } from '../../texture/canvas-texture';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';
import { RenderTargetColorSetup } from './render-target-color-setup';
import { RenderTargetDepthStencilSetup } from './render-target-depth-stencil-setup';
import { TextureFormatCapability } from '../../texture/texture-format-capabilities';
import { TextureAspect } from '../../../constant/texture-aspect.enum';

/**
 * Group of textures with the same size and multisample level.
 */
export class RenderTargets extends GpuNativeObject<GPURenderPassDescriptor> {
    private readonly mColorTextures = new Dictionary<string, RenderTargetsColorTarget>();
    private readonly mDepthStencilTexture: RenderTargetsDepthStencilTexture | null;
    private readonly mSize: TextureSize;

    /**
     * Render target height.
     */
    public get height(): number {
        return this.mSize.height;
    } set height(pValue: number) {
        this.mSize.height = pValue;

        // Trigger updates.
        this.triggerAutoUpdate(UpdateReason.ChildData);
    }

    /**
     * Render target multisample level.
     */
    public get multiSampleLevel(): number {
        return this.mSize.multisampleLevel;
    } set multiSampleLevel(pLevel: number) {
        this.mSize.multisampleLevel = pLevel;

        // Trigger updates.
        this.triggerAutoUpdate(UpdateReason.ChildData);
    }

    /**
     * Render target height.
     */
    public get width(): number {
        return this.mSize.width;
    } set width(pValue: number) {
        this.mSize.width = pValue;

        // Trigger updates.
        this.triggerAutoUpdate(UpdateReason.ChildData);
    }

    /**
     * Constuctor.
     * @param pDevice - Gpu device reference.
     */
    public constructor(pDevice: GpuDevice, pLayout: RenderTargetLayout) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        // Set "fixed" 
        this.mSize = { width: 1, height: 1, multisampleLevel: 1 };

        // Add color render targets.
        this.mColorTextures = new Dictionary<string, RenderTargetsColorTarget>();
        for (const lAttachmentName of Object.keys(pLayout.attachments)) {
            const lAttachmentEntry: RenderTargetLayout['attachments'][string] = pLayout.attachments[lAttachmentName];

            // Convert all render attachments to a location mapping. 
            this.mColorTextures.set(lAttachmentName, {
                name: lAttachmentName,
                index: lAttachmentEntry.index,
                clearValue: lAttachmentEntry.clearValue,
                storeOperation: (lAttachmentEntry.clearValue) ? TextureOperation.Clear : TextureOperation.Keep,
                texture: null
            });
        }

        // Add optional depth or stencil targets.
        this.mDepthStencilTexture = null;
        if (pLayout.depth || pLayout.stencil) {
            // Define basic layout.
            this.mDepthStencilTexture = {
                target: null
            };

            // Set depth texture information.
            if (pLayout.depth) {
                this.mDepthStencilTexture.depth = {
                    clearValue: pLayout.depth.clearValue,
                    storeOperation: (pLayout.depth.clearValue) ? TextureOperation.Clear : TextureOperation.Keep,
                };
            }

            // Set stencil texture information.
            if (pLayout.stencil) {
                this.mDepthStencilTexture.stencil = {
                    clearValue: pLayout.stencil.clearValue,
                    storeOperation: (pLayout.stencil.clearValue) ? TextureOperation.Clear : TextureOperation.Keep,
                };
            }
        }
    }

    /**
     * Get depth stencil target setup object. 
     */
    public depthStencil(): RenderTargetDepthStencilSetup {
        // Validate existance.
        if (!this.mDepthStencilTexture) {
            throw new Exception(`Render target depth stencil  not specified`, this);
        }

        return new RenderTargetDepthStencilSetup(this.device, this.mDepthStencilTexture, () => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
    }

    /**
     * Get color target setup object. 
     * 
     * @param pTargetName - Color target name.
     */
    public target(pTargetName: string): RenderTargetColorSetup {
        const lTarget: RenderTargetsColorTarget | undefined = this.mColorTextures.get(pTargetName);

        // Validate existance.
        if (!lTarget) {
            throw new Exception(`Render target "${pTargetName}" not specified`, this);
        }

        return new RenderTargetColorSetup(this.device, lTarget, () => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
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
        // Apply all resize and multisample changes.
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
        if (this.mDepthStencilTexture) {
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
                if(lFormatCapability.aspect.types.includes(TextureAspect.Depth)){
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
                if(lFormatCapability.aspect.types.includes(TextureAspect.Stencil)){
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
        if (this.mDepthStencilTexture) {
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
        if (this.mDepthStencilTexture) {
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

export type RenderTargetLayout = {
    // Color attachments.
    attachments: {
        [attachmentName: string]: {
            index: number;
            storeOnLoad: boolean;
            clearValue: { r: number; g: number; b: number; a: number; } | null;
        };
    };

    // Depth settings.
    depth?: {
        clearValue: number | null;
        storeOnLoad: boolean;
    };

    // Stencil settings.
    stencil?: {
        clearValue: number | null;
        storeOnLoad: boolean;
    };
};