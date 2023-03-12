import { BaseAttachment } from './base-attachment';

export class ColorAttachment extends BaseAttachment<GPURenderPassColorAttachment> {
    /**
     * Destory native object.
     * @param _pNativeObject - Native object.
     */
    protected async destroyNative(_pNativeObject: GPURenderPassColorAttachment): Promise<void> {
        // Nothing needed here.
    }

    /**
     * Generate color attachment.
     */
    protected async generate(): Promise<GPURenderPassColorAttachment> {
        const lTexture: GPUTexture = await this.attachment.frame.native();

        // Generate view.
        const lView: GPUTextureView = lTexture.createView({
            label: 'Texture-View' + this.attachment.frame.label,
            dimension: '2d',
            baseArrayLayer: this.attachment.baseArrayLayer,
            arrayLayerCount: this.attachment.layers,
        });

        return {
            view: lView,
            clearValue: this.attachment.clearValue,
            loadOp: this.attachment.loadOp,
            storeOp: this.attachment.storeOp
        };
    }
}