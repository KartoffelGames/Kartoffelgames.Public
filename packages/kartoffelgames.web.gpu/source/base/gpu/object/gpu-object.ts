import { Exception, IDeconstructable, Writeable } from '@kartoffelgames/core';
import { GpuDevice } from '../gpu-device';
import { GpuObjectSetup } from './gpu-object-setup';
import { GpuObjectUpdateReason, UpdateReason } from './gpu-object-update-reason';

/**
 * Gpu object with a native internal object.
 */
export abstract class GpuObject<TNativeObject = null, TSetupObject extends GpuObjectSetup<any> | null = null> implements IDeconstructable {
    private mAutoUpdate: boolean;
    private mDeconstructed: boolean;
    private readonly mDevice: GpuDevice;
    private readonly mInvalidationReasons: GpuObjectUpdateReason;
    private mIsSetup: boolean;
    private mLastGeneratedFrame: number;
    private readonly mNativeLifeTime: NativeObjectLifeTime;
    private mNativeObject: TNativeObject | null;
    private readonly mUpdateListenerList: Set<GpuObjectUpdateListener>;

    /**
     * Enable or disable auto update.
     */
    public get autoUpdate(): boolean {
        return this.mAutoUpdate;
    } set autoUpdate(pValue: boolean) {
        this.mAutoUpdate = pValue;
    }

    /**
     * Gpu Device.
     */
    protected get device(): GpuDevice {
        return this.mDevice;
    }

    /**
     * Current invalidation reasons.
     */
    protected get invalidationReasons(): GpuObjectUpdateReason {
        return this.mInvalidationReasons;
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
    public constructor(pDevice: GpuDevice, pNativeLifeTime: NativeObjectLifeTime) {
        // Save static settings.
        this.mDevice = pDevice;
        this.mIsSetup = false;
        this.mNativeLifeTime = pNativeLifeTime;

        // Init default settings and config.
        this.mDeconstructed = false;
        this.mNativeObject = null;
        this.mLastGeneratedFrame = 0;

        // Init default settings and config.
        this.mAutoUpdate = true;

        // Init lists.
        this.mUpdateListenerList = new Set<GpuObjectUpdateListener>();
        this.mInvalidationReasons = new GpuObjectUpdateReason();
    }

    /**
     * Add invalidation listener.
     * @param pListener - Listener.
     */
    public addInvalidationListener(pListener: GpuObjectUpdateListener): void {
        this.mUpdateListenerList.add(pListener);
    }

    /**
     * Deconstruct native object.
     */
    public deconstruct(): void {
        this.invalidate(UpdateReason.Data);

        // Clear and destroy old native when any update reason exists.
        if (this.mNativeObject !== null && this.invalidationReasons.any()) {
            this.destroy(this.mNativeObject, this.invalidationReasons);
            this.mNativeObject = null;
        }

        this.mDeconstructed = true;
    }

    /**
     * Invalidate native gpu object so it will be created again.
     */
    public invalidate(pReason: UpdateReason): void {
        // Add invalidation reason.
        this.mInvalidationReasons.add(pReason);

        // Call parent update listerner.
        for (const lInvalidationListener of this.mUpdateListenerList) {
            lInvalidationListener();
        }
    }

    /**
     * Add invalidation listener.
     * @param pListener - Listener.
     */
    public removeInvalidationListener(pListener: GpuObjectUpdateListener): void {
        this.mUpdateListenerList.delete(pListener);
    }

    /**
     * Destroy native object.
     * 
     * @param _pNative - Native object.
     * @param _pReasons - Reason why it should be destroyed. 
     */
    protected destroy(_pNative: TNativeObject, _pReasons: GpuObjectUpdateReason): void {
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
     */
    protected generate(): TNativeObject | null {
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
     * Trigger auto update.
     * Does nothing on disabled auto update.
     */
    protected triggerAutoUpdate(pReason: UpdateReason): void {
        if (this.mAutoUpdate) {
            this.invalidate(pReason);
        }
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
            case NativeObjectLifeTime.Persistent: {
                // Do nothing.
                break;
            }
            case NativeObjectLifeTime.Single: {
                // Invalidate every time.
                this.invalidate(UpdateReason.LifeTime);
                break;
            }
            case NativeObjectLifeTime.Frame: {
                // Invalidate on different frame till last generated.
                if (this.device.frameCount !== this.mLastGeneratedFrame) {
                    this.invalidate(UpdateReason.LifeTime);
                }
                break;
            }
        }

        // Clear and destroy old native when any update reason exists.
        if (this.mNativeObject !== null && this.invalidationReasons.any()) {
            this.destroy(this.mNativeObject, this.invalidationReasons);
            this.mNativeObject = null;
        }

        // Generate new native when not already generated.
        if (this.mNativeObject === null) {
            this.mNativeObject = this.generate();
            if (this.mNativeObject === null) {
                throw new Exception(`No gpu native object can be generated.`, this);
            }

            this.mLastGeneratedFrame = this.device.frameCount;

            // Reset all update reasons.
            this.invalidationReasons.clear();
        }

        return this.mNativeObject;
    }
}

type GpuObjectSetupData<TGpuObjectSetup> = TGpuObjectSetup extends GpuObjectSetup<infer T> ? T : never;

export interface GpuObjectSetupReferences<TSetupReferenceData> {
    readonly device: GpuDevice;
    readonly inSetup: boolean;
    readonly data: Partial<TSetupReferenceData>;
}

// TODO: Move ... but where?
export enum NativeObjectLifeTime {
    Persistent = 0,
    Frame = 1,
    Single = 2
}

export type GpuObjectUpdateListener = () => void;

// TODO: Custom invalidation mapping to destinct between creating everything new or replace a view in native objects.