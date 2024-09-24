import { GpuSettingObject } from '../gpu/object/gpu-setting-object';

export abstract class BaseMemoryLayout extends GpuSettingObject {
    /**
     * Constuctor.
     * @param _pParameter - Parameter.
     */
    public constructor(_pParameter: MemoryLayoutParameter) {
        super();
    }
}

export interface MemoryLayoutParameter {
}