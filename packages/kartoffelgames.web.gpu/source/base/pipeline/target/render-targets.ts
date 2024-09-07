import { Dictionary, Exception } from '@kartoffelgames/core';
import { AccessMode } from '../../../constant/access-mode.enum';
import { ComputeStage } from '../../../constant/compute-stage.enum';
import { TextureBindType } from '../../../constant/texture-bind-type.enum';
import { TextureDimension } from '../../../constant/texture-dimension.enum';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureOperation } from '../../../constant/texture-operation.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../../gpu/gpu-native-object';
import { TextureMemoryLayout } from '../../memory_layout/texture/texture-memory-layout';
import { CanvasTexture } from '../../texture/canvas-texture';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';

/**
 * Group of textures with the same size and multisample level.
 */
export class RenderTargets extends GpuNativeObject<GPURenderPassDescriptor> { // TODO: Rename to render targets and replace it.
    private readonly mBufferTextures: Dictionary<string, FrameBufferTexture>;
    private readonly mMultisampleLevel: number;
    private readonly mSize: TextureSize;
    private readonly mTargetTextures: Dictionary<string, CanvasTexture>;

    /**
     * Render target height.
     */
    public get height(): number {
        return this.mSize.height;
    } set height(pValue: number) {
        this.resize(this.mSize.width, pValue);
    }

    /**
     * Render target multisample level.
     */
    public get multiSampleLevel(): number {
        return this.mMultisampleLevel;
    }

    /**
     * Render target height.
     */
    public get width(): number {
        return this.mSize.width;
    } set width(pValue: number) {
        this.resize(pValue, this.mSize.height);
    }

    /**
     * Constuctor.
     * @param pDevice - Gpu device reference.
     * @param pWidth - Textures width.
     * @param pHeight - Textures height.
     * @param pMultisampleLevel - Multisample level of all buffer textures.
     */
    public constructor(pDevice: GpuDevice, pWidth: number, pHeight: number, pMultisampleLevel: number) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        // Set "fixed" 
        this.mSize = { width: pWidth, height: pHeight };
        this.mMultisampleLevel = pMultisampleLevel;

