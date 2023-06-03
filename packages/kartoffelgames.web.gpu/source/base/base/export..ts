import { Buffer as BaseBuffer } from './buffer/buffer';
import { GpuDevice as BaseGpuDevice } from './gpu/gpu-device';
import { BufferMemoryLayout as BaseBufferMemoryLayout } from './memory_layout/buffer-memory-layout';
import { TextureMemoryLayout as BaseTextureMemoryLayout } from './memory_layout/texture-memory-layout';
import { SamplerMemoryLayout as BaseSamplerMemoryLayout } from './memory_layout/sampler-memory-layout';
import { TextureSampler as BaseTextureSampler } from './texture/texture-sampler';
import { FrameBufferTexture as BaseFrameBufferTexture } from './texture/frame-buffer-texture';
import { VideoTexture as BaseVideoTexture } from './texture/video-texture';
import { ImageTexture as BaseImageTexture } from './texture/image-texture';

export namespace Base {
    // GPU Base
    export const GpuDevice = BaseGpuDevice;

    // Memory layout.
    export const BufferMemoryLayout = BaseBufferMemoryLayout;
    export const TextureMemoryLayout = BaseTextureMemoryLayout;
    export const SamplerMemoryLayout = BaseSamplerMemoryLayout;

    // Buffer.
    export const Buffer = BaseBuffer;

    // Texture
    export const TextureSampler = BaseTextureSampler;
    export const FrameBufferTexture = BaseFrameBufferTexture;
    export const VideoTexture = BaseVideoTexture;
    export const ImageTexture = BaseImageTexture;
}