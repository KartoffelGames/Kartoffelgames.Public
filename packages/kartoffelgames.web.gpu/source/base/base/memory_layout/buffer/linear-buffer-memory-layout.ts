import { GpuTypes } from '../../gpu/gpu-device';
import { BufferMemoryLayout, BufferMemoryLayoutParameter } from './buffer-memory-layout';

export abstract class LinearBufferMemoryLayout<TGpuTypes extends GpuTypes = GpuTypes> extends BufferMemoryLayout<TGpuTypes> {
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

export interface LinearBufferMemoryLayoutParameter extends BufferMemoryLayoutParameter {
    size: number;
    alignment: number;
}