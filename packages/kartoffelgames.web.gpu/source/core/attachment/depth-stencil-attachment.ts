import { BaseAttachment } from './base-attachment';

export class DepthStencilAttachment extends BaseAttachment<GPURenderPassDepthStencilAttachment> {
    /**
     * Get attachment as render pass attachment.
     */
    public renderPassAttachment(): GPURenderPassDepthStencilAttachment {
        // Convert color to number.
        let lClearValue: number = 0;
        if ('r' in this.mAttachment.clearValue) {
            const lColorDict: GPUColorDict = this.mAttachment.clearValue;
            lClearValue = lColorDict.r + lColorDict.g + lColorDict.b + lColorDict.a;
        } else {
            for (const lValue of this.mAttachment.clearValue) {
                lClearValue += lValue;
            }
        }

        // Convert to depth stencil attachment,
        return {
            view: this.mAttachment.view,
            depthClearValue: lClearValue,
            depthLoadOp: this.mAttachment.loadOp,
            depthStoreOp: this.mAttachment.storeOp
        };
    }
}