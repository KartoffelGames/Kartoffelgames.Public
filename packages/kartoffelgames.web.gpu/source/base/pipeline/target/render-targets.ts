import { Exception } from '@kartoffelgames/core';
import { TextureFormat } from '../../../constant/texture-format.enum';
import { TextureOperation } from '../../../constant/texture-operation.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuNativeObject, NativeObjectLifeTime } from '../../gpu/gpu-native-object';
import { GpuObjectUpdateReason, UpdateReason } from '../../gpu/gpu-object-update-reason';
import { CanvasTexture } from '../../texture/canvas-texture';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';
import { TextureGroup } from './texture-group';

export class RenderTargets extends GpuNativeObject<GPURenderPassDescriptor> {
    private readonly mColorBuffer: Array<RenderTargetColorTexture>;
    private mDepthBuffer: RenderTargetDepthStencilTexture | null;
    private readonly mTextureGroup: TextureGroup;

    /**
     * Get all color buffer.
     */
    public get colorBuffer(): Array<RenderTargetColorTexture> {
        return this.mColorBuffer;
    }

    /**
     * Get depth stencil buffer.
     */
    public get depthStencilBuffer(): RenderTargetDepthStencilTexture | null {
        return this.mDepthBuffer;
    }

    /**
     * Render targets multisamples count.
     */
    public get multisampleCount(): number {
        return this.mTextureGroup.multiSampleLevel;
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pTextureGroup - Texture group.
     */
    public constructor(pDevice: GpuDevice, pTextureGroup: TextureGroup) {
        super(pDevice, NativeObjectLifeTime.Persistent);

        this.mTextureGroup = pTextureGroup;
        this.mColorBuffer = new Array<RenderTargetColorTexture>();

        this.mDepthBuffer = null;
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

    protected override destroy(pNative: GPURenderPassDescriptor, pReasons: GpuObjectUpdateReason): void {
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
                view: this.factory.request<'frameBufferTexture'>(lColorAttachment.texture).create(),
                clearValue: lClearColor,
                loadOp: lLoadOperation,
                storeOp: lStoreOperation
            };

            // Resolve optional resolve attachment but only when texture uses multisample.
            if (lColorAttachment.resolveTarget && this.multisampleCount > 1) {
                lPassColorAttachment.resolveTarget = this.factory.request<'canvasTexture'>(lColorAttachment.resolveTarget).create();
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
                view: this.factory.request<'frameBufferTexture'>(lDepthStencilAttachment.texture).create(),
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
     * Call auto update onbuffer data update.
     */
    private onDepthBufferUpdate(): void {
        this.triggerAutoUpdate(UpdateReason.ChildData);
    }
}

type RenderTargetColorTexture = {
    texture: FrameBufferTexture,
    clearValue: number;
    loadOperation: TextureOperation;
    storeOperation: TextureOperation;
    resolveTarget: CanvasTexture | null;
};

type RenderTargetDepthStencilTexture = {
    texture: FrameBufferTexture,
    depthClearValue: number;
    depthLoadOperation: TextureOperation;
    depthStoreOperation: TextureOperation;
    stencilClearValue: number;
    stencilLoadOperation: TextureOperation;
    stencilStoreOperation: TextureOperation;
};