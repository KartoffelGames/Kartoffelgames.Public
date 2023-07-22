import { ILinearBufferMemoryLayout, LinearBufferMemoryLayoutParameter } from '../../../interface/memory_layout/buffer/i-linear-buffer-memory-layout.interface';
import { GpuTypes } from '../../gpu/gpu-device';
import { BufferMemoryLayout } from './buffer-memory-layout';

export abstract class LinearBufferMemoryLayout<TGpuTypes extends GpuTypes> extends BufferMemoryLayout<TGpuTypes> implements ILinearBufferMemoryLayout {
    private readonly mAlignment: number;
    private readonly mSize: number;

    /**
     * Type byte alignment.
     */
    public get alignment(): number {
        return this.mAlignment;
    }

    /**
     * Buffer size in bytes.
     */
    public get size(): number {
        return this.mSize;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pGpu: TGpuTypes['gpuDevice'], pParameter: LinearBufferMemoryLayoutParameter) {
        super(pGpu, pParameter);

        // Static properties.
        this.mAlignment = pParameter.alignment;
        this.mSize = pParameter.size;
    }
}