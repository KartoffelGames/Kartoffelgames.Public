import { BaseAttachment } from './base-attachment';

export class CanvasAttachment extends BaseAttachment<GPURenderPassColorAttachment> {
    private readonly mContext: GPUCanvasContext;

    public constructor(pContext: GPUCanvasContext) {
        const lTexture: GPUTexture = pContext.getCurrentTexture();

        super({
            texture: lTexture,
            view: lTexture.createView(),
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: 'clear',
            storeOp: 'store',
            format: window.navigator.gpu.getPreferredCanvasFormat(),
            dimension: '2d',
            arrayLayerCount: 1,
            baseArrayLayer: 0,
        });

        this.mContext = pContext;
    }

    /**
     * Get attachment as render pass attachment.
     */
    public renderPassAttachment(): GPURenderPassColorAttachment {
        const lTexture: GPUTexture = this.mContext.getCurrentTexture();

        // Convert to color attachment,
        return {
            view: lTexture.createView(),
            clearValue: this.mAttachment.clearValue,
            loadOp: this.mAttachment.loadOp,
            storeOp: this.mAttachment.storeOp
        };
    }
}