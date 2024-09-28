import { BufferUsage } from '../../../constant/buffer-usage.enum';
import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObjectSetup } from '../../gpu/object/gpu-object-setup';
import { BaseMemoryLayout } from '../base-memory-layout';

export abstract class BaseBufferMemoryLayout<TSetupObject extends GpuObjectSetup<any> | null = any> extends BaseMemoryLayout<BaseBufferMemoryLayoutInvalidationType, TSetupObject> {
    private mUsage: BufferUsage;

    /**
     * Type byte alignment.
     */
    public abstract readonly alignment: number;

    /**
     * Fixed buffer size in bytes.
     */
    public abstract readonly fixedSize: number;

    /**
     * Size of the variable part of layout in bytes.
     */
    public abstract readonly variableSize: number;

    /**
     * Buffer usage. Bitmask.
     */
    public get usage(): BufferUsage {
        return this.mUsage;
    } set usage(pUsage: BufferUsage) {
        this.mUsage = pUsage;

        // Trigger auto update.
        this.invalidate(BaseBufferMemoryLayoutInvalidationType.Usage);
    }

    /**
     * Constructor.
     * 
     * @param pDevice - Device reference.
     * @param pParameter - Parameter.
     */
    public constructor(pDevice: GpuDevice, pParameter: BufferMemoryLayoutParameter) {
        super(pDevice);

        // Settings.
        this.mUsage = pParameter.usage;
    }

    /**
     * Get location of path.
     * @param pPathName - Path name. Divided by dots.
     */
    public abstract locationOf(pPathName: Array<string>): BufferLayoutLocation;
}

export interface BufferMemoryLayoutParameter {
    usage: BufferUsage;
}

export type BufferLayoutLocation = {
    offset: number;
    size: number;
};

export enum BaseBufferMemoryLayoutInvalidationType {
    Usage = 'UsageChange',
}