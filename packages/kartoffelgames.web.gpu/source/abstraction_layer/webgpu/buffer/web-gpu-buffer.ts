import { Exception, TypedArray } from '@kartoffelgames/core.data';
import { WebGpuDevice } from '../web-gpu-device';
import { GpuNativeObject } from '../gpu-native-object';

/**
 * Web gpu buffer. Allways uses ring buffer.
 */
export class WebGpuBuffer<T extends TypedArray> extends GpuNativeObject<GPUBuffer> {
    private readonly mBufferLength: number;
    private readonly mBufferUsage: GPUFlagsConstant;
    private readonly mDataType: BufferDataType<T>;
    private mInitData: T | null;
    private readonly mReadyBufferList: Array<GPUBuffer>;
    private readonly mWavingBufferList: Array<GPUBuffer>;

    /**
     * Buffer size in items.
     */
    public get length(): number {
        return this.mBufferLength;
    }

    /**
     * Buffer size in bytes aligned to 4 bytes.
     */
    public get size(): number {
        return ((this.mBufferLength * this.type.BYTES_PER_ELEMENT) + 3) & ~3;
    }

    /**
     * Underlying data type.
     */
    public get type(): BufferDataType<T> {
        return this.mDataType;
    }

    /**
     * Constructor.
     * @param pGpu - GPU.
     * @param pUsage - Buffer usage beside COPY_DST.
     * @param pData  - Inital data. Can be empty.
     */
    public constructor(pGpu: WebGpuDevice, pUsage: GPUFlagsConstant, pData: T) {
        super(pGpu, 'BUFFER');

        this.mBufferUsage = pUsage;
        this.mInitData = pData;
        this.mBufferLength = pData.length;
        this.mDataType = <BufferDataType<T>>pData.constructor;

        // Waving buffer list.
        this.mReadyBufferList = new Array<GPUBuffer>();
        this.mWavingBufferList = new Array<GPUBuffer>();
    }

    /**
     * Read data from buffer.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public async read(pOffset?: number, pSize?: number): Promise<T> {
        // Get buffer and map data.
        const lBuffer: GPUBuffer = this.native();
        await lBuffer.mapAsync(GPUMapMode.READ, pOffset, pSize);

        // Get mapped data and force it into typed array.
        const lData = new this.mDataType(lBuffer.getMappedRange());
        return lData;
    }

    /**
     * Request buffer write.
     * @param pBufferCallback - Callback called on buffer access.
     * @param pOffset - Write offset into buffer.
     * @param pSize - Write size.
     */
    public write(pBufferCallback: (pBuffer: T) => void, pOffset: number = 0, pSize?: number): void {
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
     * Destroy native object.
     * @param pNativeObject - Native object.
     */
    protected override destroyNative(pNativeObject: GPUBuffer): void {
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
     * Generate native object.
     */
    protected generate(): GPUBuffer {
        // Generate new empty init data.
        if (!this.mInitData) {
            this.mInitData = new this.mDataType(this.mBufferLength);
        }

        // Create gpu buffer mapped
        const lBuffer: GPUBuffer = this.gpu.device.createBuffer({
            label: this.label,
            size: this.size,
            usage: this.mBufferUsage,
            mappedAtCreation: this.mInitData.length > 0 // Map data when buffer would receive initial data.
        });

        // Copy only when data is available.
        if (this.mInitData.length > 0) {
            if (this.mInitData.length > this.size) {
                throw new Exception('Buffer data exeedes buffer size.', this);
            }

            const lData = new this.mDataType(lBuffer.getMappedRange());
            lData.set(this.mInitData, 0);

            // unmap buffer.
            lBuffer.unmap();
        }

        // Clear init data.
        this.mInitData = null;

        return lBuffer;
    }
}

export type BufferDataType<T extends TypedArray> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    BYTES_PER_ELEMENT: number;
    new(pInitValues: ArrayBuffer | number | TypedArray): T;
};