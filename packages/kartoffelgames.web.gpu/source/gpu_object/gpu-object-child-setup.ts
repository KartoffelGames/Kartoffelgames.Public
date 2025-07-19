import { Exception } from '@kartoffelgames/core';
import { GpuDevice } from '../device/gpu-device.ts';
import { GpuObjectSetupReferences } from './gpu-object.ts';

/**
 * Helper object for setup objects. Returns results with a callback.
 */
export abstract class GpuObjectChildSetup<TSetupReferenceData, TCallback extends GpuObjectChildSetupCallback> {
    private readonly mSetupCallback: TCallback;
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
    protected get setupData(): Readonly<TSetupReferenceData> {
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
     * @param pDataCallback - Setup data callback.
     */
    public constructor(pSetupReference: GpuObjectSetupReferences<TSetupReferenceData>, pDataCallback: TCallback) {
        this.mSetupReference = pSetupReference;
        this.mSetupCallback = pDataCallback;
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
     * Send data back to parent setup.
     * 
     * @param pData - Setup complete data.
     */
    protected sendData(...pData: Parameters<TCallback>): void {
        this.mSetupCallback(...pData);
    }
}

type GpuObjectChildSetupCallback = (...args: any) => void;