import { Exception } from '@kartoffelgames/core';
import { PrimitiveBufferFormat } from '../../memory_layout/buffer/enum/primitive-buffer-format.enum';
import { ShaderModuleEntryPointCompute, ShaderSetupReference } from '../shader';
import { ShaderComputeEntryPointSetup } from './shader-compute-entry-point-setup';

export class ShaderSetup {
    private readonly mSetupReference: ShaderSetupReference;

    /**
     * Constructor.
     * 
     * @param pSetupReference - Setup references.
     */
    public constructor(pSetupReference: ShaderSetupReference) {
        this.mSetupReference = pSetupReference;
    }

    /**
     * Add static pipeline parameters definitions.
     * 
     * @param pName- Parameter name.
     * @param pFormat - Parameter format.
     * 
     * @returns this. 
     */
    public addParameter(pName: string, pFormat: PrimitiveBufferFormat): this {
        // Lock setup to a setup call.
        if (!this.mSetupReference.inSetup) {
            throw new Exception('Can only setup shader in a setup call.', this);
        }

        // Restrict overriding parameters.
        if (this.mSetupReference.parameter.has(pName)) {
            throw new Exception(`Can't add dublicate parameter definition of "${pName}"`, this.mSetupReference.shader);
        }

        this.mSetupReference.parameter.set(pName, pFormat);

        return this;
    }

    /**
     * Setup compute entry point.
     * When size is not called, the compute entry point will be setup with a dynamic size.
     * 
     * @param pName - Compute entry name.
     */
    public computeEntryPoint(pName: string): ShaderComputeEntryPointSetup {
        // Lock setup to a setup call.
        if (!this.mSetupReference.inSetup) {
            throw new Exception('Can only setup shader in a setup call.', this);
        }

        // Restrict dublicate compute entries.
        if (this.mSetupReference.entrypoints.compute.has(pName)) {
            throw new Exception(`Can't add dublicate compute entry point "${pName}"`, this.mSetupReference.shader);
        }

        // Create dynamic compute entry point.
        const lEntryPoint: ShaderModuleEntryPointCompute = {
            static: false,
            workgroupDimension: {
                x: null,
                y: null,
                z: null
            }
        };

        // Append compute entry.
        this.mSetupReference.entrypoints.compute.set(pName, lEntryPoint);

        // Return compute entry setup object.
        return new ShaderComputeEntryPointSetup(this.mSetupReference, (pX: number, pY: number, pZ: number) => {
            lEntryPoint.workgroupDimension = {
                x: pX,
                y: pY,
                z: pZ
            };
        });
    }

    public fragmentEntryPoint(): void {
        // Lock setup to a setup call.
        if (!this.mSetupReference.inSetup) {
            throw new Exception('Can only setup shader in a setup call.', this);
        }

        // TODO:
    }

    public vertexEntryPoint(): void {
        // Lock setup to a setup call.
        if (!this.mSetupReference.inSetup) {
            throw new Exception('Can only setup shader in a setup call.', this);
        }

        // TODO:
    }
}