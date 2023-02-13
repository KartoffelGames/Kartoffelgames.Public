import { TypedArray } from '@kartoffelgames/core.data';
import { Gpu } from '../gpu';
import { BaseBuffer } from './base-buffer';

export class RingBuffer<T extends TypedArray> extends BaseBuffer<T> {
    private readonly mStagingBufferList: Array<GPUBuffer>;

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pUsage - Buffer usage beside COPY_DST.
     * @param pItemCount - Buffer size.
     * @param pInitialData  - Inital data. Can be empty.
     */
    public constructor(pGpu: Gpu, pUsage: GPUFlagsConstant, pItemCount: number, pInitialData: T) {
        super(pGpu, pUsage, pItemCount, pInitialData);

        // Waving stagin buffer list.
        this.mStagingBufferList = new Array<GPUBuffer>();
    }

    /**
     * Request buffer write.
     * @param pBufferCallback - Callback called on buffer access.
     */
    public async write(pBufferCallback: (pBuffer: T) => Promise<void>): Promise<void> {
        // Create new buffer when no mapped buffer is available. 
        let lStagingBuffer: GPUBuffer;
        if (this.mStagingBufferList.length === 0) {
            lStagingBuffer = this.gpu.device.createBuffer({
                size: this.size,
                usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
                mappedAtCreation: true,
            });
        } else {
            lStagingBuffer = this.mStagingBufferList.pop()!;
        }

        // Execute write operations.
        const lBufferArray: T = new this.type(lStagingBuffer.getMappedRange());
        await pBufferCallback(lBufferArray);

        // Unmap for copying data.
        lStagingBuffer.unmap();

        // Copy buffer data from staging into wavig buffer.
        const lCommandDecoder: GPUCommandEncoder = this.gpu.device.createCommandEncoder();
        lCommandDecoder.copyBufferToBuffer(lStagingBuffer, 0, await this.native(), 0, this.size);
        this.gpu.device.queue.submit([lCommandDecoder.finish()]);

        // Shedule staging buffer remaping.
        lStagingBuffer.mapAsync(GPUMapMode.WRITE).then(() => {
            this.mStagingBufferList.push(lStagingBuffer);
        });
    }
}
