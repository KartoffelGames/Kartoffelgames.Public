import { Dictionary } from '@kartoffelgames/core.data';
import { Gpu } from './gpu';

/**
 * Gpu native object.
 */
export abstract class GpuNativeObject<T extends object> {
    private readonly mChangeListener: Dictionary<GpuNativeObject<any>, GenericListener>;
    private readonly mGpu: Gpu;
    private readonly mInternalNativeList: Set<GpuNativeObject<any>>;
    private mLabel: string;
    private readonly mNativeName: string;
    private mNativeObject: T | null;
    private mNativeObjectId: string;
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
        this.mObjectInvalid = false;

        // Init internal native change detection.
        this.mChangeListener = new Dictionary<GpuNativeObject<any>, GenericListener>();
        this.mInternalNativeList = new Set<GpuNativeObject<any>>();

        // Basic ununique id for uninitialized state.
        this.mNativeObjectId = '';
    }

    /**
     * Destroy generated native object.
     */
    public async destroy(): Promise<void> {
        // Destroy old native object.
        if (this.mNativeObject) {
            await this.destroyNative(this.mNativeObject);

            // Remove destroyed native.
            this.mNativeObject = null;
        }
    }

    /**
     * Get native object.
     */
    public async native(): Promise<T> {
        // Generate new native object when not already created.
        if (!(await this.isValid())) {
            // Destroy native.
            await this.destroy();

            // Generate new native object.
            this.mNativeObject = await this.generate();

            // Generate new id for new generated 
            this.mNativeObjectId = globalThis.crypto.randomUUID();

            // Reset object invalidation.
            this.mObjectInvalid = false;

            // Execute change listener.
            for (const lListener of this.mChangeListener.values()) {
                lListener();
            }
        }

        return <T>this.mNativeObject;
    }

    /**
     * Get native object id.
     */
    public async nativeId(): Promise<string> {
        // Trigger native object refresh. 
        await this.native();

        return this.mNativeObjectId;
    }

    /**
     * Destroy object.
     */
    protected async destroyNative(_pNativeObject: T): Promise<void> {
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
        this.mInternalNativeList.add(pInternalNative);
    }

    /**
     * Trigger native change.
     */
    protected triggerChange(): void {
        // Trigger change.
        this.mObjectInvalid = true;
    }

    /**
     * Unregister internal native object.
     * @param pInternalNative - Internal used native.
     */
    protected unregisterInternalNative(pInternalNative: GpuNativeObject<any>): void {
        // Delete saved native.
        pInternalNative.removeChangeListener(this);
        this.mInternalNativeList.delete(pInternalNative);
    }

    /**
     * Validate native object. Refresh native on negative state.
     * @param _pNativeObject - Generated native object.
     */
    protected async validateState(_pNativeObject: T): Promise<boolean> {
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
     * Check validation of internal objects.
     */
    private async isValid(): Promise<boolean> {
        let lNativeChanged: boolean = false;

        // Check object state.
        if (this.mObjectInvalid || !this.mNativeObject || !(await this.validateState(this.mNativeObject))) {
            lNativeChanged = true;
        }

        // Generate all internal natives and force change listener execution.
        for (const lInternalNative of this.mInternalNativeList) {
            await lInternalNative.native();
        }

        // Check object invalidation again.
        if (this.mObjectInvalid) {
            lNativeChanged = true;
        }

        // Remove native on invalidation to cache change state for future isValidate calls.
        if (lNativeChanged) {
            this.triggerChange();
        }

        return !lNativeChanged;
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
    protected abstract generate(): Promise<T>;
}

type GenericListener = () => void;