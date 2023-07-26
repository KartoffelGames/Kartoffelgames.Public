import { TypedArray } from '@kartoffelgames/core.data';
import { ArrayBufferMemoryLayout, ArrayBufferMemoryLayoutParameter } from '../../../../base/memory_layout/buffer/array-buffer-memory-layout';
import { WebGpuBuffer } from '../../buffer/web-gpu-buffer';
import { WebGpuDevice, WebGpuTypes } from '../../web-gpu-device';

export class WebGpuArrayBufferMemoryLayout extends ArrayBufferMemoryLayout<WebGpuTypes> {
    /**
     * Alignment of type.
     */
    public get alignment(): number {
        return this.innerType.alignment;
    }

    /**
     * Type size in byte.
     */
    public get size(): number {
        if (this.arraySize === -1) {
            return this.arraySize;
        }

        return this.arraySize * (Math.ceil(this.innerType.size / this.innerType.alignment) * this.innerType.alignment);
    }

    /**
     * Constructor.
     * @param pDevice - Device reference..
     * @param pParameter - Creation parameter.
     */
    public constructor(pDevice: WebGpuDevice, pParameter: ArrayBufferMemoryLayoutParameter<WebGpuTypes>) {
        super(pDevice, pParameter);
    }

    /**
     * Create buffer from layout.
     * @param pInitialData - Initial buffer data. Defines buffer length.
     */
    protected override createBuffer<TType extends TypedArray>(pInitialData: TType): WebGpuBuffer<TType> {
        return new WebGpuBuffer<TType>(this.device, this, pInitialData);
    }
}