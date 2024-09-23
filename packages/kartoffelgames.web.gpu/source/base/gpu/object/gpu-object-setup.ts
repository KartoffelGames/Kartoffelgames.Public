import { Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../gpu-device';
import { GpuObjectSetupReferences } from './gpu-object';

export class GpuObjectSetup<TSetupReferenceData = any> {
    private readonly mSetupReference: GpuObjectSetupReferences<TSetupReferenceData>;

    /**
     * Gpu device reference.
     */
    protected get device(): GpuDevice {
        return this.mSetupReference.device;
    }

    /**
     * Setup data.
     */
    protected get setupData(): TSetupReferenceData {
        // References should be setup at this point.
        return this.mSetupReference.data as TSetupReferenceData;
    }

    /**
     * Setup references.
     */
    protected get setupReferences(): GpuObjectSetupReferences<TSetupReferenceData> {
        return this.mSetupReference;
    }

    /**
     * Constructor.
     * 
     * @param pSetupReference - Setup references.
     */
    public constructor(pSetupReference: GpuObjectSetupReferences<TSetupReferenceData>) {
        this.mSetupReference = pSetupReference;
    }

    /**
     * Ensure that current call is used inside a setup call.
     */
    public ensureThatInSetup(): void {
        // Lock setup to a setup call.
        if (!this.mSetupReference.inSetup) {
            throw new Exception('Can only setup in a setup call.', this);
        }
    }
}