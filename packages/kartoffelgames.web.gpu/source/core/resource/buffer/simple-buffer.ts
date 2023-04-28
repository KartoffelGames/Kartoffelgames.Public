import { TypedArray } from '@kartoffelgames/core.data';
import { Gpu } from '../../gpu';
import { BaseBuffer } from './base-buffer';

export class SimpleBuffer<T extends TypedArray> extends BaseBuffer<T> {
    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pUsage - Buffer usage beside COPY_DST.
     * @param pInitialData  - Inital data. Can be empty.
     */
    public constructor(pGpu: Gpu, pUsage: GPUFlagsConstant, pInitialData: T) {
        super(pGpu, pUsage | GPUBufferUsage.COPY_DST, pInitialData);
    }

    /**
     * Request buffer write.
     * @param pBufferCallback - Callback called on buffer access.
     */
    public write(pBufferCallback: (pBuffer: T) => void): void {
        const lBuffer: GPUBuffer = this.native();

        // Create new typed array and add new data to this new array.
        const lSourceBuffer: T = new this.type(this.length);
        pBufferCallback(lSourceBuffer);

        // Write copied buffer.
        this.gpu.device.queue.writeBuffer(lBuffer, 0, lSourceBuffer, 0, lSourceBuffer.length);
    }
}