import { BaseAttachment } from './base-attachment';

export class ColorAttachment extends BaseAttachment<GPURenderPassColorAttachment> {
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