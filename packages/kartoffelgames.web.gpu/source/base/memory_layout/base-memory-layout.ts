import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject } from '../gpu/object/gpu-object';
import { GpuObjectLifeTime } from '../gpu/object/gpu-object-life-time.enum';
import { GpuObjectSetup } from '../gpu/object/gpu-object-setup';

export abstract class BaseMemoryLayout<TInvalidationType extends string = any, TSetupObject extends GpuObjectSetup<any> | null = any> extends GpuObject<null, TInvalidationType, TSetupObject> {
    /**
     * Constuctor.
     * @param pDevice - Device reference.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice, GpuObjectLifeTime.Persistent);
    }
}