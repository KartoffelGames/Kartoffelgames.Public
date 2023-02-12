export abstract class BaseAttachment<TAttachment extends GPURenderPassColorAttachment | GPURenderPassDepthStencilAttachment> {
    protected readonly mAttachment: AttachmentTexture;

    /**
     * Texture format.
     */
    public get format(): GPUTextureFormat {
        return this.mAttachment.format;
    }

    /**
     * Texture view.
     */
    public get view(): GPUTextureView {
        return this.mAttachment.view;
    }

    /**
     * constructor.
     * @param pAttachment - Attachment.
     */
    public constructor(pAttachment: AttachmentTexture) {
        this.mAttachment = pAttachment;
    }

    /**
     * Get attachment as render pass attachment.
     * @param pName - Attachment name.
     */
    public abstract renderPassAttachment(): TAttachment;
}

export type AttachmentTexture = {
    texture: GPUTexture;
    view: GPUTextureView;
    clearValue: GPUColor;
    loadOp: GPULoadOp;
    storeOp: GPUStoreOp;

    format: GPUTextureFormat;
    dimension: GPUTextureViewDimension;
    arrayLayerCount: GPUIntegerCoordinate;
    baseArrayLayer: number,
}

