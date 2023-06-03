import { TypedArray } from '@kartoffelgames/core.data';
import { IBuffer } from '../../interface/buffer/i-buffer.interface';
import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';
import { BufferMemoryLayout } from '../memory_layout/buffer-memory-layout';

export abstract class Buffer<TGpu extends GpuDevice, TNative extends object, TType extends TypedArray> extends GpuObject<TGpu, TNative> implements IBuffer<TType> {
    private readonly mInitialData: TType;
    private readonly mLayout: BufferMemoryLayout;

    /**
     * Buffer size.
     */
    public abstract readonly size: number;

    /**
     * Buffer layout.
     */
    public get memoryLayout(): BufferMemoryLayout {
        return this.mLayout;
    }

    /**
     * Initial buffer data.
     */
    protected get initialData(): TType {
        return this.mInitialData;
    }

    /**
     * Constructor.
     * @param pDevice - GPU.
     * @param pLayout - Buffer layout.
     * @param pUsage - Buffer usage beside COPY_DST.
     * @param pInitialData  - Inital data. Can be empty.
     */
    public constructor(pDevice: TGpu, pLayout: BufferMemoryLayout,pInitialData: TType) {
        super(pDevice);
        this.mLayout = pLayout;
        this.mInitialData = pInitialData;
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
     * Write data on layout location.
     * @param pData - Data.
     * @param pLayoutPath - Layout path.
     */
    public async write(pData: TType, pLayoutPath: Array<string>): Promise<void> {
        const lLocation = this.mLayout.locationOf(pLayoutPath);

        // Skip new promise creation by returning original promise.
        return this.writeRaw(pData, lLocation.offset, lLocation.size);
    }

    /**
     * Read data raw without layout.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public abstract readRaw(pOffset?: number | undefined, pSize?: number | undefined): Promise<TType>;

    /**
     * Write data raw without layout.
     * @param pData - Data.
     * @param pOffset - Data offset.
     * @param pSize - Data size.
     */
    public abstract writeRaw(pData: TType, pOffset?: number | undefined, pSize?: number | undefined): Promise<void>;
}