import { BaseAttachment } from './base-attachment';

export class DepthStencilAttachment extends BaseAttachment<GPURenderPassDepthStencilAttachment> {
    /**
     * Generate depth attachment.
     */
    protected async generate(): Promise<GPURenderPassDepthStencilAttachment> {
        // Convert color to number.
        let lClearValue: number = 0;
        if ('r' in this.attachment.clearValue) {
            const lColorDict: GPUColorDict = this.attachment.clearValue;
            lClearValue = (lColorDict.r + lColorDict.g + lColorDict.b + lColorDict.a) / 4;
        } else {
            let lValueCount: number = 0;
            for (const lValue of this.attachment.clearValue) {
                lClearValue += lValue;
                lValueCount++;
            }
            lClearValue /= lValueCount;
        }

        // Generate native gpu texture.
        const lTexture: GPUTexture = await this.attachment.texture.native();

        // Generate view.
        const lView: GPUTextureView = lTexture.createView({
            dimension: this.attachment.dimension,
            baseArrayLayer: this.attachment.baseArrayLayer,
            arrayLayerCount: this.attachment.arrayLayerCount,
        });

        // Convert to depth stencil attachment,
        return {
            view: lView,
            depthClearValue: lClearValue,
            depthLoadOp: this.attachment.loadOp,
            depthStoreOp: this.attachment.storeOp
        };
    }
}