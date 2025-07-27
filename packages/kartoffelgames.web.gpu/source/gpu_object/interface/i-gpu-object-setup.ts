import type { GpuObjectSetup } from '../gpu-object-setup.ts';

export interface IGpuObjectSetup<TSetupObject extends GpuObjectSetup<any>> {
    /**
     * Call setup.
     * Exposes internal setup.
     * 
     * @param pSetupCallback - Setup callback. 
     * 
     * @returns this. 
     */
    setup(pSetupCallback?: ((pSetup: TSetupObject) => void) | undefined): this;
}