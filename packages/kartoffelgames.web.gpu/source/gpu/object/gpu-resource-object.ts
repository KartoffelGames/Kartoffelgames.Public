import { GpuDevice } from '../gpu-device';
import { GpuObject } from './gpu-object';
import { GpuObjectSetup } from './gpu-object-setup';

/**
 * Gpu resource object.
 * Takes actual memory space on gpu hardware.
 */
export class GpuResourceObject<TUsageType extends number = number, TNativeObject = null, TInvalidationType extends string = '', TSetupObject extends GpuObjectSetup<any> | null = null> extends GpuObject<TNativeObject, TInvalidationType | GpuResourceObjectInvalidationType, TSetupObject> {
    private mResourceUsage: TUsageType;

    /**
     * Texture usage.
     */
    protected get usage(): TUsageType {
        return this.mResourceUsage;
    }

    /**
     * Constructor.
     * @param pDevice - Device.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);

        // Set static config.
        this.mResourceUsage = 0 as TUsageType;
    }

    /**
     * Extend usage of resource.
     * Might trigger a resource rebuild.
     * 
     * @param pUsage - Usage. 
     */
    public extendUsage(pUsage: TUsageType): this {
        // Update onyl when not already set.
        if ((this.mResourceUsage & pUsage) === 0) {
            this.mResourceUsage = (this.mResourceUsage | pUsage) as TUsageType ;
            this.invalidate(GpuResourceObjectInvalidationType.ResourceRebuild);
        }

        return this;
    }
}

export enum GpuResourceObjectInvalidationType {
    ResourceRebuild = 'ResourceRebuild'
}
