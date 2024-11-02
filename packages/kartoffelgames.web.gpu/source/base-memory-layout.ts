import { GpuDevice } from './device/gpu-device';
import { GpuObject } from './gpu_object/gpu-object';
import { GpuObjectSetup } from './gpu_object/gpu-object-setup';

/**
 * Base memory layout. 
 * Represents a memory slot used by a shader.
 */
export abstract class BaseMemoryLayout<TSetupObject extends GpuObjectSetup<any> | null = any> extends GpuObject<null, '', TSetupObject> {
    /**
     * Constuctor.
     * @param pDevice - Device reference.
     */
    public constructor(pDevice: GpuDevice) {
        super(pDevice);
    }
}