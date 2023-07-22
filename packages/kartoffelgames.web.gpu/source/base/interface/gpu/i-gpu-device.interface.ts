import { IArrayBufferMemoryLayout, ArrayBufferMemoryLayoutParameter } from '../memory_layout/buffer/i-array-buffer.memory-layout.interface';
import { ILinearBufferMemoryLayout, LinearBufferMemoryLayoutParameter } from '../memory_layout/buffer/i-linear-buffer-memory-layout.interface';
import { IStructBufferMemoryLayout, StructBufferMemoryLayoutParameter } from '../memory_layout/buffer/i-struct-buffer.memory-layout.interface';
import { ISamplerMemoryLayout, SamplerMemoryLayoutParameter } from '../memory_layout/i-sampler-memory-layout.interface';
import { ITextureMemoryLayout, TextureMemoryLayoutParameter } from '../memory_layout/i-texture-memory-layout.interface';

export interface IGpuDevice {
    /**
     * Create array buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    arrayMemoryLayout(pParameter: ArrayBufferMemoryLayoutParameter): IArrayBufferMemoryLayout;

    /**
     * Create array buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    linearMemoryLayout(pParameter: LinearBufferMemoryLayoutParameter): ILinearBufferMemoryLayout;

    /**
     * Create sampler memory layout.
     * @param pParameter - Memory layout parameter.
     */
    samplerMemoryLayout(pParameter: SamplerMemoryLayoutParameter): ISamplerMemoryLayout;

    /**
     * Create struct buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    structMemoryLayout(pParameter: StructBufferMemoryLayoutParameter): IStructBufferMemoryLayout;

    /**
     * Create texture memory layout.
     * @param pParameter - Memory layout parameter.
     */
    textureMemoryLayout(pParameter: TextureMemoryLayoutParameter): ITextureMemoryLayout;
}