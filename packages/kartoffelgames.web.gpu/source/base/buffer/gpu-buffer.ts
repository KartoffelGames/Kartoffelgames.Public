import { Exception, TypedArray } from '@kartoffelgames/core';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { MemoryCopyType } from '../../constant/memory-copy-type.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, NativeObjectLifeTime } from '../gpu/object/gpu-object';
import { UpdateReason } from '../gpu/object/gpu-object-update-reason';
import { IGpuObjectNative } from '../gpu/object/interface/i-gpu-object-native';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { PrimitiveBufferFormat } from '../memory_layout/buffer/enum/primitive-buffer-format.enum';

/**
 * GpuBuffer. Uses local and native gpu buffers.
 */
export class GpuBuffer<TType extends TypedArray> extends GpuObject<GPUBuffer> implements IGpuObjectNative<GPUBuffer> {
    private readonly mCopyType: MemoryCopyType;
    private readonly mDataType: PrimitiveBufferFormat;
    private mInitialDataCallback: (() => TType) | null;
    private readonly mItemCount: number;
    private readonly mLayout: BaseBufferMemoryLayout;
    private readonly mReadyBufferList: Array<GPUBuffer>;
    private readonly mUsage: BufferUsage;
    private readonly mWavingBufferLimitation: number;
    private readonly mWavingBufferList: Array<GPUBuffer>;

    /**
     * Buffer copy type.
     */
    public get copyType(): MemoryCopyType {
        return this.mCopyType;
    }

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
        // Read bytes per element
        const lBytePerElement: number = (() => {
            switch (this.mDataType) {
                case PrimitiveBufferFormat.Float32:
                case PrimitiveBufferFormat.Sint32:
                case PrimitiveBufferFormat.Uint32:
                    return 4;

                default: // Float16
                    throw new Exception(`Could not create a size for ${this.mDataType} type.`, this);
            }
        })();

        // Align data size by 4 byte.
        return ((this.mItemCount * lBytePerElement) + 3) & ~3;
    }

    /**
     * Buffer usage.
     */
    public get usage(): BufferUsage {
        return this.mUsage;
    }

    /**
     * Constructor.
     * @param pDevice - GPU.
     * @param pLayout - Buffer layout.
     * @param pInitialData  - Inital data. Can be empty. Or Buffer size. 
     */
    public constructor(pDevice: GpuDevice, pLayout: BaseBufferMemoryLayout, pCopyType: MemoryCopyType, pDataType: PrimitiveBufferFormat, pVariableSizeCount: number | null = null) {
        super(pDevice, NativeObjectLifeTime.Persistent);
        this.mLayout = pLayout;

        // Set config.
        this.mCopyType = pCopyType;
        this.mUsage = pLayout.usage;
        this.mWavingBufferLimitation = Number.MAX_SAFE_INTEGER;
        this.mDataType = pDataType;

        // Waving buffer list.
        this.mReadyBufferList = new Array<GPUBuffer>();
        this.mWavingBufferList = new Array<GPUBuffer>();

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
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
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
        this.triggerAutoUpdate(UpdateReason.Data);

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
        const lOffset: number = pOffset ?? 0;
        const lSize: number = pSize ?? this.size;

        // TODO: Buffer cant be used as binding or anything else when it has MAP_READ
        // TODO: Create a read buffer. Copy native information into it and than map it.
        // https://www.w3.org/TR/webgpu/#dom-gpubufferusage-map_write

        // Get buffer and map data.
        const lBuffer: GPUBuffer = this.native;
        await lBuffer.mapAsync(GPUMapMode.READ, lOffset, lSize);

        // Get mapped data and force it into typed array.
        return this.createTypedArray(lBuffer.getMappedRange()) as TType;
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
        const lOffset: number = pOffset ?? 0;

        // Try to read a mapped buffer from waving list.
        let lStagingBuffer: GPUBuffer | null = null;
        if (this.mReadyBufferList.length === 0) {
            // Create new buffer when limitation is not meet.
            if (this.mWavingBufferList.length < this.mWavingBufferLimitation) {
                lStagingBuffer = this.device.gpu.createBuffer({
                    label: `RingBuffer-WaveBuffer-${this.mWavingBufferList.length}`,
                    size: this.size,
                    usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
                    mappedAtCreation: true,
                });

                // Add new buffer to complete list.
                this.mWavingBufferList.push(lStagingBuffer);
            }
        } else {
            lStagingBuffer = this.mReadyBufferList.pop()!;
        }

        // When no staging buffer is available, use the slow native.
        if (!lStagingBuffer) {
            // TODO: Buffer cant be used as binding or anything else when it has MAP_WRITE 
            // https://www.w3.org/TR/webgpu/#dom-gpubufferusage-map_write

            // Create and map native buffer.
            const lNativeBuffer: GPUBuffer = this.native;
            await lNativeBuffer.mapAsync(GPUMapMode.WRITE, lOffset, pData.length);

            // Write data into mapped range.
            const lBufferArray: TypedArray = this.createTypedArray(lNativeBuffer.getMappedRange());
            lBufferArray.set(pData);

            // And now let the gpu handle it.
            lNativeBuffer.unmap();

            return;
        }

        // Execute write operations on waving buffer.
        const lBufferArray: TypedArray = this.createTypedArray(lStagingBuffer.getMappedRange(lOffset, pData.length));
        lBufferArray.set(pData);

        // Unmap for copying data.
        lStagingBuffer.unmap();

        // Copy buffer data from staging into wavig buffer.
        const lCommandDecoder: GPUCommandEncoder = this.device.gpu.createCommandEncoder();
        lCommandDecoder.copyBufferToBuffer(lStagingBuffer, 0, this.native, 0, this.size);
        this.device.gpu.queue.submit([lCommandDecoder.finish()]);

        // Shedule staging buffer remaping.
        lStagingBuffer.mapAsync(GPUMapMode.WRITE).then(() => {
            this.mReadyBufferList.push(lStagingBuffer);
        });
    }

    /**
     * Destroy wave and ready buffer.
     */
    protected override destroy(pNativeObject: GPUBuffer): void {
        pNativeObject.destroy();

        // Destroy all wave buffer and clear list.
        while (this.mWavingBufferList.length > 0) {
            this.mWavingBufferList.pop()!.destroy();
        }

        // Clear ready buffer list.
        while (this.mReadyBufferList.length > 0) {
            // No need to destroy. All buffers have already destroyed.
            this.mReadyBufferList.pop();
        }
    }

    /**
     * Generate buffer. Write local gpu object data as initial native buffer data.
     */
    protected override generate(): GPUBuffer {
        // Append usage type from abstract usage type.
        const lUsage: number = this.mUsage | this.copyType;

        // Create gpu buffer mapped
        const lBuffer: GPUBuffer = this.device.gpu.createBuffer({
            label: 'Ring-Buffer-Static-Buffer',
            size: this.size,
            usage: lUsage,
            mappedAtCreation: true // Map data when buffer would receive initial data.
        });

        // unmap buffer.
        lBuffer.unmap();

        // Write data. Is completly async.
        const lInitalData: TType | undefined = this.mInitialDataCallback?.();
        if (lInitalData) {
            this.writeRaw(lInitalData);
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
    private createTypedArray(pArrayBuffer: ArrayBuffer): TypedArray {
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