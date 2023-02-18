import { BaseAttachment } from './base-attachment';

export class ColorAttachment extends BaseAttachment<GPURenderPassColorAttachment> {
    /**
     * Generate color attachment.
     */
    protected async generate(): Promise<GPURenderPassColorAttachment> {
        const lTexture: GPUTexture = await this.attachment.texture.native();

        // Generate view.
        const lView: GPUTextureView = lTexture.createView({
            dimension: this.attachment.dimension,
            baseArrayLayer: this.attachment.baseArrayLayer,
            arrayLayerCount: this.attachment.arrayLayerCount,
        });

        
        return {
            view: lView,
            clearValue: this.attachment.clearValue,
            loadOp: this.attachment.loadOp,
            storeOp: this.attachment.storeOp
        };
    }
}