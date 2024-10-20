import { Exception, TypedArray } from '@kartoffelgames/core';
import { BufferUsage } from '../constant/buffer-usage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObjectInvalidationReasons } from '../gpu/object/gpu-object-invalidation-reasons';
import { GpuResourceObject, GpuResourceObjectInvalidationType } from '../gpu/object/gpu-resource-object';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { GpuBufferView, GpuBufferViewFormat } from './gpu-buffer-view';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';

/**
 * GpuBuffer. Uses local and native gpu buffers.
 */
export class GpuBuffer extends GpuResourceObject<BufferUsage, GPUBuffer> implements IGpuObjectNative<GPUBuffer> {
    private readonly mByteSize: number;
    private mInitialDataCallback: (() => TypedArray) | null;
    private mReadBuffer: GPUBuffer | null;
    private readonly mWriteBuffer: GpuBufferWriteBuffer;

    /**
     * Native gpu object.
     */
    public override get native(): GPUBuffer {
        return super.native;
    }

    /**
     * Buffer size in bytes aligned to 4 bytes.
     */
    public get size(): number {
        // Align data size by 4 byte.
        return this.mByteSize;
    }

    /**
     * Write buffer limitation.
     * Limiting the amount of created staging buffer to perform reads.
     */
    public get writeBufferLimitation(): number {
        return this.mWriteBuffer.limitation;
    } set writeBufferLimitation(pLimit: number) {
        this.mWriteBuffer.limitation = pLimit;
    }

    /**
     * Constructor.
     * @param pDevice - GPU.
     * @param pLayout - Buffer layout.
     * @param pInitialData  - Inital data. Can be empty. Or Buffer size. 
     */
    public constructor(pDevice: GpuDevice, pByteCount: number) {
        super(pDevice);

        // Calculate size.
        this.mByteSize = ((pByteCount) + 3) & ~3;

        // Read and write buffers.
        this.mWriteBuffer = {
            limitation: Number.MAX_SAFE_INTEGER,
            ready: new Array<GPUBuffer>(),
            buffer: new Set<GPUBuffer>()
        };
        this.mReadBuffer = null;


        // No intial data.
        this.mInitialDataCallback = null;
    }

    /**
     * Set new initial data before the buffer is created.
     * 
     * @param pDataCallback - Data callback. 
     */
    public initialData(pDataCallback: () => TypedArray): this {
        // Set new initial data, set on creation.
        this.mInitialDataCallback = pDataCallback;

        // Trigger update.
        this.invalidate(GpuResourceObjectInvalidationType.ResourceRebuild);

        return this;
    }

    /**
     * Read data raw without layout.
     * 
     * @param pOffset - Data read offset in byte.
     * @param pSize - Data read size in byte.
     */
    public async read(pOffset?: number | undefined, pSize?: number | undefined): Promise<ArrayBuffer> {
        // Set buffer as writeable.
        this.extendUsage(BufferUsage.CopySource);

        const lOffset: number = pOffset ?? 0;
        const lSize: number = pSize ?? this.size - lOffset;

        // Create a new buffer when it is not already created.
        if (this.mReadBuffer === null) {
            this.mReadBuffer = this.device.gpu.createBuffer({
                label: `ReadWaveBuffer`,
                size: this.size,
                usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
                mappedAtCreation: false,
            });
        }

        // Copy buffer data from native into staging.
        const lCommandDecoder: GPUCommandEncoder = this.device.gpu.createCommandEncoder();
        lCommandDecoder.copyBufferToBuffer(this.native, lOffset, this.mReadBuffer, lOffset, lSize);
        this.device.gpu.queue.submit([lCommandDecoder.finish()]);

        // Get buffer and map data.
        await this.mReadBuffer.mapAsync(GPUMapMode.READ, lOffset, lSize);

        // Read result from mapped range and copy it with slice.
        const lBufferReadResult: ArrayBuffer = this.mReadBuffer.getMappedRange().slice(0);

        // Map read buffer again.
        this.mReadBuffer.unmap();

        // Get mapped data and force it into typed array.
        return lBufferReadResult;
    }

    /**
     * Create view of buffer.
     * 
     * @param pLayout - View layout.
     * @param pType - Type of view.
     * 
     * @returns view of buffer. 
     */
    public view<T extends TypedArray>(pLayout: BaseBufferMemoryLayout, pType: GpuBufferViewFormat<T>): GpuBufferView<T> {
        return new GpuBufferView(this, pLayout, pType);
    }

