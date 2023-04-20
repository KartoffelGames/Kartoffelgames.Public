import { Dictionary } from '@kartoffelgames/core.data';
import { Gpu } from './gpu';

/**
 * Gpu native object.
 */
export abstract class GpuNativeObject<T extends object> {
    private readonly mChangeListener: Dictionary<GpuNativeObject<any>, GenericListener>;
    private readonly mGpu: Gpu;
    private mInternalNativeChanged: boolean;
    private readonly mInternalNativeList: Set<GpuNativeObject<any>>;
    private mLabel: string;
    private readonly mNativeName: string;
    private mNativeObject: T | null;
    private mNativeObjectId: string;

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
        this.mInternalNativeChanged = false;

        // Init internal native change detection.
        this.mChangeListener = new Dictionary<GpuNativeObject<any>, GenericListener>();
        this.mInternalNativeList = new Set<GpuNativeObject<any>>();

        // Basic ununique id for uninitialized state.
        this.mNativeObjectId = globalThis.crypto.randomUUID();
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

            // Set new id.
            this.mNativeObjectId = globalThis.crypto.randomUUID();
        }
    }

    /**
     * Get native object.
     */
    public async native(): Promise<T> {
        // Generate new native object when not already created.
        if (!(await this.isValid())) {
            // Generate new native object.
            this.mNativeObject = await this.generate();

            // Generate new id for new generated 
            this.mNativeObjectId = globalThis.crypto.randomUUID();

            // Execute one way listener on new generated.
            for (const lListener of this.mChangeListener.values()) {
                lListener();
            }

            // Reset change listener when changes where made.
            this.mInternalNativeChanged = false;
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
        this.mInternalNativeList.add(pInternalNative);

        // Register change listener on internal native.
        pInternalNative.registerChangeListener(() => {
            this.triggerChange();
        }, this);

        // Trigger change.
        this.triggerChange();
    }

    /**
     * Trigger native change.
     */
    protected triggerChange(): void {
        // Trigger change.
        this.mInternalNativeChanged = true;
    }

    /**
     * Unregister internal native object.
     * @param pInternalNative - Internal used native.
     */
    protected unregisterInternalNative(pInternalNative: GpuNativeObject<any>): void {
        // Delete saved native.
        this.mInternalNativeList.delete(pInternalNative);

        // Unregister change listener on internal native.
        pInternalNative.unregisterChangeListener(this);

        // Trigger change.
        this.triggerChange();
    }

    /**
     * Validate native object. Refresh native on negative state.
     * @param _pNativeObject - Generated native object.
     */
    protected async validateState(_pNativeObject: T): Promise<boolean> {
        return true;
    }

    /**
     * Check validation of internal objects.
     */
    private async isValid(): Promise<boolean> {
        let lNativeChanged: boolean = false;

        // Check internal object state.
        if (!this.mNativeObject || this.mInternalNativeChanged || !(await this.validateState(this.mNativeObject))) {
            lNativeChanged = true;
        }

        // Check internal natives.
        if (!lNativeChanged) {
            for (const lInternalNative of this.mInternalNativeList) {
                if (!await lInternalNative.isValid()) {
                    lNativeChanged = true;
                    break;
                }
            }
        }

        // Remove native on invalidation to cache change state for future isValidate calls.
        if (lNativeChanged) {
            await this.destroy();
        }

        return !lNativeChanged;
    }

    /**
     * Sets listener for changes.
     * Does not set new listener when referer has allready an registered listener.
     * @param pListener - Change listener.
     * @param pReferrer - Referer.
     */
    private registerChangeListener(pListener: GenericListener, pReferrer: GpuNativeObject<any>): void {
        if (!this.mChangeListener.has(pReferrer)) {
            this.mChangeListener.set(pReferrer, pListener);
        }
    }

    /**
     * Sets one way listener for changes.
     * Does not set new listener when referer has allready an registered listener.
     * @param pListener - Change listener.
     * @param pReferrer - Referer.
     */
    private unregisterChangeListener(pReferrer: GpuNativeObject<any>): void {
        this.mChangeListener.delete(pReferrer);
    }

    /**
     * Generate native object.
     */
    protected abstract generate(): Promise<T>;
}

type GenericListener = () => void;