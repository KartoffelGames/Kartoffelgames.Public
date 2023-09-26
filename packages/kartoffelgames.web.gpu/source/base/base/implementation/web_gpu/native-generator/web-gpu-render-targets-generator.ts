import { Exception } from '@kartoffelgames/core.data';
import { GpuBuffer } from '../../../buffer/gpu-buffer';
import { BaseNativeGenerator, NativeObjectLifeTime } from '../../../generator/base-native-generator';
import { CanvasTexture } from '../../../texture/canvas-texture';
import { FrameBufferTexture } from '../../../texture/frame-buffer-texture';
import { ImageTexture } from '../../../texture/image-texture';
import { TextureSampler } from '../../../texture/texture-sampler';
import { VideoTexture } from '../../../texture/video-texture';
import { NativeWebGpuMap } from '../web-gpu-generator-factory';

export class WebGpuBindDataGroupGenerator extends BaseNativeGenerator<NativeWebGpuMap, 'renderTargets'> {
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
            ]

            // Convert Texture operation to load operations.
            const lLoadOperation: GPULoadOp = lColorAttachment.loadOp === TextureOperation.Keep ? 'load' : 'clear';
            const lStoreOperation: GPULoadOp = lColorAttachment.storeOp === TextureOperation.Keep ? 'keep' : 'dismiss';

            // Create basic color attachment.
            const lPassColorAttachment: GPURenderPassColorAttachment = {
                view: this.factory.request<'frameBufferTexture'>(lPassColorAttachment.attachment).create(),
                clearValue: lClearColor,
                loadOp: lLoadOperation,
                storeOp: lStoreOperation
            };

            // Resolve optional resolve attachment but only when texture uses multisample.
            if (lColorAttachment.resolveTarget && this.gpuObject.multisampled) {
                lPassColorAttachment.resolveTarget = this.factory.request<'canvasTexture'>(lPassColorAttachment.resolveTarget).create();
            }

            lColorAttachments.push(lPassColorAttachment);
        }

        // Create descriptor with color attachments.
        const lDescriptor: GPURenderPassDescriptor = {
            colorAttachments: lColorAttachments
        };

        // Set optional depth attachment.
        if (this.gpuObject.depthStencilBuffer) {
            const lDepthStencilAttachment = this.gpuObject.depthStencilBuffer

            // Convert clear value from hex values to Float range from 0..1.
            const lClearColor: [number, number, number] = (lDepthStencilAttachment.clearValue & 0xff) / 255;

            // Convert Texture operation to load operations.
            const lLoadOperation: GPULoadOp = lColorAttachment.loadOp === TextureOperation.Keep ? 'load' : 'clear';
            const lStoreOperation: GPULoadOp = lColorAttachment.storeOp === TextureOperation.Keep ? 'keep' : 'dismiss';

            // TODO: Add stencil or buffer options based on texture format.

            lDescriptor.depthStencilAttachment = {
                view: this.factory.request<'frameBufferTexture'>(lDepthStencilAttachment.attachment).create(),
                depthClearValue: lClearColor,
                depthLoadOp: lLoadOperation,
                depthStoreOp: lStoreOperation
            };
        }

        return lDescriptor;
    }
}