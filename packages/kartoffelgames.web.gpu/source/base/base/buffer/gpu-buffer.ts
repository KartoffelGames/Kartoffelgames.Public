import { TypedArray } from '@kartoffelgames/core.data';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { BaseBufferMemoryLayout } from '../memory_layout/buffer/base-buffer-memory-layout';

/**
 * GpuBuffer. Uses local and native gpu buffers.
 */
export class GpuBuffer<TType extends TypedArray> extends GpuObject<'gpuBuffer'> {
    private readonly mDataType: BufferDataType<TType>;
    private readonly mLayout: BaseBufferMemoryLayout;
    private readonly mLocalData: TType;

    /**
     * Data type of buffer.
     */
    public get dataType(): BufferDataType<TType> {
        return this.mDataType;
    }

    /**
     * Local buffer data.
     * Changing this will not update the buffer.
     */
    public get localData(): TType {
        return this.mLocalData;
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
        return ((this.mLocalData.length * this.mDataType.BYTES_PER_ELEMENT) + 3) & ~3;
    }

    /**
     * Constructor.
     * @param pDevice - GPU.
     * @param pLayout - Buffer layout.
     * @param pInitialData  - Inital data. Can be empty.
     */
    public constructor(pDevice: GpuDevice, pLayout: BaseBufferMemoryLayout, pInitialData: TType) {
        super(pDevice);
        this.mLayout = pLayout;
        this.mDataType = <BufferDataType<TType>>pInitialData.constructor;
        this.mLocalData = pInitialData;

        // Register change listener for layout changes.
        pLayout.addUpdateListener(() => {
            this.triggerAutoUpdate();
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

        return <TType>this.mLocalData.subarray(lOffset, lOffset + lSize);
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
        // Write data async. Dont wait.
        const lBufferGenerator = this.device.generator.request<'gpuBuffer'>(this);
        lBufferGenerator.writeRaw(pData, pOffset);

        // Set local data.
        this.mLocalData.set(pData, pOffset);
    }
}

type BufferDataType<T extends TypedArray> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    BYTES_PER_ELEMENT: number;
    new(pInitValues: ArrayBuffer | number | TypedArray): T;
};