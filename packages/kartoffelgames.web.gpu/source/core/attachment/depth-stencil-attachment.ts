import { BaseAttachment } from './base-attachment';

export class DepthStencilAttachment extends BaseAttachment<GPURenderPassDepthStencilAttachment> {

    /**
     * Get attachment as render pass attachment.
     * @param pName - Attachment name.
     */
    public asAttachment(pName: string): GPURenderPassDepthStencilAttachment | undefined {
        const lAttachment = this.mAttachments.get(pName);
        if (!lAttachment) {
            return undefined;
        }

        // Convert to depth stencil attachment,
        return {
            view: lAttachment.view,
            depthClearValue: <number>lAttachment.clearValue,
            depthLoadOp: lAttachment.loadOp,
            depthStoreOp: lAttachment.storeOp
        };
    }
}