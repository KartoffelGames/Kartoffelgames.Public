import { Buffer as BaseBuffer } from './buffer/buffer';
import { GpuDevice as BaseGpuDevice } from './gpu/gpu-device';
import { ArrayBufferMemoryLayout as BaseArrayBufferMemoryLayout } from './memory_layout/buffer/array-buffer-memory-layout';
import { BufferMemoryLayout as BaseBufferMemoryLayout } from './memory_layout/buffer/buffer-memory-layout';
import { StructBufferMemoryLayout as BaseStructBufferMemoryLayout } from './memory_layout/buffer/struct-buffer-memory-layout';
import { SamplerMemoryLayout as BaseSamplerMemoryLayout } from './memory_layout/sampler-memory-layout';
import { TextureMemoryLayout as BaseTextureMemoryLayout } from './memory_layout/texture-memory-layout';
import { ShaderInformation as BaseShaderInformation } from './shader/shader-information';
import { FrameBufferTexture as BaseFrameBufferTexture } from './texture/frame-buffer-texture';
import { ImageTexture as BaseImageTexture } from './texture/image-texture';
import { TextureSampler as BaseTextureSampler } from './texture/texture-sampler';
import { VideoTexture as BaseVideoTexture } from './texture/video-texture';

export namespace Base {
    // GPU Base
    export const GpuDevice = BaseGpuDevice;

    // Memory layout.
    export const BufferMemoryLayout = BaseBufferMemoryLayout;
    export const ArrayBufferMemoryLayout = BaseArrayBufferMemoryLayout;
    export const StructBufferMemoryLayout = BaseStructBufferMemoryLayout;
    export const TextureMemoryLayout = BaseTextureMemoryLayout;
    export const SamplerMemoryLayout = BaseSamplerMemoryLayout;

    // Buffer.
    export const Buffer = BaseBuffer;

    // Texture
    export const TextureSampler = BaseTextureSampler;
    export const FrameBufferTexture = BaseFrameBufferTexture;
    export const VideoTexture = BaseVideoTexture;
    export const ImageTexture = BaseImageTexture;

    // Shader.
    export const ShaderInformation = BaseShaderInformation;
}