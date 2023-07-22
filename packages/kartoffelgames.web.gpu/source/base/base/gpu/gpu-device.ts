import { IGpuDevice } from '../../interface/gpu/i-gpu-device.interface';
import { ArrayBufferMemoryLayoutParameter } from '../../interface/memory_layout/buffer/i-array-buffer.memory-layout.interface';
import { LinearBufferMemoryLayoutParameter } from '../../interface/memory_layout/buffer/i-linear-buffer-memory-layout.interface';
import { StructBufferMemoryLayoutParameter } from '../../interface/memory_layout/buffer/i-struct-buffer.memory-layout.interface';
import { SamplerMemoryLayoutParameter } from '../../interface/memory_layout/i-sampler-memory-layout.interface';
import { TextureMemoryLayoutParameter } from '../../interface/memory_layout/i-texture-memory-layout.interface';
import { ArrayBufferMemoryLayout } from '../memory_layout/buffer/array-buffer-memory-layout';
import { LinearBufferMemoryLayout } from '../memory_layout/buffer/linear-buffer-memory-layout';
import { StructBufferMemoryLayout } from '../memory_layout/buffer/struct-buffer-memory-layout';
import { SamplerMemoryLayout } from '../memory_layout/sampler-memory-layout';
import { TextureMemoryLayout } from '../memory_layout/texture-memory-layout';

export abstract class GpuDevice implements IGpuDevice{
    /**
     * Create array buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract arrayMemoryLayout(pParameter: ArrayBufferMemoryLayoutParameter): ArrayBufferMemoryLayout<this>;

    /**
     * Create array buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract linearMemoryLayout(pParameter: LinearBufferMemoryLayoutParameter): LinearBufferMemoryLayout<this>;

    /**
     * Create sampler memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract samplerMemoryLayout(pParameter: SamplerMemoryLayoutParameter): SamplerMemoryLayout<this>;

    /**
     * Create struct buffer memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract structMemoryLayout(pParameter: StructBufferMemoryLayoutParameter): StructBufferMemoryLayout<this>;

    /**
     * Create texture memory layout.
     * @param pParameter - Memory layout parameter.
     */
    public abstract textureMemoryLayout(pParameter: TextureMemoryLayoutParameter): TextureMemoryLayout<this>;
}
