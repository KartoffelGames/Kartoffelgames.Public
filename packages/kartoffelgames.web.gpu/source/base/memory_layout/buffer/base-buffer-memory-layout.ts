import { GpuDevice } from '../../gpu/gpu-device';
import { GpuObjectSetup } from '../../gpu/object/gpu-object-setup';
import { BaseMemoryLayout } from '../base-memory-layout';

export abstract class BaseBufferMemoryLayout<TInvalidationType extends string = any, TSetupObject extends GpuObjectSetup<any> | null = any> extends BaseMemoryLayout<TInvalidationType, TSetupObject> {
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
     * Constructor.
     * 
     * @param pDevice - Device reference.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);
    }

    /**
     * Get location of path.
     * @param pPathName - Path name. Divided by dots.
     */
    public abstract locationOf(pPathName: Array<string>): BufferLayoutLocation;
}

export type BufferLayoutLocation = {
    offset: number;
    size: number;
};