import { TypedArray } from '@kartoffelgames/core.data';
import { GpuTypes } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/gpu-object';

export abstract class Buffer<TType extends TypedArray, TGpuTypes extends GpuTypes = GpuTypes, TNative = any> extends GpuObject<TGpuTypes, TNative> {
    private readonly mInitialData: TType;
    private readonly mLayout: TGpuTypes['bufferMemoryLayout'];

    /**
     * Buffer size.
     */
    public abstract readonly size: number;

    /**
     * Buffer layout.
     */
    public get memoryLayout(): TGpuTypes['bufferMemoryLayout'] {
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
    public constructor(pDevice: TGpuTypes['gpuDevice'], pLayout: TGpuTypes['bufferMemoryLayout'], pInitialData: TType) {
        super(pDevice);
        this.mLayout = pLayout;
        this.mInitialData = pInitialData;

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
     * Write data on layout location.
     * @param pData - Data.
     * @param pLayoutPath - Layout path.
     */
    public async write(pData: ArrayLike<number>, pLayoutPath: Array<string>): Promise<void> {
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
    public abstract writeRaw(pData: ArrayLike<number>, pOffset?: number | undefined, pSize?: number | undefined): Promise<void>;
}