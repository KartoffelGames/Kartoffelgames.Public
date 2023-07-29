import { TypedArray } from '@kartoffelgames/core.data';
import { LinearBufferMemoryLayout, LinearBufferMemoryLayoutParameter } from '../../../../base/memory_layout/buffer/linear-buffer-memory-layout';
import { WebGpuBuffer } from '../../buffer/web-gpu-buffer';
import { WebGpuDevice, WebGpuTypes } from '../../web-gpu-device';

export class WebGpuLinearBufferMemoryLayout extends LinearBufferMemoryLayout<WebGpuTypes> {
    /**
     * Constructor.
     * @param pDevice - Device reference.
     * @param pParameter - Creation parameter.
     */
    public constructor(pDevice: WebGpuDevice, pParameter: LinearBufferMemoryLayoutParameter) {
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