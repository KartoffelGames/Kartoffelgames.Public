import { Exception } from '@kartoffelgames/core.data';
import { TextureGroup } from './texture-group';
import { GpuObject } from '../../gpu/gpu-object';
import { GpuDevice } from '../../gpu/gpu-device';
import { FrameBufferTexture } from '../../texture/frame-buffer-texture';
import { CanvasTexture } from '../../texture/canvas-texture';
import { UpdateReason } from '../../gpu/gpu-object-update-reason';
import { TextureOperation } from '../../../constant/texture-operation';
import { TextureFormat } from '../../../constant/texture-format.enum';


export class RenderTargets extends GpuObject<'renderTargets'> {
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
        super(pDevice);

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
            lTargetBuffer.addUpdateListener(() => {
                this.triggerAutoUpdate(UpdateReason.ChildData);
            });
        }

        // Add update listener.
        lColorBuffer.addUpdateListener(() => {
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
            this.mDepthBuffer.texture.removeUpdateListener(this.onDepthBufferUpdate);
        }
        lDepthBuffer.addUpdateListener(this.onDepthBufferUpdate);

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