        // Saved.
        this.mBufferTextures = new Dictionary<string, FrameBufferTexture>();
        this.mTargetTextures = new Dictionary<string, CanvasTexture>();
    }

    /**
     * Add buffer texture to group.
     * Uses multisample values.
     * @param pName - Texture name.
     * @param pType - Texture type.
     */
    public addBuffer(pName: string, pType: RenderBufferType): FrameBufferTexture {
        // Validate existing buffer textures.
        if (this.mBufferTextures.has(pName)) {
            throw new Exception(`Buffer texture "${pName}" already exists.`, this);
        }

        // Create correct memory layout for texture type.
        let lMemoryLayout: TextureMemoryLayout;
        switch (pType) {
            case 'Color': {
                lMemoryLayout = this.createColorMemoryLayout(this.mMultisampleLevel > 1);
                break;
            }
            case 'Depth': {
                lMemoryLayout = this.createDepthMemoryLayout(this.mMultisampleLevel > 1);
                break;
            }
        }

        // Create new texture and assign multisample level.
        const lTexture: FrameBufferTexture = lMemoryLayout.createFrameBufferTexture(this.mSize.height, this.mSize.width, 1);
        lTexture.multiSampleLevel = this.mMultisampleLevel;

        // Set buffer texture.
        this.mBufferTextures.set(pName, lTexture);

        return lTexture;
    }

    /**
     * Add target texture to group.
     * Ignores multisample values.
     * @param pName - Texture name.
     * @param pType - Texture type.
     */
    public addTarget(pName: string): CanvasTexture {
        // Validate existing target textures.
        if (this.mTargetTextures.has(pName)) {
            throw new Exception(`Target texture "${pName}" already exists.`, this);
        }

        // Create correct memory layout for texture type.
        const lMemoryLayout: TextureMemoryLayout = this.createCanvasMemoryLayout();
        const lTexture: CanvasTexture = lMemoryLayout.createCanvasTexture(this.mSize.height, this.mSize.width);

        // Set target texture.
        this.mTargetTextures.set(pName, lTexture);

        return lTexture;
    }

    public addColorBuffer(pBufferName: string, pClearValue: number, pLoadOp: TextureOperation, pStoreOp: TextureOperation, pTargetName?: string): void {
        // Read texture buffer from texture group.
        const lColorBuffer: FrameBufferTexture = this.mTextureGroup.getBufferTextureOf(pBufferName);

        // Read potential target buffer.
        let lTargetBuffer: CanvasTexture | null = null;
        if (pTargetName) {
            lTargetBuffer = this.mTextureGroup.getTargetTextureOf(pTargetName);

            // Add update listener.
            lTargetBuffer.addInvalidationListener(() => {
                this.triggerAutoUpdate(UpdateReason.ChildData);
            });
        }

        // Add update listener.
        lColorBuffer.addInvalidationListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });

        this.mColorBuffer.push({
            texture: lColorBuffer,
            clearValue: pClearValue,
            loadOperation: pLoadOp,
            storeOperation: pStoreOp,
            resolveTarget: lTargetBuffer
        });
    }

    /**
     * Set depth and or stencil buffer.
     * @param pBufferName - Buffer Texture name.
     * @param pClearValue - Clear value in hex 0xffffff.
     * @param pLoadOp - Operation on load.
     * @param pStoreOp - Operation on store.
     */
    public setDepthStencilBuffer(pBufferName: string, pClearValue: number, pLoadOp: TextureOperation, pStoreOp: TextureOperation): void {
        // Read texture buffer from texture group.
        const lDepthBuffer: FrameBufferTexture = this.mTextureGroup.getBufferTextureOf(pBufferName);

        // Validate depth or stencil format.
        switch (lDepthBuffer.memoryLayout.format) {
            case TextureFormat.Depth:
            case TextureFormat.DepthStencil:
            case TextureFormat.Stencil: {
                break;
            }
            default: {
                throw new Exception('Depth and or stencil buffer needs to have depth or stencil texture formats.', this);
            }
        }

        // Update depth buffer update listener.
        if (this.mDepthBuffer) {
            this.mDepthBuffer.texture.removeInvalidationListener(this.onDepthBufferUpdate);
        }
        lDepthBuffer.addInvalidationListener(this.onDepthBufferUpdate);

        // Set new buffer.
        this.mDepthBuffer = {
            texture: lDepthBuffer,
            depthClearValue: pClearValue,
            depthLoadOperation: pLoadOp,
            depthStoreOperation: pStoreOp,
            stencilClearValue: pClearValue,
            stencilLoadOperation: pLoadOp,
            stencilStoreOperation: pStoreOp,
        };
    }

    /**
     * Get buffer texture.
     * @param pName - texture name.
     */
    public getBufferTextureOf(pName: string): FrameBufferTexture {
        // Validate existing canvas.
        if (this.mBufferTextures.has(pName)) {
            throw new Exception(`Buffer texture "${pName}" not found.`, this);
        }

        return this.mBufferTextures.get(pName)!;
    }

    /**
     * Get target texture.
     * @param pName - texture name.
     */
    public getTargetTextureOf(pName: string): CanvasTexture {
        // Validate existing canvas.
        if (this.mTargetTextures.has(pName)) {
            throw new Exception(`Target texture "${pName}" not found.`, this);
        }

        return this.mTargetTextures.get(pName)!;
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
        // Create color attachments.
        const lColorAttachments: Array<GPURenderPassColorAttachment> = new Array<GPURenderPassColorAttachment>();
        for (const lColorAttachment of this.colorBuffer) {
            // Convert clear value from hex values to Float[3] range from 0..1.
            const lClearColor: [number, number, number] = [
                (lColorAttachment.clearValue & 0xff0000 >> 4) / 255,
                (lColorAttachment.clearValue & 0xff00 >> 2) / 255,
                (lColorAttachment.clearValue & 0xff) / 255,
            ];

            // Convert Texture operation to load operations.
            const lLoadOperation: GPULoadOp = lColorAttachment.loadOperation === TextureOperation.Keep ? 'load' : 'clear';
            const lStoreOperation: GPUStoreOp = lColorAttachment.storeOperation === TextureOperation.Keep ? 'store' : 'discard';

            // Create basic color attachment.
            const lPassColorAttachment: GPURenderPassColorAttachment = {
                view: lColorAttachment.texture.native,
                clearValue: lClearColor,
                loadOp: lLoadOperation,
                storeOp: lStoreOperation
            };

            // Resolve optional resolve attachment but only when texture uses multisample.
            if (lColorAttachment.resolveTarget && this.multisampleCount > 1) {
                lPassColorAttachment.resolveTarget = lColorAttachment.resolveTarget.native;
            }

            lColorAttachments.push(lPassColorAttachment);
        }

        // Create descriptor with color attachments.
        const lDescriptor: GPURenderPassDescriptor = {
            colorAttachments: lColorAttachments
        };

        // Set optional depth attachment.
        if (this.depthStencilBuffer) {
            const lDepthStencilAttachment = this.depthStencilBuffer;

            // Add texture view for depth.
            lDescriptor.depthStencilAttachment = {
                view: lDepthStencilAttachment.texture.native,
            };

            // Add depth values when depth formats are used.
            if (lDepthStencilAttachment.texture.memoryLayout.format === TextureFormat.DepthStencil || lDepthStencilAttachment.texture.memoryLayout.format === TextureFormat.Depth) {
                // Convert clear value from hex values to Float range from 0..1.
                lDescriptor.depthStencilAttachment.depthClearValue = (lDepthStencilAttachment.depthClearValue & 0xff) / 255;

                // Convert Texture operation to load operations.
                lDescriptor.depthStencilAttachment.depthLoadOp = lDepthStencilAttachment.depthLoadOperation === TextureOperation.Keep ? 'load' : 'clear';
                lDescriptor.depthStencilAttachment.depthStoreOp = lDepthStencilAttachment.depthStoreOperation === TextureOperation.Keep ? 'store' : 'discard';
            }

            // Add stencil values when stencil formats are used.
            if (lDepthStencilAttachment.texture.memoryLayout.format === TextureFormat.DepthStencil || lDepthStencilAttachment.texture.memoryLayout.format === TextureFormat.Stencil) {
                // Convert clear value from hex values to Float range from 0..1.
                lDescriptor.depthStencilAttachment.stencilClearValue = (lDepthStencilAttachment.stencilClearValue & 0xff) / 255;

                // Convert Texture operation to load operations.
                lDescriptor.depthStencilAttachment.stencilLoadOp = lDepthStencilAttachment.stencilLoadOperation === TextureOperation.Keep ? 'load' : 'clear';
                lDescriptor.depthStencilAttachment.stencilStoreOp = lDepthStencilAttachment.stencilStoreOperation === TextureOperation.Keep ? 'store' : 'discard';
            }
        }

        return lDescriptor;
    }

    /**
     * Create layout for a canvas texture.
     */
    private createCanvasMemoryLayout(): TextureMemoryLayout {
        return new TextureMemoryLayout(this.device, {
            dimension: TextureDimension.TwoDimension,
            format: TextureFormat.RedGreenBlueAlpha,
            bindType: TextureBindType.RenderTarget,
            multisampled: false,
            access: AccessMode.Write | AccessMode.Read,
            bindingIndex: null,
            name: '',
            visibility: ComputeStage.Fragment
        });
    }

    /**
     * Create layout for a color texture.
     */
    private createColorMemoryLayout(pMultisampled: boolean): TextureMemoryLayout {
        return new TextureMemoryLayout(this.device, {
            dimension: TextureDimension.TwoDimension,
            format: TextureFormat.RedGreenBlueAlpha,
            bindType: TextureBindType.RenderTarget,
            multisampled: pMultisampled,
            access: AccessMode.Write | AccessMode.Read,
            bindingIndex: null,
            name: '',
            visibility: ComputeStage.Fragment
        });
    }

    /**
     * Create layout for a depth texture.
     */
    private createDepthMemoryLayout(pMultisampled: boolean): TextureMemoryLayout {
        return new TextureMemoryLayout(this.device, {
            dimension: TextureDimension.TwoDimension,
            format: TextureFormat.Depth,
            bindType: TextureBindType.RenderTarget,
            multisampled: pMultisampled,
            access: AccessMode.Write | AccessMode.Read,
            bindingIndex: null,
            name: '',
            visibility: ComputeStage.Fragment
        });
    }

    /**
     * Resize all textures.
     * @param pWidth - Textures width.
     * @param pHeight - Textures height.
     */
    private resize(pWidth: number, pHeight: number): void {
        // Update size.
        this.mSize.width = pWidth;
        this.mSize.width = pHeight;

        // Update buffer texture sizes.
        for (const lTexture of this.mBufferTextures.values()) {
            lTexture.height = pHeight;
            lTexture.height = pWidth;
        }

        // Update target texture sizes.
        for (const lTexture of this.mTargetTextures.values()) {
            lTexture.height = pHeight;
            lTexture.height = pWidth;
        }
    }
}

type TextureSize = { width: number; height: number; };

type RenderBufferType = 'Color' | 'Depth';