import { Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../device/gpu-device.ts';
import { GpuObjectSetupReferences } from './gpu-object.ts';

/**
 * Gpu setup object.
 */
export abstract class GpuObjectSetup<TSetupData> {
    private readonly mSetupReference: GpuObjectSetupReferences<TSetupData>;

    /**
     * Gpu device reference.
     */
    protected get device(): GpuDevice {
        return this.mSetupReference.device;
    }

    /**
     * Setup data.
     */
    protected get setupData(): TSetupData {
        // References should be setup at this point.
        return this.mSetupReference.data as TSetupData;
    }

    /**
     * Setup references.
     */
    protected get setupReferences(): GpuObjectSetupReferences<TSetupData> {
        return this.mSetupReference;
    }

    /**
     * Constructor.
     * 
     * @param pSetupReference - Setup references.
     */
    public constructor(pSetupReference: GpuObjectSetupReferences<TSetupData>) {
        this.mSetupReference = pSetupReference;

        // Fill default data to setup references.
        this.fillDefaultData(pSetupReference.data);
    }

    /**
     * Ensure that current call is used inside a setup call.
     */
    protected ensureThatInSetup(): void {
        // Lock setup to a setup call.
        if (!this.mSetupReference.inSetup) {
            throw new Exception('Can only setup in a setup call.', this);
        }
    }

    /**
     * Fill in default data before the setup starts.
     * 
     * @param pDataReference - Setup data reference.
     */
    protected abstract fillDefaultData(pDataReference: Partial<TSetupData>): void;
}