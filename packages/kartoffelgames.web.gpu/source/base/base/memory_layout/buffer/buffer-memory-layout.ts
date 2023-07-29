import { Exception, TypedArray } from '@kartoffelgames/core.data';
import { GpuTypes } from '../../gpu/gpu-device';
import { MemoryLayout, MemoryLayoutParameter } from '../memory-layout';
import { BufferBindType } from '../../../constant/buffer-bind-type.enum';

export abstract class BufferMemoryLayout<TGpuType extends GpuTypes> extends MemoryLayout<TGpuType> {
    private readonly mBindType: BufferBindType;
    private mParent: TGpuType['bufferMemoryLayout'] | null;

    /**
     * Type byte alignment.
     */
    public abstract readonly alignment: number;

    /**
     * Buffer size in bytes.
     */
    public abstract readonly size: number;

    /**
     * Buffer bind type.
     */
    public get bindType(): BufferBindType {
        return this.mBindType;
    }

    /**
     * Parent type. Stuct or Array.
     */
    public get parent(): TGpuType['bufferMemoryLayout'] | null {
        return this.mParent;
    } public set parent(pValue: TGpuType['bufferMemoryLayout'] | null) {
        this.mParent = pValue;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pGpu: TGpuType['gpuDevice'], pParameter: BufferMemoryLayoutParameter) {
        super(pGpu, pParameter);

        // Static properties.
        this.mBindType = pParameter.bindType;
        this.mParent = null;
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

export interface BufferMemoryLayoutParameter extends MemoryLayoutParameter {
    bindType: BufferBindType;
}

export type BufferLayoutLocation = {
    offset: number;
    size: number;
};