    /**
     * Write data raw without layout.
     * 
     * @param pData - Data.
     * @param pOffset - Data offset.
     */
    public async write<T extends TypedArray>(pData: T, pOffset?: number): Promise<void> {
        // Set buffer as writeable.
        this.extendUsage(BufferUsage.CopyDestination);

        // Read native before reading staging buffers.
        // On Native read, staging buffers can be destroyed.
        const lNative: GPUBuffer = this.native;

        // Try to read a mapped buffer from waving list.
        let lStagingBuffer: GPUBuffer | null = null;
        if (this.mWriteBuffer.ready.length === 0) {
            // Create new buffer when limitation is not meet.
            if (this.mWriteBuffer.buffer.size < this.mWriteBuffer.limitation) {
                lStagingBuffer = this.device.gpu.createBuffer({
                    label: `RingBuffer-WriteWaveBuffer-${this.mWriteBuffer.buffer.size}`,
                    size: this.size,
                    usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
                    mappedAtCreation: true,
                });

                // Add new buffer to complete list.
                this.mWriteBuffer.buffer.add(lStagingBuffer);
            }
        } else {
            // Pop as long as staging buffer is not destroyed or could not be found.
            lStagingBuffer = this.mWriteBuffer.ready.pop()!;
        }

        // Get byte length and offset of data to write.
        const lDataByteLength: number = pData.byteLength;
        const lOffset: number = pOffset ?? 0;

        // When no staging buffer is available, use the slow native.
        if (!lStagingBuffer) {
            // Write data into mapped range.
            this.device.gpu.queue.writeBuffer(lNative, lOffset, pData, 0, lDataByteLength);

            return;
        }

        // Execute write operations on waving buffer.
        const lMappedBuffer: ArrayBuffer = lStagingBuffer.getMappedRange(lOffset, lDataByteLength);

        // Set data to mapped buffer. Use the smallest available byte view (1 byte).
        new (<GpuBufferViewFormat<T>>pData.constructor)(lMappedBuffer).set(pData);

        // Unmap for copying data.
        lStagingBuffer.unmap();

        // Copy buffer data from staging into wavig buffer.
        const lCommandDecoder: GPUCommandEncoder = this.device.gpu.createCommandEncoder();
        lCommandDecoder.copyBufferToBuffer(lStagingBuffer, lOffset, lNative, lOffset, lDataByteLength);
        this.device.gpu.queue.submit([lCommandDecoder.finish()]);

        // Shedule staging buffer remaping.
        lStagingBuffer.mapAsync(GPUMapMode.WRITE).then(() => {
            // Check for destroyed state, it is destroyed when not in write buffer list.
            if (this.mWriteBuffer.buffer.has(lStagingBuffer)) {
                this.mWriteBuffer.ready.push(lStagingBuffer);
            }
        }).catch(() => {
            // Remove buffer when it could not be mapped.
            this.mWriteBuffer.buffer.delete(lStagingBuffer);
            lStagingBuffer.destroy();
        });
    }

    /**
     * Destroy wave and ready buffer.
     */
    protected override destroyNative(pNativeObject: GPUBuffer, pReason: GpuObjectInvalidationReasons<GpuResourceObjectInvalidationType>): void {
        pNativeObject.destroy();

        // Only clear staging buffers when buffer should be deconstructed, on any other invalidation, the size does not change.
        if (pReason.deconstruct) {
            // Destroy all wave buffer and clear list.
            for (const lWriteBuffer of this.mWriteBuffer.buffer) {
                lWriteBuffer.destroy();
            }
            this.mWriteBuffer.buffer.clear();

            // Clear ready buffer list.
            while (this.mWriteBuffer.ready.length > 0) {
                // No need to destroy. All buffers have already destroyed.
                this.mWriteBuffer.ready.pop();
            }
        }
    }

    /**
     * Generate buffer. Write local gpu object data as initial native buffer data.
     */
    protected override generateNative(): GPUBuffer {
        // Read optional initial data.
        const lInitalData: TypedArray | undefined = this.mInitialDataCallback?.();

        // Create gpu buffer mapped
        const lBuffer: GPUBuffer = this.device.gpu.createBuffer({
            label: 'Ring-Buffer-Static-Buffer',
            size: this.size,
            usage: this.usage,
            mappedAtCreation: !!lInitalData
        });

        // Write data. Is completly async.
        if (lInitalData) {
            // Write initial data.
            const lMappedBuffer: ArrayBuffer = lBuffer.getMappedRange();

            // Validate buffer and initial data length.
            if (lMappedBuffer.byteLength !== lInitalData.byteLength) {
                throw new Exception(`Initial buffer data (byte-length: ${lInitalData.byteLength}) does not fit into buffer (length: ${lMappedBuffer.byteLength}). `, this);
            }

            // Set data to buffer. Use the smallest available byte view (1 byte).
            new (<GpuBufferViewFormat<TypedArray>>lInitalData.constructor)(lMappedBuffer).set(lInitalData);
            
            //console.log(lMappedBuffer.byteLength, lOriginal, lSomething)

            // Unmap buffer.
            lBuffer.unmap();
        }

        return lBuffer;
    }
}

type GpuBufferWriteBuffer = {
    buffer: Set<GPUBuffer>;
    ready: Array<GPUBuffer>;
    limitation: number;
};