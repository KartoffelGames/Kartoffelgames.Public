import { TypedArray } from '@kartoffelgames/core.data';
import { BufferUsage } from '../../constant/buffer-usage.enum';
import { GpuDevice } from '../gpu/gpu-device';
import { BufferLayout } from './buffer-layout';
import { GpuObject } from '../gpu/gpu-object';
import { IBuffer } from '../../interface/buffer/i-buffer.interface';

export abstract class Buffer<TGpu extends GpuDevice, TNative extends object, TType extends TypedArray> extends GpuObject<TGpu, TNative> implements IBuffer<TType> {
    private readonly mBufferUsage: BufferUsage;
    private readonly mInitialData: TType;
    private readonly mLayout: BufferLayout;

    /**
     * Buffer size.
     */
    public abstract readonly size: number;

    /**
     * Buffer layout.
     */
    public get layout(): BufferLayout {
        return this.mLayout;
    }

    /**
     * Buffer usage. Bit concat of enum.
     */
    public get usage(): BufferUsage {
        return this.mBufferUsage;
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
    public constructor(pDevice: TGpu, pLayout: BufferLayout, pUsage: BufferUsage, pInitialData: TType) {
        super(pDevice);
        this.mLayout = pLayout;
        this.mBufferUsage = pUsage;
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