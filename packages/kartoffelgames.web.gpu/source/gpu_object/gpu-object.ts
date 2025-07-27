// @ts-types="npm:@webgpu/types"

import { Dictionary, Exception, type IDeconstructable, List, type Writeable } from '@kartoffelgames/core';
import type { GpuDevice } from '../device/gpu-device.ts';
import { GpuObjectInvalidationReasons } from './gpu-object-invalidation-reasons.ts';
import type { GpuObjectSetup } from './gpu-object-setup.ts';

/**
 * Object that handles gpu data, resources or configs.
 */
export abstract class GpuObject<TNativeObject = null, TInvalidationType extends string = '', TSetupObject extends GpuObjectSetup<any> | null = null> implements IDeconstructable {
    private mDeconstructed: boolean;
    private readonly mDevice: GpuDevice;
    private readonly mInvalidationReasons: GpuObjectInvalidationReasons<TInvalidationType>;
    private mIsSetup: boolean;
    private mNativeObject: TNativeObject | null;
    private readonly mUpdateListener: Dictionary<TInvalidationType, List<GpuObjectUpdateListener<TInvalidationType>>>;
    private readonly mUpdateListenerAffectedTyped: WeakMap<GpuObjectUpdateListener<TInvalidationType>, Array<TInvalidationType>>;

    /**
     * Gpu Device.
     */
    public get device(): GpuDevice {
        return this.mDevice;
    }

    /**
     * Object was setup.
     */
    protected get isSetup(): boolean {
        return this.mIsSetup;
    }

    /**
     * Native gpu object.
     */
    protected get native(): TNativeObject {
        return this.readNative();
    }

    /**
     * Constructor.
     * @param pDevice - Gpu device.
     * @param pNativeLifeTime - Lifetime of native object.
     */
    public constructor(pDevice: GpuDevice) {
        // Save static settings.
        this.mDevice = pDevice;
        this.mIsSetup = false;

        // Init default settings and config.
        this.mDeconstructed = false;
        this.mNativeObject = null;

        // Init lists.
        this.mUpdateListener = new Dictionary<TInvalidationType, List<GpuObjectUpdateListener<TInvalidationType>>>();
        this.mUpdateListenerAffectedTyped = new WeakMap<GpuObjectUpdateListener<TInvalidationType>, Array<TInvalidationType>>();
        this.mInvalidationReasons = new GpuObjectInvalidationReasons<TInvalidationType>();
    }

    /**
     * Add invalidation listener.
     * 
     * @param pListener - Listener.
     * @param pAffected - Trigger listener only on those reasons.
     * 
     * @returns this.
     */
    public addInvalidationListener(pListener: GpuObjectUpdateListener<TInvalidationType>, pFirstAffected: TInvalidationType, ...pAffected: Array<TInvalidationType>): this {
        if (this.mUpdateListenerAffectedTyped.has(pListener)) {
            throw new Exception(`Invalidation listener can't be applied twice.`, this);
        }

        // Concat first and optional types.
        const lAffectedList: Array<TInvalidationType> = [pFirstAffected, ...pAffected];

        // Listener to each affected
        for (const lAffectedType of lAffectedList) {
            // Init new affected bucket.
            if (!this.mUpdateListener.has(lAffectedType)) {
                this.mUpdateListener.set(lAffectedType, new List<GpuObjectUpdateListener<TInvalidationType>>());
            }

            // Assign listener to affected type.
            this.mUpdateListener.get(lAffectedType)!.push(pListener);
        }

        // Map listener to affected types.
        this.mUpdateListenerAffectedTyped.set(pListener, lAffectedList);

        return this;
    }

    /**
     * Deconstruct native object.
     */
    public deconstruct(): void {
        this.mInvalidationReasons.deconstruct = true;

        // Clear and destroy old native when any update reason exists.
        if (this.mNativeObject !== null) {
            this.destroyNative(this.mNativeObject, this.mInvalidationReasons);
            this.mNativeObject = null;
        }

        this.mDeconstructed = true;
    }

    /**
     * Invalidate native gpu object so it will be created again.
     */
    public invalidate(...pReasons: Array<TInvalidationType>): void {
        // Single reason execution function.
        const lExecuteReasonListener = (pReason: TInvalidationType) => {
            // Skip reasons that already occurred or no native was created.
            // This step ensures to execute invalidation listener for all gpu objects that doesn't create natives. 
            if (this.mNativeObject !== null && this.mInvalidationReasons.has(pReason)) {
                return;
            }

            // Add invalidation reason.
            this.mInvalidationReasons.add(pReason);

            // Read listener list.
            const lListenerList: List<GpuObjectUpdateListener<TInvalidationType>> | undefined = this.mUpdateListener.get(pReason);
            if (!lListenerList || lListenerList.length === 0) {
                return;
            }

            // Single execution of listener when only one exists.
            if (lListenerList.length === 1) {
                lListenerList[0](pReason);
            } else {
                for (const lListener of lListenerList) {
                    lListener(pReason);
                }
            }
        };

        // Invalidate for each reason. Single reason execution when only one exists.
        if (pReasons.length === 1) {
            lExecuteReasonListener(pReasons[0]);
        } else {
            for (const lReason of pReasons) {
                lExecuteReasonListener(lReason);
            }
        }
    }

