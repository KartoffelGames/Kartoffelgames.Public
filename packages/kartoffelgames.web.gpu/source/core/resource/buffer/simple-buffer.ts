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
        super(pGpu, pUsage, pInitialData);
    }

    /**
     * Request buffer write.
     * @param pBufferCallback - Callback called on buffer access.
     */
    public async write(pBufferCallback: (pBuffer: T) => Promise<void>): Promise<void> {
        const lBuffer: GPUBuffer = await this.native();

        // Map buffer.
        return lBuffer.mapAsync(GPUMapMode.WRITE).then(async () => {
            // Execute write operations.
            const lBufferArray: T = new this.type(lBuffer.getMappedRange());
            await pBufferCallback(lBufferArray);

            // Unmap buffer after write action.
            lBuffer.unmap();
        });
    }
}