import { Dictionary, Exception, IDeconstructable, Writeable } from '@kartoffelgames/core';
import { GpuDevice } from '../gpu-device';
import { GpuObjectInvalidationReasons } from './gpu-object-invalidation-reasons';
import { GpuObjectLifeTime } from './gpu-object-life-time.enum';
import { GpuObjectSetup } from './gpu-object-setup';

/**
 * Gpu object with a native internal object.
 */
export abstract class GpuObject<TNativeObject = null, TInvalidationType extends string = '', TSetupObject extends GpuObjectSetup<any> | null = null> implements IDeconstructable {
    private mDeconstructed: boolean;
    private readonly mDevice: GpuDevice;
    private readonly mInvalidationReasons: GpuObjectInvalidationReasons<TInvalidationType>;
    private mIsSetup: boolean;
    private mLastGeneratedFrame: number;
    private readonly mNativeLifeTime: GpuObjectLifeTime;
    private mNativeObject: TNativeObject | null;
    private readonly mUpdateListenerList: Dictionary<GpuObjectUpdateListener<TInvalidationType>, Set<TInvalidationType> | null>;

    /**
     * Gpu Device.
     */
    protected get device(): GpuDevice {
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
    public constructor(pDevice: GpuDevice, pNativeLifeTime: GpuObjectLifeTime) {
        // Save static settings.
        this.mDevice = pDevice;
        this.mIsSetup = false;
        this.mNativeLifeTime = pNativeLifeTime;

        // Init default settings and config.
        this.mDeconstructed = false;
        this.mNativeObject = null;
        this.mLastGeneratedFrame = 0;

        // Init lists.
        this.mUpdateListenerList = new Dictionary<GpuObjectUpdateListener<TInvalidationType>, Set<TInvalidationType> | null>();
        this.mInvalidationReasons = new GpuObjectInvalidationReasons<TInvalidationType>();
    }

    /**
     * Add invalidation listener.
     * 
     * @param pListener - Listener.
     * @param pAffected - Trigger listener only on those reasons.
     */
    public addInvalidationListener(pListener: GpuObjectUpdateListener<TInvalidationType>, pAffected?: Array<TInvalidationType>): void {
        this.mUpdateListenerList.set(pListener, pAffected ? new Set(pAffected) : null);
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
    public invalidate(pReason: TInvalidationType): void {
        // Add invalidation reason.
        this.mInvalidationReasons.add(pReason);

        // Call parent update listerner.
        for (const [lInvalidationListener, lAffected] of this.mUpdateListenerList) {
            // Call listener only when is has a affected reason.
            if (!lAffected || lAffected.has(pReason)) {
                lInvalidationListener(pReason);
            }
        }
    }

    /**
     * Add invalidation listener.
     * @param pListener - Listener.
     */
    public removeInvalidationListener(pListener: GpuObjectUpdateListener<TInvalidationType>): void {
        this.mUpdateListenerList.delete(pListener);
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
     * @param _pReasons - Reason why it should be newly generated. 
     */
    protected generateNative(_pReasons: GpuObjectInvalidationReasons<TInvalidationType>): TNativeObject | null {
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

        // Validate life time.
        switch (this.mNativeLifeTime) {
            case GpuObjectLifeTime.Persistent: {
                // Do nothing.
                break;
            }
            case GpuObjectLifeTime.Single: {
                // Invalidate every time.
                this.mInvalidationReasons.lifeTimeReached = true;
                break;
            }
            case GpuObjectLifeTime.Frame: {
                // Invalidate on different frame till last generated.
                if (this.device.frameCount !== this.mLastGeneratedFrame) {
                    this.mInvalidationReasons.lifeTimeReached = true;
                }
                break;
            }
        }

        // When native is generated and is invalid, try to update it.
        if (this.mNativeObject !== null && (this.mInvalidationReasons.any())) {
            // Try to update native.
            const lUpdateSuccessfull: boolean = this.updateNative(this.mNativeObject, this.mInvalidationReasons);
            if (lUpdateSuccessfull) {
                this.mInvalidationReasons.clear();
            }
        }

        // When no native is generated or update was not successfull.
        if (this.mNativeObject === null || this.mInvalidationReasons.any()) {
            // Destroy native when existing.
            if (this.mNativeObject !== null) {
                this.destroyNative(this.mNativeObject, this.mInvalidationReasons);
                this.mNativeObject = null;
            }

            // Generate new native.
            this.mNativeObject = this.generateNative(this.mInvalidationReasons);
            if (this.mNativeObject === null) {
                throw new Exception(`No gpu native object can be generated.`, this);
            }

            // Reset all update reasons.
            this.mInvalidationReasons.clear();
        }

        // Save current frame count. Used for Native lifetime check.
        this.mLastGeneratedFrame = this.device.frameCount;

        return this.mNativeObject;
    }
}

type GpuObjectSetupData<TGpuObjectSetup> = TGpuObjectSetup extends GpuObjectSetup<infer T> ? T : never;

export interface GpuObjectSetupReferences<TSetupReferenceData> {
    readonly device: GpuDevice;
    readonly inSetup: boolean;
    readonly data: Partial<TSetupReferenceData>;
}

export type GpuObjectUpdateListener<TInvalidationReason extends string> = (pReason: TInvalidationReason) => void;

// TODO: Custom invalidation mapping to destinct between creating everything new or replace a view in native objects.