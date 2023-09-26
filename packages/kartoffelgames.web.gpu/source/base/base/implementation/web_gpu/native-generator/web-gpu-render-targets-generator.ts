import { TextureFormat } from '../../../../constant/texture-format.enum';
import { TextureOperation } from '../../../../constant/texture-operation';
import { BaseNativeGenerator, NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { NativeWebGpuMap } from '../web-gpu-generator-factory';

export class WebGpuRenderTargetsGenerator extends BaseNativeGenerator<NativeWebGpuMap, 'renderTargets'> {
    /**
     * Set life time of generated native.
     */
    protected override get nativeLifeTime(): NativeObjectLifeTime {
        return NativeObjectLifeTime.Persistent;
    }

    /**
     * Generate native gpu bind data group.
     */
    protected override generate(): GPURenderPassDescriptor {
        // Create color attachments.
        const lColorAttachments: Array<GPURenderPassColorAttachment> = new Array<GPURenderPassColorAttachment>();
        for (const lColorAttachment of this.gpuObject.colorBuffer) {
            // Convert clear value from hex values to Float[3] range from 0..1.
            const lClearColor: [number, number, number] = [
                (lColorAttachment.clearValue & 0xff0000 >> 4) / 255,
                (lColorAttachment.clearValue & 0xff00 >> 2) / 255,
                (lColorAttachment.clearValue & 0xff) / 255,
            ];

            // Convert Texture operation to load operations.
            const lLoadOperation: GPULoadOp = lColorAttachment.loadOp === TextureOperation.Keep ? 'load' : 'clear';
            const lStoreOperation: GPUStoreOp = lColorAttachment.storeOp === TextureOperation.Keep ? 'store' : 'discard';

            // Create basic color attachment.
            const lPassColorAttachment: GPURenderPassColorAttachment = {
                view: this.factory.request<'frameBufferTexture'>(lColorAttachment.attachment).create(),
                clearValue: lClearColor,
                loadOp: lLoadOperation,
                storeOp: lStoreOperation
            };

            // Resolve optional resolve attachment but only when texture uses multisample.
            if (lColorAttachment.resolveTarget && this.gpuObject.multisampled) {
                lPassColorAttachment.resolveTarget = this.factory.request<'canvasTexture'>(lColorAttachment.resolveTarget).create();
            }

            lColorAttachments.push(lPassColorAttachment);
        }

        // Create descriptor with color attachments.
        const lDescriptor: GPURenderPassDescriptor = {
            colorAttachments: lColorAttachments
        };

        // Set optional depth attachment.
        if (this.gpuObject.depthStencilBuffer) {
            const lDepthStencilAttachment = this.gpuObject.depthStencilBuffer;

            // Add texture view for depth.
            lDescriptor.depthStencilAttachment = {
                view: this.factory.request<'frameBufferTexture'>(lDepthStencilAttachment.attachment).create(),
            };

            // Add depth values when depth formats are used.
            if (lDepthStencilAttachment.attachment.memoryLayout.format === TextureFormat.DepthStencil || lDepthStencilAttachment.attachment.memoryLayout.format === TextureFormat.Depth) {
                // Convert clear value from hex values to Float range from 0..1.
                lDescriptor.depthStencilAttachment.depthClearValue = (lDepthStencilAttachment.clearValue & 0xff) / 255;

                // Convert Texture operation to load operations.
                lDescriptor.depthStencilAttachment.depthLoadOp = lDepthStencilAttachment.loadOp === TextureOperation.Keep ? 'load' : 'clear';
                lDescriptor.depthStencilAttachment.depthStoreOp = lDepthStencilAttachment.storeOp === TextureOperation.Keep ? 'store' : 'discard';
            }

            // Add stencil values when stencil formats are used.
            if (lDepthStencilAttachment.attachment.memoryLayout.format === TextureFormat.DepthStencil || lDepthStencilAttachment.attachment.memoryLayout.format === TextureFormat.Stencil) {
                // TODO:
            }
        }

        return lDescriptor;
    }
}