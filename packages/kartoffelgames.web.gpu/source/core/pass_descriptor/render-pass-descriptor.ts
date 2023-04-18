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
            lTargets.push(this.mAttachments.getAttachment(lColorAttachment.attachmentName));
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

        return this.mAttachments.getAttachment(this.mDepthStencilAttachment.attachmentName);
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

        // Setup depth attachment.
        this.mColorAttachments[pLocation] = {
            attachmentName: pAttachmentName,
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

        // Setup depth attachment.
        this.mDepthStencilAttachment = {
            attachmentName: pAttachmentName,
            clearValue: pClearValue,
            loadOp: pLoadOp ?? 'clear', // Apply default value.
            storeOp: pStoreOp ?? 'store', // Apply default value.
        };

        this.triggerChange();
    }

    /**
     * Destory native object.
     * @param _pNativeObject - Native object.
     */
    protected override async destroyNative(_pNativeObject: GPURenderPassDescriptor): Promise<void> {
        // Nothing to destroy.
    }

    /**
     * Generate render pass descriptor.
     */
    protected override async generate(): Promise<GPURenderPassDescriptor> {
        // Create color attachments.
        const lColorAttachments: Array<GPURenderPassColorAttachment> = new Array<GPURenderPassColorAttachment>();
        for (const lColorAttachment of this.mColorAttachments) {
            const lAttachment: Attachment = this.mAttachments.getAttachment(lColorAttachment.attachmentName);
            lColorAttachments.push({
                view: await lAttachment.native(),
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
            const lAttachment: Attachment = this.mAttachments.getAttachment(this.mDepthStencilAttachment.attachmentName);
            lDescriptor.depthStencilAttachment = {
                view: await lAttachment.native(),
                depthClearValue: this.mDepthStencilAttachment.clearValue,
                depthLoadOp: this.mDepthStencilAttachment.loadOp,
                depthStoreOp: this.mDepthStencilAttachment.storeOp
            };
        }

        return lDescriptor;
    }

    protected override async validateState(_pNativeObject: GPURenderPassDescriptor): Promise<boolean> {
        return false; // TODO: Register attachment as native.
    }
}

type RenderPassColorAttachment = {
    attachmentName: string,
    clearValue: GPUColor;
    loadOp: GPULoadOp;
    storeOp: GPUStoreOp;
};

type RenderPassDepthStencilAttachment = {
    attachmentName: string,
    clearValue: number;
    loadOp: GPULoadOp;
    storeOp: GPUStoreOp;
};