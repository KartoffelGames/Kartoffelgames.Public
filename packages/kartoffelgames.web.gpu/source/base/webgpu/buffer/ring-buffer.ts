import { TypedArray } from '@kartoffelgames/core.data';
import { IBuffer } from '../../interface/buffer/i-buffer.interface';
import { WebGpuBuffer } from '../../../abstraction_layer/webgpu/buffer/web-gpu-buffer';
import { WebGpuDevice } from '../../../abstraction_layer/webgpu/web-gpu-device';
import { BufferLayout } from './buffer_layout/buffer-layout';
import { IBufferLayout } from '../../interface/buffer/i-buffer-layout.interface';

export class RingBuffer<T extends TypedArray> extends WebGpuBuffer<T> implements IBuffer<T>{
    private readonly mLayout: BufferLayout;
    private readonly mReadyBufferList: Array<GPUBuffer>;
    private readonly mWavingBufferList: Array<GPUBuffer>;

    /**
     * Buffer layout.
     */
    public get layout(): IBufferLayout {
        return this.mLayout;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pUsage - Buffer usage beside COPY_DST.
     * @param pInitialData  - Inital data. Can be empty.
     */
    public constructor(pGpu: WebGpuDevice, pLayout: BufferLayout, pUsage: GPUFlagsConstant, pInitialData: T) {
        super(pGpu, pUsage | GPUBufferUsage.COPY_DST, pInitialData);
        this.mLayout = pLayout;

        // Waving buffer list.
        this.mReadyBufferList = new Array<GPUBuffer>();
        this.mWavingBufferList = new Array<GPUBuffer>();
    }

    /**
     * Read buffer on layout location.
     * @param pLayoutPath - Layout path. 
     */
    public async read(pLayoutPath: Array<string>): Promise<T> {
        const lLocation = this.mLayout.locationOf(pLayoutPath);
        return this.readRaw(lLocation.offset, lLocation.size);
    }

    /**
     * Read data raw without layout.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public async readRaw(pOffset?: number, pSize?: number): Promise<T> {
        return this.readData(pOffset, pSize);
    }

    /**
     * Write data on layout location.
     * @param pData - Data.
     * @param pLayoutPath - Layout path.
     */
    public async write(pData: T, pLayoutPath: Array<string>): Promise<void> {
        const lLocation = this.mLayout.locationOf(pLayoutPath);

        // Skip new promise creation by returning original promise.
        return this.writeRaw(pData, lLocation.offset, lLocation.size);
    }

    /**
     * Request buffer write.
     * @param pBufferCallback - Callback called on buffer access.
     */
    public override writeData(pBufferCallback: (pBuffer: T) => void, pOffset: number = 0, pSize?: number): void {
        // Create new buffer when no mapped buffer is available. 
        let lStagingBuffer: GPUBuffer;
        if (this.mReadyBufferList.length === 0) {
            lStagingBuffer = this.gpu.device.createBuffer({
                label: `RingBuffer-WaveBuffer-${this.label}`,
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
        const lBufferArray: T = new this.type(lStagingBuffer.getMappedRange(pOffset, pSize));
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
     * Write data raw without layout.
     * @param pData - Data.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public async writeRaw(pData: T, pOffset?: number, pSize?: number): Promise<void> {
        // Data write is synchron.
        this.writeData((pBuffer: T) => {
            pBuffer.set(pData);
        }, pOffset, pSize);
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
