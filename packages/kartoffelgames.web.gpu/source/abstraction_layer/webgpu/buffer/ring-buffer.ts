import { TypedArray } from '@kartoffelgames/core.data';
import { Gpu } from '../gpu';
import { BaseBuffer } from './base-buffer';

export class RingBuffer<T extends TypedArray> extends BaseBuffer<T> {
    private readonly mReadyBufferList: Array<GPUBuffer>;
    private readonly mWavingBufferList: Array<GPUBuffer>;

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pUsage - Buffer usage beside COPY_DST.
     * @param pInitialData  - Inital data. Can be empty.
     */
    public constructor(pGpu: Gpu, pUsage: GPUFlagsConstant, pInitialData: T) {
        super(pGpu, pUsage | GPUBufferUsage.COPY_DST, pInitialData);

        // Waving buffer list.
        this.mReadyBufferList = new Array<GPUBuffer>();
        this.mWavingBufferList = new Array<GPUBuffer>();
    }

    /**
     * Request buffer write.
     * @param pBufferCallback - Callback called on buffer access.
     */
    public write(pBufferCallback: (pBuffer: T) => void): void {
        // Create new buffer when no mapped buffer is available. 
        let lStagingBuffer: GPUBuffer;
        if (this.mReadyBufferList.length === 0) {
            lStagingBuffer = this.gpu.device.createBuffer({
                label: 'RingBuffer-WaveBuffer-' + this.label,
                size: this.size,
                usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
                mappedAtCreation: true,
            });

            // Add new buffer to complete list.
            this.mWavingBufferList.push(lStagingBuffer);
        } else {
            lStagingBuffer = this.mReadyBufferList.pop()!;
        }

        // Execute write operations.
        const lBufferArray: T = new this.type(lStagingBuffer.getMappedRange());
        pBufferCallback(lBufferArray);

        // Unmap for copying data.
        lStagingBuffer.unmap();

        // Copy buffer data from staging into wavig buffer.
        const lCommandDecoder: GPUCommandEncoder = this.gpu.device.createCommandEncoder();
        lCommandDecoder.copyBufferToBuffer(lStagingBuffer, 0, this.native(), 0, this.size);
        this.gpu.device.queue.submit([lCommandDecoder.finish()]);

        // Shedule staging buffer remaping.
        lStagingBuffer.mapAsync(GPUMapMode.WRITE).then(() => {
            this.mReadyBufferList.push(lStagingBuffer);
        });
    }

    /**
     * Destory all buffers.
     * @param pNativeObject - Native buffer object.
     */
    protected override destroyNative(pNativeObject: GPUBuffer): void {
        super.destroyNative(pNativeObject);

        // Destroy all wave buffer and clear list.
        for (let lCount: number = 0; this.mWavingBufferList.length < lCount; lCount++) {
            this.mWavingBufferList.pop()?.destroy();
        }

        // Clear ready buffer list.
        for (let lCount: number = 0; this.mReadyBufferList.length < lCount; lCount++) {
            this.mReadyBufferList.pop();
        }
    }
}
