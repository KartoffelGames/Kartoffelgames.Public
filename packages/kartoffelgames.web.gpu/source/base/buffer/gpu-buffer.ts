import { TypedArray } from '@kartoffelgames/core';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';
import { UpdateReason } from '../gpu/gpu-object-update-reason';

/**
 * GpuBuffer. Uses local and native gpu buffers.
 */
export class GpuBuffer<TType extends TypedArray> extends GpuObject<'gpuBuffer'> {
    private readonly mDataType: BufferDataType<TType>;
    private readonly mItemCount: number;
    private readonly mLayout: BaseBufferMemoryLayout;

    /**
     * Data type of buffer.
     */
    public get dataType(): BufferDataType<TType> {
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
     * Buffer size in bytes aligned to 4 bytes.
     */
    public get size(): number {
        return ((this.mItemCount * this.mDataType.BYTES_PER_ELEMENT) + 3) & ~3;
    }

    /**
     * Constructor.
     * @param pDevice - GPU.
     * @param pLayout - Buffer layout.
     * @param pInitialData  - Inital data. Can be empty. Or Buffer size. 
     */
    public constructor(pDevice: GpuDevice, pLayout: BaseBufferMemoryLayout, pInitialData: TType | number) {
        super(pDevice);
        this.mLayout = pLayout;
        this.mDataType = <BufferDataType<TType>>pInitialData.constructor;

        // Set buffer initial data from buffer size or buffer data.
        if(typeof pInitialData === 'number'){
            this.mItemCount = pInitialData;
        } else{
            this.mItemCount =  pInitialData.length;
            this.writeRaw(pInitialData, 0);
        }

        // Register change listener for layout changes.
        pLayout.addUpdateListener(() => {
            this.triggerAutoUpdate(UpdateReason.ChildData);
        });
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
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public async readRaw(pOffset?: number | undefined, pSize?: number | undefined): Promise<TType> {
        const lOffset: number = pOffset ?? 0;
        const lSize: number = pSize ?? this.size;

        // Read data async
        const lBufferGenerator = this.device.generator.request<'gpuBuffer'>(this);
        return <TType>await lBufferGenerator.readRaw(lOffset, lSize);
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
     * @param pData - Data.
     * @param pOffset - Data offset.
     */
    public async writeRaw(pData: ArrayLike<number>, pOffset?: number | undefined): Promise<void> {
        const lOffset: number = pOffset ?? 0;

        // Write data async. Dont wait.
        const lBufferGenerator = this.device.generator.request<'gpuBuffer'>(this);
        lBufferGenerator.writeRaw(pData, lOffset, pData.length);
    }
}

type BufferDataType<T extends TypedArray> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    BYTES_PER_ELEMENT: number;
    new(pInitValues: ArrayBuffer | number | TypedArray): T;
};