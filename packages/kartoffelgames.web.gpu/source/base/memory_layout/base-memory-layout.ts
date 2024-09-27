import { GpuDevice } from '../gpu/gpu-device';
import { GpuObject, GpuObjectLifeTime } from '../gpu/object/gpu-object';
import { GpuObjectSetup } from '../gpu/object/gpu-object-setup';

export abstract class BaseMemoryLayout<TSetupObject extends GpuObjectSetup<any> | null = any> extends GpuObject<null, TSetupObject> {
    /**
     * Constuctor.
     * @param pDevice - Device reference.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice, GpuObjectLifeTime.Persistent);
    }
}