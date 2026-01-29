import type { GpuDevice } from './device/gpu-device.ts';
import { GpuObject } from './gpu_object/gpu-object.ts';
import type { GpuObjectSetup } from './gpu_object/gpu-object-setup.ts';

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