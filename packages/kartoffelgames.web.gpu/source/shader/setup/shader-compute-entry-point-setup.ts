import { GpuObjectChildSetup } from '../../gpu_object/gpu-object-child-setup.ts';
import type { ShaderSetupReferenceData } from './shader-setup.ts';

/**
 * Child setup object to add compute entry points for shaders. 
 */
export class ShaderComputeEntryPointSetup extends GpuObjectChildSetup<ShaderSetupReferenceData, ComputeSizeCallback> {
    /**
     * Setup compute entry with a static size.
     */
    public size(pX: number, pY: number = 1, pZ: number = 1): void {
        // Lock setup to a setup call.
        this.ensureThatInSetup();

        // Callback size.
        this.sendData(pX, pY, pZ);
    }
}

type ComputeSizeCallback = (pX: number, pY: number, pZ: number) => void;