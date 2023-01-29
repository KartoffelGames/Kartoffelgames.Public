import { Gpu } from '../gpu';
import { BaseBuffer, TypedArray } from './base-buffer';

export class Buffer<T extends TypedArray> extends BaseBuffer<T> {
    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pUsage - Buffer usage beside COPY_DST.
     * @param pItemCount - Buffer size.
     * @param pInitialData  - Inital data. Can be empty.
     */
    public constructor(pGpu: Gpu, pUsage: GPUFlagsConstant, pItemCount: number, pInitialData: T) {
        const lUsage = pUsage | GPUBufferUsage.COPY_DST; // Extend buffer usage by copy destination.
        super(pGpu, pItemCount, lUsage, pInitialData);
    }

    /**
     * Request buffer write.
     * @param pBufferCallback - Callback called on buffer access.
     */
    public async write(pBufferCallback: (pBuffer: T) => Promise<void>): Promise<void> {
        // Map buffer.
        return this.buffer.mapAsync(GPUMapMode.WRITE).then(async () => {
            // Execute write operations.
            const lBufferArray: T = new this.type(this.buffer.getMappedRange());
            await pBufferCallback(lBufferArray);

            // Unmap buffer after write action.
            this.buffer.unmap();
        });
    }
}