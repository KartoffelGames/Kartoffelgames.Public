import { Exception, TypedArray } from '@kartoffelgames/core';
import { BufferBindType } from '../../../constant/buffer-bind-type.enum';
import { GpuBuffer } from '../../buffer/gpu-buffer';
import { GpuDevice } from '../../gpu/gpu-device';
import { BaseMemoryLayout, MemoryLayoutParameter } from '../base-memory-layout';

export abstract class BaseBufferMemoryLayout extends BaseMemoryLayout {
    private readonly mBindType: BufferBindType;
    private mParent: BaseBufferMemoryLayout | null;

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
    public get parent(): BaseBufferMemoryLayout | null {
        return this.mParent;
    } public set parent(pValue: BaseBufferMemoryLayout | null) {
        this.mParent = pValue;
    }

    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    public constructor(pGpu: GpuDevice, pParameter: BufferMemoryLayoutParameter) {
        super(pGpu, pParameter);

        // Static properties.
        this.mBindType = pParameter.bindType;
        this.mParent = null;
    }

    /**
     * Create buffer from current layout.
     * @param pInitialData - Inital buffer data.
     */
    public create<TType extends TypedArray>(pInitialData: TType): GpuBuffer<TType> {
        return new GpuBuffer<TType>(this.device, this, pInitialData);
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
}

export interface BufferMemoryLayoutParameter extends MemoryLayoutParameter {
    bindType: BufferBindType;
}

export type BufferLayoutLocation = {
    offset: number;
    size: number;
};