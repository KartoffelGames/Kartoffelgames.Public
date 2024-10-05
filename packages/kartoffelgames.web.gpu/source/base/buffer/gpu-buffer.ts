import { Exception, TypedArray } from '@kartoffelgames/core';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';
import { GpuObjectLifeTime } from '../gpu/object/gpu-object-life-time.enum';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { PrimitiveBufferFormat } from '../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { GpuObjectInvalidationReasons } from '../gpu/object/gpu-object-invalidation-reasons';

/**
 * GpuBuffer. Uses local and native gpu buffers.
 */
export class GpuBuffer<TType extends TypedArray = TypedArray> extends GpuObject<GPUBuffer, GpuBufferInvalidationType> implements IGpuObjectNative<GPUBuffer> {
    private mBufferUsage: number;
    private readonly mDataType: PrimitiveBufferFormat;
    private mInitialDataCallback: (() => TType) | null;
    private readonly mItemCount: number;
    private readonly mLayout: BaseBufferMemoryLayout;
    private mReadBuffer: GPUBuffer | null;
    private readonly mWriteBuffer: GpuBufferWriteBuffer;

    /**
     * Data type of buffer.
     */
    public get dataType(): PrimitiveBufferFormat {
        return this.mDataType;
    }

    /**
     * Get buffer item count.
     */
    public get length(): number {
        return this.mItemCount;
    }

    /**
     * Buffer layout.
     */
    public get memoryLayout(): BaseBufferMemoryLayout {
        return this.mLayout;
    }

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
        return ((this.mItemCount * this.bytePerElement) + 3) & ~3;
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
     * Byte per buffer element.
     */
    private get bytePerElement(): number {
        // Read bytes per element
        return (() => {
            switch (this.mDataType) {
                case PrimitiveBufferFormat.Float32:
                case PrimitiveBufferFormat.Sint32:
                case PrimitiveBufferFormat.Uint32:
                    return 4;

                default: // Float16
                    throw new Exception(`Could not create a size for ${this.mDataType} type.`, this);
            }
        })();
    }

    /**
     * Constructor.
     * @param pDevice - GPU.
     * @param pLayout - Buffer layout.
     * @param pInitialData  - Inital data. Can be empty. Or Buffer size. 
     */
    public constructor(pDevice: GpuDevice, pLayout: BaseBufferMemoryLayout, pDataType: PrimitiveBufferFormat, pVariableSizeCount: number | null = null) {
        super(pDevice, GpuObjectLifeTime.Persistent);
        this.mLayout = pLayout;

        // Set config.
        this.mDataType = pDataType;

        // At default buffer can not be read and not be written to.
        this.mBufferUsage = BufferUsage.None;

        // Read and write buffers.
        this.mWriteBuffer = {
            limitation: Number.MAX_SAFE_INTEGER,
            ready: new Array<GPUBuffer>(),
            buffer: new Set<GPUBuffer>()
        };
        this.mReadBuffer = null;

        if (pLayout.variableSize !== 0 && pVariableSizeCount === null) {
            throw new Exception('Variable size must be set for gpu buffers with variable memory layouts.', this);
        }

        // Layout size can be variable so we clamp variable size to 0. 
        const lByteSize: number = (pVariableSizeCount ?? 0) * pLayout.variableSize + pLayout.fixedSize;

        // Set buffer initial data from buffer size or buffer data.
        this.mItemCount = lByteSize / 4; // All data is 4byte/ 32bit. 

        // No intial data.
        this.mInitialDataCallback = null;

        // Register change listener for layout changes.
        pLayout.addInvalidationListener(() => {
            this.invalidate(GpuBufferInvalidationType.Layout);
        });
    }

    /**
     * Extend usage of buffer.
     * Might trigger a buffer rebuild.
     * 
     * @param pUsage - Buffer usage. 
     */
    public extendUsage(pUsage: BufferUsage): this {
        // Update only when not already set.
        if ((this.mBufferUsage & pUsage) === 0) {
            this.mBufferUsage |= pUsage;

            this.invalidate(GpuBufferInvalidationType.Usage);
        }

        return this;
    }

    /**
     * Set new initial data before the buffer is created.
     * 
     * @param pDataCallback - Data callback. 
     */
    public initialData(pDataCallback: () => TType): this {
        // Set new initial data, set on creation.
        this.mInitialDataCallback = pDataCallback;

        // Trigger update.
        this.invalidate(GpuBufferInvalidationType.InitialData);

        return this;
    }

    /**
     * Read buffer on layout location.
     * @param pLayoutPath - Layout path. 
     */
    public async read(pLayoutPath: Array<string>): Promise<TType> {
        const lLocation = this.mLayout.locationOf(pLayoutPath);
        return this.readRaw(lLocation.offset, lLocation.size);
    }

