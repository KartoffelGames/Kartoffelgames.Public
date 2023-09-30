import { BufferPrimitiveFormat } from '../../../constant/buffer-primitive-format';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseBufferMemoryLayout, BufferMemoryLayoutParameter } from './base-buffer-memory-layout';

export class LinearBufferMemoryLayout extends BaseBufferMemoryLayout {
    private readonly mAlignment: number;
    private readonly mFormat: BufferPrimitiveFormat;
    private readonly mSize: number;

    /**
     * Type byte alignment.
     */
    public get alignment(): number {
        return this.mAlignment;
    }

    /**
     * Primitive format
     */
    public get format(): BufferPrimitiveFormat {
        return this.mFormat;
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
    public constructor(pGpu: GpuDevice, pParameter: LinearBufferMemoryLayoutParameter) {
        super(pGpu, pParameter);

        // Static properties.
        this.mAlignment = pParameter.alignment;
        this.mSize = pParameter.size;
        this.mFormat = pParameter.primitiveFormat;
    }
}

export interface LinearBufferMemoryLayoutParameter extends BufferMemoryLayoutParameter {
    size: number;
    alignment: number;
    primitiveFormat: BufferPrimitiveFormat;
}