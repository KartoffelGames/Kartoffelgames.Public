import { Exception } from '@kartoffelgames/core.data';
import { Gpu } from '../gpu';
import { GpuNativeObject } from '../gpu-native-object';
import { Attachments } from './attachments';
import { Attachment } from './type/attachment';

export class RenderPassDescriptor extends GpuNativeObject<GPURenderPassDescriptor> {
    private readonly mAttachments: Attachments;
    private readonly mColorAttachments: Array<RenderPassColorAttachment>;
    private mDepthStencilAttachment: RenderPassDepthStencilAttachment | null;

    /**
     * Get render targets.
     */
    public get colorAttachments(): Array<Attachment> {
        const lTargets: Array<Attachment> = new Array<Attachment>();
        for (const lColorAttachment of this.mColorAttachments) {
            lTargets.push(lColorAttachment.attachment);
        }

        return lTargets;
    }

    /**
     * Get depth attachment of render pass.
     */
    public get depthAttachment(): Attachment | undefined {
        if (!this.mDepthStencilAttachment) {
            return undefined;
        }

        return this.mDepthStencilAttachment.attachment;
    }

    /**
     * Constructor.
     * @param pGpu - Gpu.
     * @param pAttachments - Attachments. 
     */
    public constructor(pGpu: Gpu, pAttachments: Attachments) {
        super(pGpu, 'RENDER_PASS_DESCRIPTOR');

        // Set statics.
        this.mAttachments = pAttachments;

        // Init lists and defaults.
        this.mColorAttachments = new Array<RenderPassColorAttachment>();
        this.mDepthStencilAttachment = null;
    }

    /**
     * Set color attachment.
     * @param pAttachmentName - Attachment name.
     * @param pClearValue - Clear value.
     * @param pLoadOp - Load operation.
     * @param pStoreOp - Store operation.
     */
    public setColorAttachment(pLocation: number, pAttachmentName: string, pClearValue: GPUColor, pLoadOp?: GPULoadOp, pStoreOp?: GPUStoreOp,): void {
        // Validate attachment existence.
        if (!this.mAttachments.hasAttachment(pAttachmentName)) {
            throw new Exception(`Attachment "${pAttachmentName}" does not exist.`, this);
        }

        const lAttachment: Attachment = this.mAttachments.getAttachment(pAttachmentName);

        // Update internal object.
        if (this.mColorAttachments[pLocation]) {
            this.unregisterInternalNative(this.mColorAttachments[pLocation].attachment);
        }
        this.registerInternalNative(lAttachment);

        // Setup depth attachment.
        this.mColorAttachments[pLocation] = {
            attachment: lAttachment,
            clearValue: pClearValue,
            loadOp: pLoadOp ?? 'clear', // Apply default value.
            storeOp: pStoreOp ?? 'store', // Apply default value.
        };

        this.triggerChange();
    }

    /**
     * Set depth attachment.
     * @param pAttachmentName - Attachment name.
     * @param pClearValue - Clear value.
     * @param pLoadOp - Load operation.
     * @param pStoreOp - Store operation.
     */
    public setDepthAttachment(pAttachmentName: string, pClearValue: number, pLoadOp?: GPULoadOp, pStoreOp?: GPUStoreOp,): void {
        // Validate attachment existence.
        if (!this.mAttachments.hasAttachment(pAttachmentName)) {
            throw new Exception(`Attachment "${pAttachmentName}" does not exist.`, this);
        }

        const lAttachment: Attachment = this.mAttachments.getAttachment(pAttachmentName);

        // Update internal object.
        if (this.mDepthStencilAttachment) {
            this.unregisterInternalNative(this.mDepthStencilAttachment.attachment);
        }
        this.registerInternalNative(lAttachment);

        // Setup depth attachment.
        this.mDepthStencilAttachment = {
            attachment: lAttachment,
            clearValue: pClearValue,
            loadOp: pLoadOp ?? 'clear', // Apply default value.
            storeOp: pStoreOp ?? 'store', // Apply default value.
        };

        this.triggerChange();
    }

    /**
     * Generate render pass descriptor.
     */
    protected override async generate(): Promise<GPURenderPassDescriptor> {
        // Create color attachments.
        const lColorAttachments: Array<GPURenderPassColorAttachment> = new Array<GPURenderPassColorAttachment>();
        for (const lColorAttachment of this.mColorAttachments) {
            lColorAttachments.push({
                view: await lColorAttachment.attachment.native(),
                clearValue: lColorAttachment.clearValue,
                loadOp: lColorAttachment.loadOp,
                storeOp: lColorAttachment.storeOp
            });
        }

        // Create descriptor with color attachments.
        const lDescriptor: GPURenderPassDescriptor = {
            colorAttachments: lColorAttachments
        };

        // Set optional depth attachment.
        if (this.mDepthStencilAttachment) {
            lDescriptor.depthStencilAttachment = {
                view: await this.mDepthStencilAttachment.attachment.native(),
                depthClearValue: this.mDepthStencilAttachment.clearValue,
                depthLoadOp: this.mDepthStencilAttachment.loadOp,
                depthStoreOp: this.mDepthStencilAttachment.storeOp
            };
        }

        return lDescriptor;
    }
}

type RenderPassColorAttachment = {
    attachment: Attachment,
    clearValue: GPUColor;
    loadOp: GPULoadOp;
    storeOp: GPUStoreOp;
};

type RenderPassDepthStencilAttachment = {
    attachment: Attachment,
    clearValue: number;
    loadOp: GPULoadOp;
    storeOp: GPUStoreOp;
};