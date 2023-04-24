import { Dictionary } from '@kartoffelgames/core.data';
import { Gpu } from './gpu';

/**
 * Gpu native object.
 */
export abstract class GpuNativeObject<T extends object> {
    private readonly mChangeListener: Dictionary<GpuNativeObject<any>, GenericListener>;
    private readonly mGpu: Gpu;
    private readonly mInternalList: Set<GpuNativeObject<any>>;
    private mLabel: string;
    private readonly mNativeName: string;
    private mNativeObject: T | null;
    private mObjectInvalid: boolean;

    /**
     * Debug label.
     */
    public get label(): string {
        let lLabel: string = this.mNativeName;
        if (this.mLabel) {
            lLabel += '->' + this.mLabel;
        }
        return lLabel;
    } set label(pLabel: string) {
        this.mLabel = pLabel;
    }

    /**
     * Get global gpu.
     */
    protected get gpu(): Gpu {
        return this.mGpu;
    }

    /**
     * Constructor.
     * @param pGpu - Gpu object.
     * @param pNativeName - Name of native label.
     */
    public constructor(pGpu: Gpu, pNativeName: string) {
        this.mGpu = pGpu;
        this.mNativeObject = null;
        this.mLabel = '';
        this.mNativeName = pNativeName;

        // Trigger refresh on creation.
        this.mObjectInvalid = true;

        // Init internal native change detection.
        this.mChangeListener = new Dictionary<GpuNativeObject<any>, GenericListener>();
        this.mInternalList = new Set<GpuNativeObject<any>>();
    }

    /**
     * Destroy generated native object.
     */
    public async destroy(): Promise<void> {
        // Destroy old native object.
        if (this.mNativeObject) {
            this.destroyNative(this.mNativeObject);

            // Remove destroyed native.
            this.mNativeObject = null;
        }
    }

    /**
     * Get native object.
     */
    public native(): T {
        // Invalidate oject when needed.
        this.invalidate();

        // Generate new native object when not already created.
        if (this.mObjectInvalid) {
            // Destroy native.
            this.destroy();

            // Reset object invalidation.
            this.mObjectInvalid = false;

            // Generate new native object.
            this.mNativeObject = this.generate();
        }

        return <T>this.mNativeObject;
    }

    /**
     * Destroy object.
     */
    protected destroyNative(_pNativeObject: T): void {
        // Nothing to destroy. :)
    }

    /**
     * Register internal native object.
     * Invalidated native when internal changes.
     * @param pInternalNative - Internal used native.
     */
    protected registerInternalNative(pInternalNative: GpuNativeObject<any>): void {
        // Save internal native.
        pInternalNative.addChangeListener(() => {
            this.mObjectInvalid = true;
        }, this);
        this.mInternalList.add(pInternalNative);
        this.triggerChange();
    }

    /**
     * Trigger native change.
     */
    protected triggerChange(): void {
        // Trigger change.
        if (!this.mObjectInvalid) {
            this.mObjectInvalid = true;

            // Execute change listener.
            for (const lListener of this.mChangeListener.values()) {
                lListener();
            }
        }
    }

    /**
     * Unregister internal native object.
     * @param pInternalNative - Internal used native.
     */
    protected unregisterInternalNative(pInternalNative: GpuNativeObject<any>): void {
        // Delete saved native.
        pInternalNative.removeChangeListener(this);
        this.mInternalList.delete(pInternalNative);
        this.triggerChange();
    }

    /**
     * Validate native object.
     */
    protected validate(_pNativeObject: T): boolean {
        return true;
    }

    /**
     * Add change listener.
     * @param pListener - Change listener.
     * @param pReferrer - Referrer object.
     */
    private addChangeListener(pListener: GenericListener, pReferrer: GpuNativeObject<any>) {
        this.mChangeListener.set(pReferrer, pListener);
    }

    /**
     * Invalidate native object.
     */
    private invalidate(): void {
        // Invalidate internals.
        for (const lInternal of this.mInternalList) {
            lInternal.invalidate();
        }

        if (!this.mObjectInvalid && this.mNativeObject) {
            if (!this.validate(this.mNativeObject)) {
                this.triggerChange();
            }
        }
    }

    /**
     * Remove change listener.
     * @param pReferrer - Referrer object.
     */
    private removeChangeListener(pReferrer: GpuNativeObject<any>) {
        this.mChangeListener.delete(pReferrer);
    }

    /**
     * Generate native object.
     */
    protected abstract generate(): T;
}

type GenericListener = () => void;