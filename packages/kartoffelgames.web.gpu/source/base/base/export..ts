import { Buffer as BaseBuffer } from './buffer/buffer';
import { GpuDevice as BaseGpuDevice } from './gpu/gpu-device';
import { BufferLayout as BaseBufferLayout } from './buffer/buffer-layout';
import { TextureSampler as BaseTextureSampler } from './texture/texture-sampler';
import { FrameBufferTexture as BaseFrameBufferTexture } from './texture/frame-buffer-texture';
import { VideoTexture as BaseVideoTexture } from './texture/video-texture';

export namespace Base {
    // GPU Base
    export const GpuDevice = BaseGpuDevice;

    // Buffer.
    export const BufferLayout = BaseBufferLayout;
    export const Buffer = BaseBuffer;

    // Texture
    export const TextureSampler = BaseTextureSampler;
    export const FrameBufferTexture = BaseFrameBufferTexture;
    export const VideoTexture = BaseVideoTexture;
}