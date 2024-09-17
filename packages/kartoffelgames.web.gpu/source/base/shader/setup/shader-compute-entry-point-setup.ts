import { Exception } from '@kartoffelgames/core';
import { ShaderSetupReference } from '../shader';

export class ShaderComputeEntryPointSetup {
    private readonly mSetupReference: ShaderSetupReference;
    private readonly mSizeCallback: ComputeSizeCallback;

    /**
     * Constructor.
     * 
     * @param pSetupReference - Setup references.
     * @param pSizeCallback - Size update callback.
     */
    public constructor(pSetupReference: ShaderSetupReference, pSizeCallback: ComputeSizeCallback) {
        this.mSetupReference = pSetupReference;
        this.mSizeCallback = pSizeCallback;
    }

    /**
     * Setup compute entry with a static size.
     */
    public size(pX: number, pY: number = 1, pZ: number = 1): void {
        // Lock setup to a setup call.
        if (!this.mSetupReference.inSetup) {
            throw new Exception('Can only setup compute shader entry point in a setup call.', this);
        }

        // Callback size.
        this.mSizeCallback(pX, pY, pZ);
    }
}

type ComputeSizeCallback = (pX: number, pY: number, pZ: number) => void;