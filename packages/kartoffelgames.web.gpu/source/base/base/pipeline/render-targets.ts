import { Exception } from '@kartoffelgames/core.data';
import { TextureFormat } from '../../constant/texture-format.enum';
import { TextureOperation } from '../../constant/texture-operation';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { CanvasTexture } from '../texture/canvas-texture';
import { FrameBufferTexture } from '../texture/frame-buffer-texture';
import { TextureGroup } from './texture-group';
import { UpdateReason } from '../gpu/gpu-object-update-reason';

export class RenderTargets extends GpuObject<'renderTargets'> { // GPURenderPassDescriptor
    private readonly mColorBuffer: Array<RenderTargetTexture>;
    private mDepthBuffer: RenderTargetTexture | null;
    private readonly mTextureGroup: TextureGroup;

    /**
     * Get all color buffer.
     */
    protected get colorBuffer(): Array<RenderTargetTexture> {
        return this.mColorBuffer;
    }

    /**
     * Get depth stencil buffer.
     */
    protected get depthStencilBuffer(): RenderTargetTexture | null {
        return this.mDepthBuffer;
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     * @param pTextureGroup - Texture group.
     */
    public constructor(pDevice: GpuDevice, pTextureGroup: TextureGroup) {
        super(pDevice);

        this.mTextureGroup = pTextureGroup;
        this.mColorBuffer = new Array<RenderTargetTexture>();

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
            lTargetBuffer.addUpdateListener(() => {
                this.triggerAutoUpdate(UpdateReason.ChildData);
            });
        }

        // Add update listener.
        lColorBuffer.addUpdateListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });

        this.mColorBuffer.push({
            attachment: lColorBuffer,
            clearValue: pClearValue,
            loadOp: pLoadOp,
            storeOp: pStoreOp,
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
            this.mDepthBuffer.attachment.removeUpdateListener(this.onDepthBufferUpdate);
        }
        lDepthBuffer.addUpdateListener(this.onDepthBufferUpdate);

        // Set new buffer.
        this.mDepthBuffer = {
            attachment: lDepthBuffer,
            clearValue: pClearValue,
            loadOp: pLoadOp,
            storeOp: pStoreOp,
            resolveTarget: null
        };
    }

    /**
     * Call auto update onbuffer data update.
     */
    private onDepthBufferUpdate(): void {
        this.triggerAutoUpdate(UpdateReason.ChildData);
    }
}

type RenderTargetTexture = {
    attachment: FrameBufferTexture,
    clearValue: number;
    loadOp: TextureOperation;
    storeOp: TextureOperation;
    resolveTarget: CanvasTexture | null;
};