    /**
     * Add invalidation listener.
     * @param pListener - Listener.
     */
    public removeInvalidationListener(pListener: GpuObjectUpdateListener<TInvalidationType>): void {
        // Get all affected types of listener.
        const lAffectedList: Array<TInvalidationType> | undefined = this.mUpdateListenerAffectedTyped.get(pListener);
        if (!lAffectedList) {
            return;
        }

        // Remove all listener from each affected type.
        for (const lAffectedType of lAffectedList) {
            this.mUpdateListener.get(lAffectedType)!.remove(pListener);
        }

        // Remove listener from affected mapping.
        this.mUpdateListenerAffectedTyped.delete(pListener);
    }

    /**
     * Destroy native object.
     * 
     * @param _pNative - Native object.
     * @param _pReasons - Reason why it should be destroyed. 
     */
    protected destroyNative(_pNative: TNativeObject, _pReasons: GpuObjectInvalidationReasons<TInvalidationType>): void {
        return;
    }

    /**
     * Throws when the gpu object not setup.
     */
    protected ensureSetup(): void {
        if (!this.mIsSetup) {
            throw new Exception('Gpu object must be setup to access properties.', this);
        }
    }

    /**
     * Generate new native object.
     * Return null when no native can be generated.
     * 
     * @param _pCurrentNative - Current native element.
     * @param _pReasons - Reason why it should be newly generated. 
     */
    protected generateNative(_pCurrentNative: TNativeObject | null, _pReasons: GpuObjectInvalidationReasons<TInvalidationType>): TNativeObject | null {
        return null;
    }

    /**
     * Setup with setup object.
     * 
     * @param _pReferences - Used references.
     */
    protected onSetup(_pReferences: GpuObjectSetupData<TSetupObject>): void {
        return;
    }

    /**
     * Create setup object.
     * Return null to skip any setups.
     * 
     * @param _pReferences - Unfilled setup references.
     * 
     * @returns Setup object.
     */
    protected onSetupObjectCreate(_pReferences: GpuObjectSetupReferences<GpuObjectSetupData<TSetupObject>>): TSetupObject {
        return null as TSetupObject;
    }

    /**
     * Call setup.
     * 
     * @param pSetupCallback - Setup callback. 
     * 
     * @returns this. 
     */
    protected setup(pSetupCallback?: (pSetup: TSetupObject) => void): this {
        // Dont call twice.
        if (this.mIsSetup) {
            throw new Exception(`Render targets setup can't be called twice.`, this);
        }

        // Create unfilled
        const lSetupReferences: GpuObjectSetupReferences<GpuObjectSetupData<TSetupObject>> = {
            inSetup: true,
            device: this.mDevice,
            data: {}
        };

        // Creates setup object.
        const lSetupObject: TSetupObject | null = this.onSetupObjectCreate(lSetupReferences);
        if (lSetupObject !== null) {
            // Call optional user setup.
            if (pSetupCallback) {
                pSetupCallback(lSetupObject);
            }

            // Call gpu object setup. At this point all references should be filled.
            this.onSetup(lSetupReferences.data as GpuObjectSetupData<TSetupObject>);
        }

        // Defuse setup references.
        (<Writeable<GpuObjectSetupReferences<GpuObjectSetupData<TSetupObject>>>>lSetupReferences).inSetup = false;

        // Set gpu object as setup.
        this.mIsSetup = true;

        return this;
    }

    /**
     * Update native object.
     * 
     * @param _pNative - Native object.
     * @param _pReasons - Reason why it should be updated. 
     * 
     * @returns true when native element was updated, false when it should be created anew.
     */
    protected updateNative(_pNative: TNativeObject, _pReasons: GpuObjectInvalidationReasons<TInvalidationType>): boolean {
        return false;
    }

    /**
     * Read up to date native object.
     * Invalidates, destroys and generates the native object.
     * 
     * @returns native object.
     */
    private readNative(): TNativeObject {
        // Restrict deconstructed access.
        if (this.mDeconstructed) {
            throw new Exception(`Native GPU object was deconstructed and can't be used again.`, this);
        }

        // Ensure the setup was called.
        if (!this.isSetup) {
            // Call empty update.
            this.setup();
        }

        // When native is generated and is invalid, try to update it.
        if (this.mNativeObject !== null && this.mInvalidationReasons.any()) {
            // Try to update native.
            const lUpdateSuccessfull: boolean = this.updateNative(this.mNativeObject, this.mInvalidationReasons);
            if (lUpdateSuccessfull) {
                this.mInvalidationReasons.clear();
            }
        }

        // When no native is generated or update was not successfull.
        if (this.mNativeObject === null || this.mInvalidationReasons.any()) {
            // Save current native.
            const lCurrentNative: TNativeObject | null = this.mNativeObject;

            // Generate new native.
            this.mNativeObject = this.generateNative(lCurrentNative, this.mInvalidationReasons);

            // Destroy old native when existing.
            if (lCurrentNative !== null) {
                this.destroyNative(lCurrentNative, this.mInvalidationReasons);
            }

            // Reset all update reasons.
            this.mInvalidationReasons.clear();
        }

        return this.mNativeObject!;
    }
}

type GpuObjectSetupData<TGpuObjectSetup> = TGpuObjectSetup extends GpuObjectSetup<infer T> ? T : never;

export interface GpuObjectSetupReferences<TSetupReferenceData> {
    readonly device: GpuDevice;
    readonly inSetup: boolean;
    readonly data: Partial<TSetupReferenceData>;
}

export type GpuObjectUpdateListener<TInvalidationReason extends string> = (pReason: TInvalidationReason) => void;