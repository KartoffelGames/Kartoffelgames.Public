import { Exception, TypedArray } from '@kartoffelgames/core';
import { BufferUsage } from '../constant/buffer-usage.enum.ts';
import { GpuDevice } from '../device/gpu-device.ts';
import { GpuResourceObject, GpuResourceObjectInvalidationType } from '../gpu_object/gpu-resource-object.ts';
import { IGpuObjectNative } from '../gpu_object/interface/i-gpu-object-native.ts';
import { GpuBufferView, GpuBufferViewFormat } from './gpu-buffer-view.ts';
import { BaseBufferMemoryLayout } from './memory_layout/base-buffer-memory-layout.ts';

/**
 * GpuBuffer. Uses local and native gpu buffers.
 */
export class GpuBuffer extends GpuResourceObject<BufferUsage, GPUBuffer> implements IGpuObjectNative<GPUBuffer> {
    private mByteSize: number;
    private mInitialData: ArrayBufferLike | null | undefined;
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
    } set size(pByteCount: number) {
        // Calculate size. Align to 4 byte. Allways.
        this.mByteSize = ((pByteCount) + 3) & ~3;

        this.invalidate(GpuResourceObjectInvalidationType.ResourceRebuild);
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

        // Calculate size. Align to 4 byte. Allways.
        this.mByteSize = ((pByteCount) + 3) & ~3;

        // Allways add copy source/destination to copy over information on rebuild.
        this.extendUsage(BufferUsage.CopyDestination);
        this.extendUsage(BufferUsage.CopySource);

        // Read and write buffers.
        this.mWriteBuffer = {
            limitation: Number.MAX_SAFE_INTEGER,
            ready: new Array<GPUBuffer>(),
            buffer: new Set<GPUBuffer>()
        };
        this.mReadBuffer = null;

        // No intial data.
        this.mInitialData = null;
    }

    /**
     * Set new initial data before the buffer is created.
     * 
     * @param pDataCallback - Data callback. 
     */
    public initialData(pInitialData: ArrayBufferLike): this {
        // Initial is inital.
        if (this.mInitialData !== null) {
            throw new Exception('Initial callback can only be set once.', this);
        }

        // Set new initial data, set on creation.
        this.mInitialData = pInitialData;

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
     * @param pDynamicOffsetIndex - Index of dynamic offset.
     * 
     * @returns view of buffer. 
     */
    public view<T extends TypedArray>(pLayout: BaseBufferMemoryLayout, pType: GpuBufferViewFormat<T>, pDynamicOffsetIndex: number = 0): GpuBufferView<T> {
        return new GpuBufferView(this, pLayout, pType, pDynamicOffsetIndex);
    }

    /**
     * Write data raw without layout.
     * 
     * @param pData - Data.
     * @param pOffset - Data offset.
     */
    public async write(pData: ArrayBufferLike, pOffset?: number): Promise<void> {
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

        // Convert views into array buffers.
        let lDataArrayBuffer: ArrayBufferLike = pData;
        if (ArrayBuffer.isView(lDataArrayBuffer)) {
            lDataArrayBuffer = lDataArrayBuffer.buffer;
        }

        // Get byte length and offset of data to write.
        const lDataByteLength: number = lDataArrayBuffer.byteLength;
        const lOffset: number = pOffset ?? 0;

        // When no staging buffer is available, use the slow native.
        if (!lStagingBuffer) {
            // Write data into mapped range.
            this.device.gpu.queue.writeBuffer(lNative, lOffset, lDataArrayBuffer, 0, lDataByteLength);

            return;
        }

        // Execute write operations on waving buffer.
        const lMappedBuffer: ArrayBuffer = lStagingBuffer.getMappedRange(lOffset, lDataByteLength);

        // Set data to mapped buffer. Use the smallest available byte view (1 byte).
        new Int8Array(lMappedBuffer).set(new Int8Array(lDataArrayBuffer));

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
    protected override destroyNative(pNativeObject: GPUBuffer): void {
        pNativeObject.destroy();

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

    /**
     * Generate buffer. Write local gpu object data as initial native buffer data.
     */
    protected override generateNative(pLastNative: GPUBuffer | null): GPUBuffer {
        // Create gpu buffer mapped
        const lBuffer: GPUBuffer = this.device.gpu.createBuffer({
            label: 'Ring-Buffer-Static-Buffer',
            size: this.size,
            usage: this.usage,
            mappedAtCreation: !!this.mInitialData
        });

        // Write data. Is completly async.
        if (this.mInitialData) {
            // Convert views into array buffers.
            let lDataArrayBuffer: ArrayBufferLike = this.mInitialData;
            if (ArrayBuffer.isView(lDataArrayBuffer)) {
                lDataArrayBuffer = lDataArrayBuffer.buffer;
            }

            // Write initial data.
            const lMappedBuffer: ArrayBuffer = lBuffer.getMappedRange();

            // Validate buffer and initial data length.
            if (lMappedBuffer.byteLength !== lDataArrayBuffer.byteLength) {
                throw new Exception(`Initial buffer data (byte-length: ${lDataArrayBuffer.byteLength}) does not fit into buffer (length: ${lMappedBuffer.byteLength}). `, this);
            }

            // Set data to buffer. Use the smallest available byte view (1 byte).
            new Int8Array(lMappedBuffer).set(new Int8Array(lDataArrayBuffer));

            // Unmap buffer.
            lBuffer.unmap();

            // Clear inital data.
            this.mInitialData = undefined;
        }

        // Try to copy last data into new buffer.
        if (pLastNative) {
            const lCommandDecoder: GPUCommandEncoder = this.device.gpu.createCommandEncoder();
            lCommandDecoder.copyBufferToBuffer(pLastNative, 0, lBuffer, 0, Math.min(pLastNative.size, lBuffer.size));
            this.device.gpu.queue.submit([lCommandDecoder.finish()]);
        }

        return lBuffer;
    }
}

type GpuBufferWriteBuffer = {
    buffer: Set<GPUBuffer>;
    ready: Array<GPUBuffer>;
    limitation: number;
};