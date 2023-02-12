import { BaseAttachment } from './base-attachment';

export class CanvasAttachment extends BaseAttachment<GPURenderPassColorAttachment> {
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
    }

    /**
     * Get attachment as render pass attachment.
     */
    public renderPassAttachment(): GPURenderPassColorAttachment {
        // Convert to color attachment,
        return {
            view: this.mAttachment.view,
            clearValue: this.mAttachment.clearValue,
            loadOp: this.mAttachment.loadOp,
            storeOp: this.mAttachment.storeOp
        };
    }
}