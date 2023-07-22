import { Exception, TypedArray } from '@kartoffelgames/core.data';
import { BufferLayoutLocation, BufferMemoryLayoutParameter, IBufferMemoryLayout } from '../../../interface/memory_layout/buffer/i-buffer-memory-layout.interface';
import { GpuTypes } from '../../gpu/gpu-device';
import { MemoryLayout } from '../memory-layout';

export abstract class BufferMemoryLayout<TGpuType extends GpuTypes> extends MemoryLayout<TGpuType> implements IBufferMemoryLayout {
    private readonly mParent: TGpuType['bufferMemoryLayout'] | null;

    /**
     * Type byte alignment.
     */
    public abstract readonly alignment: number;

    /**
     * Buffer size in bytes.
     */
    public abstract readonly size: number;

    /**
     * Parent type. Stuct or Array.
     */
    public get parent(): TGpuType['bufferMemoryLayout'] | null {
        return this.mParent;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pGpu: TGpuType['gpuDevice'], pParameter: BufferMemoryLayoutParameter) {
        super(pGpu, pParameter);

        // Static properties.
        this.mParent = pParameter.parent;
    }

    /**
     * Create buffer from current layout.
     * @param pInitialData - Inital buffer data.
     */
    public create<TType extends TypedArray>(pInitialData: TType): TGpuType['buffer'] {
        return this.createBuffer<TType>(pInitialData);
    }

    /**
     * Get location of path.
     * @param pPathName - Path name. Divided by dots.
     */
    public locationOf(pPathName: Array<string>): BufferLayoutLocation {
        // Only validate name.
        if (pPathName.length !== 0) {
            throw new Exception(`Simple buffer layout has no properties.`, this);
        }

        return { size: this.size, offset: 0 };
    }

    /**
     * Create buffer from layout.
     * @param pInitialData - Inital buffer data.
     */
    protected abstract createBuffer<TType extends TypedArray>(pInitialData: TType): TGpuType['buffer'];
}