    /**
     * Read data raw without layout.
     * 
     * @param pOffset - Data read offset.
     * @param pSize - Data read size.
     */
    public async readRaw(pOffset?: number | undefined, pSize?: number | undefined): Promise<TType> {
        // Set buffer as writeable.
        this.extendUsage(BufferUsage.CopySource);

        const lOffset: number = pOffset ?? 0;
        const lSize: number = pSize ?? this.size;

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
        const lBufferReadResult: TType = this.createTypedArray(this.mReadBuffer.getMappedRange().slice(0)) as TType;

        // Map read buffer again.
        this.mReadBuffer.unmap();

        // Get mapped data and force it into typed array.
        return lBufferReadResult;
    }

    /**
     * Write data on layout location.
     * @param pData - Data.
     * @param pLayoutPath - Layout path.
     */
    public async write(pData: ArrayLike<number>, pLayoutPath: Array<string>): Promise<void> {
        const lLocation = this.mLayout.locationOf(pLayoutPath);

        // Skip new promise creation by returning original promise.
        return this.writeRaw(pData, lLocation.offset);
    }

    /**
     * Write data raw without layout.
     * 
     * @param pData - Data.
     * @param pOffset - Data offset.
     */
    public async writeRaw(pData: ArrayLike<number>, pOffset?: number): Promise<void> {
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
        const lDataByteLength: number = pData.length * this.bytePerElement;
        const lOffset: number = pOffset ?? 0;

        // When no staging buffer is available, use the slow native.
        if (!lStagingBuffer) {
            // Write data into mapped range.
            this.device.gpu.queue.writeBuffer(lNative, lOffset, this.createTypedArray(pData), 0, lDataByteLength);

            return;
        }

        // Execute write operations on waving buffer.
        const lBufferArray: TypedArray = this.createTypedArray(lStagingBuffer.getMappedRange(lOffset, lDataByteLength));
        lBufferArray.set(pData);

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
    protected override destroyNative(pNativeObject: GPUBuffer, _pReason: GpuObjectInvalidationReasons<GpuBufferInvalidationType>): void {
        pNativeObject.destroy();

        // Only clear staging buffers when layout, and therfore the buffer size has changed.
        //if (pReason.has(GpuBufferInvalidationType.Layout)) {
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
        //}
    }

    /**
     * Generate buffer. Write local gpu object data as initial native buffer data.
     */
    protected override generateNative(): GPUBuffer {
        // Read optional initial data.
        const lInitalData: TType | undefined = this.mInitialDataCallback?.();

        // Create gpu buffer mapped
        const lBuffer: GPUBuffer = this.device.gpu.createBuffer({
            label: 'Ring-Buffer-Static-Buffer',
            size: this.size,
            usage: this.mBufferUsage,
            mappedAtCreation: !!lInitalData
        });

        // Write data. Is completly async.
        if (lInitalData) {
            // Write initial data.
            const lMappedBuffer: TypedArray = this.createTypedArray(lBuffer.getMappedRange());

            // Validate buffer and initial data length.
            if (lMappedBuffer.length !== lInitalData.length) {
                throw new Exception(`Initial buffer data (length: ${lInitalData.length}) does not fit into buffer (length: ${lMappedBuffer.length}). `, this);
            }

            // Set data to buffer.
            lMappedBuffer.set(lInitalData);

            // Unmap buffer.
            lBuffer.unmap();
        }

        return lBuffer;
    }

    /**
     * Create a typed array based on buffer data type.
     * 
     * @param pArrayBuffer - Array buffer.
     * 
     * @returns typed array. 
     */
    private createTypedArray(pArrayBuffer: ArrayLike<number> | ArrayBufferLike): TypedArray {
        // Read bytes per element
        const lArrayBufferConstructor = (() => {
            switch (this.mDataType) {
                case PrimitiveBufferFormat.Float32:
                    return Float32Array;
                case PrimitiveBufferFormat.Sint32:
                    return Int32Array;
                case PrimitiveBufferFormat.Uint32:
                    return Uint32Array;

                default: // Float16
                    throw new Exception(`Could not create a buffered array for ${this.mDataType} type.`, this);
            }
        })();

        return new lArrayBufferConstructor(pArrayBuffer);
    }
}

type GpuBufferWriteBuffer = {
    buffer: Set<GPUBuffer>;
    ready: Array<GPUBuffer>;
    limitation: number;
};

export enum GpuBufferInvalidationType {
    Layout = 'LayoutChange',
    InitialData = 'InitialDataChange',
    Usage = 'UsageChange'
}