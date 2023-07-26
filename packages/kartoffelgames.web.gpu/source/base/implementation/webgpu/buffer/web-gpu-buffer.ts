import { TypedArray } from '@kartoffelgames/core.data';
import { Buffer } from '../../../base/buffer/buffer';
import { BindType } from '../../../constant/bind-type.enum';
import { MemoryType } from '../../../constant/memory-type.enum';
import { WebGpuDevice, WebGpuTypes } from '../web-gpu-device';

export class WebGpuBuffer<T extends TypedArray> extends Buffer<WebGpuTypes, T, GPUBuffer>  {
    private readonly mDataType: BufferDataType<T>;

    private readonly mReadyBufferList: Array<GPUBuffer>;
    private readonly mWavingBufferList: Array<GPUBuffer>;

    /**
     * Buffer size in bytes aligned to 4 bytes.
     */
    public get size(): number {
        return ((this.initialData.length * this.mDataType.BYTES_PER_ELEMENT) + 3) & ~3;
    }

    /**
     * Constructor.
     * @param pDevice - GPU.
     * @param pLayout - Buffer layout.
     * @param pInitialData  - Inital data. Can be empty.
     */
    public constructor(pDevice: WebGpuDevice, pLayout: WebGpuTypes['bufferMemoryLayout'], pInitialData: T) {
        super(pDevice, pLayout, pInitialData);

        this.mDataType = <BufferDataType<T>>pInitialData.constructor;

        // Waving buffer list.
        this.mReadyBufferList = new Array<GPUBuffer>();
        this.mWavingBufferList = new Array<GPUBuffer>();
    }

    /**
     * Read data raw without layout.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public async readRaw(pOffset?: number, pSize?: number): Promise<T> {
        // Get buffer and map data.
        const lBuffer: GPUBuffer = this.native;
        await lBuffer.mapAsync(GPUMapMode.READ, pOffset, pSize);

        // Get mapped data and force it into typed array.
        const lData = new this.mDataType(lBuffer.getMappedRange());
        return lData;
    }

    /**
     * Write data raw without layout.
     * @param pData - Data.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public async writeRaw(pData: T, pOffset?: number, pSize?: number): Promise<void> {
        // Create new buffer when no mapped buffer is available. 
        let lStagingBuffer: GPUBuffer;
        if (this.mReadyBufferList.length === 0) {
            lStagingBuffer = this.device.device.createBuffer({
                label: `RingBuffer-WaveBuffer-${this.mWavingBufferList.length}`,
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
        const lBufferArray: T = new this.mDataType(lStagingBuffer.getMappedRange(pOffset, pSize));
        lBufferArray.set(pData);

        // Unmap for copying data.
        lStagingBuffer.unmap();

        // Copy buffer data from staging into wavig buffer.
        const lCommandDecoder: GPUCommandEncoder = this.device.device.createCommandEncoder();
        lCommandDecoder.copyBufferToBuffer(lStagingBuffer, 0, this.native, 0, this.size);
        this.device.device.queue.submit([lCommandDecoder.finish()]);

        // Shedule staging buffer remaping.
        lStagingBuffer.mapAsync(GPUMapMode.WRITE).then(() => {
            this.mReadyBufferList.push(lStagingBuffer);
        });
    }

    /**
     * Destroy buffer object.
     */
    protected destroyNative(pNativeObject: GPUBuffer): void {
        pNativeObject.destroy();

        // Destroy all wave buffer and clear list.
        for (let lCount: number = 0; this.mWavingBufferList.length < lCount; lCount++) {
            this.mWavingBufferList.pop()?.destroy();
        }

        // Clear ready buffer list.
        for (let lCount: number = 0; this.mReadyBufferList.length < lCount; lCount++) {
            this.mReadyBufferList.pop();
        }
    }

    /**
     * Generate native. Concat buffer usage bits from bind type and buffer usage.
     */
    protected override generate(): GPUBuffer {
        let lUsage: number = 0;

        // Append usage type from abstract bind type.
        switch (this.memoryLayout.bindType) {
            case BindType.Attribute: {
                // Just an layout indicator. Does nothing to usage type.
                break;
            }
            case BindType.Index: {
                lUsage |= GPUBufferUsage.INDEX;
                break;
            }
            case BindType.Storage: {
                lUsage |= GPUBufferUsage.STORAGE;
                break;
            }
            case BindType.Uniform: {
                lUsage |= GPUBufferUsage.UNIFORM;
                break;
            }
            case BindType.Vertex: {
                lUsage |= GPUBufferUsage.VERTEX;
                break;
            }
        }

        // Append usage type from abstract usage type.
        if ((this.memoryLayout.memoryType & MemoryType.CopyDestination) !== 0) {
            lUsage |= GPUBufferUsage.COPY_DST;
        }
        if ((this.memoryLayout.memoryType & MemoryType.CopySource) !== 0) {
            lUsage |= GPUBufferUsage.COPY_SRC;
        }

        // Create gpu buffer mapped
        const lBuffer: GPUBuffer = this.device.device.createBuffer({
            label: 'Ring-Buffer-Static-Buffer',
            size: this.size,
            usage: lUsage,
            mappedAtCreation: true // Map data when buffer would receive initial data.
        });

        const lData = new this.mDataType(lBuffer.getMappedRange());
        lData.set(this.initialData, 0);

        // unmap buffer.
        lBuffer.unmap();

        return lBuffer;
    }
}

type BufferDataType<T extends TypedArray> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    BYTES_PER_ELEMENT: number;
    new(pInitValues: ArrayBuffer | number | TypedArray): T;
};