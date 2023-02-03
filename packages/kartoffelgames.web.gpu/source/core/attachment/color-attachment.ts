import { BaseAttachment } from './base-attachment';

export class ColorAttachment extends BaseAttachment<GPURenderPassColorAttachment> {

    /**
     * Get attachment as render pass attachment.
     * @param pName - Attachment name.
     */
    public asAttachment(pName: string): GPURenderPassColorAttachment | undefined {
        const lAttachment = this.mAttachments.get(pName);
        if (!lAttachment) {
            return undefined;
        }

        // Convert to color attachment,
        return {
            view: lAttachment.view,
            clearValue: <GPUColor>lAttachment.clearValue,
            loadOp: lAttachment.loadOp,
            storeOp: lAttachment.storeOp
        };
    }
}