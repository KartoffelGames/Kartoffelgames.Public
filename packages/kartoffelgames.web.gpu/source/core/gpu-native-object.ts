import { Dictionary } from '@kartoffelgames/core.data';
import { Gpu } from './gpu';

/**
 * Gpu native object.
 */
export abstract class GpuNativeObject<T extends object> {
    private readonly mGpu: Gpu;
    private readonly mInternalNatives: Dictionary<GpuNativeObject<any>, string>;
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
        this.mInternalNatives = new Dictionary<GpuNativeObject<any>, string>();

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

            // Check internal natives.
            for (const [lInternalObject, lLastInternalId] of this.mInternalNatives) {
                const lCurrentInternalId: string = lInternalObject.mNativeObjectId;

                // Compare saved and current native id of all natives.
                if (lCurrentInternalId !== lLastInternalId) {
                    // Update saved id.
                    this.mInternalNatives.set(lInternalObject, lCurrentInternalId);
                }
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
        this.mInternalNatives.set(pInternalNative, '');
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
        this.mInternalNatives.delete(pInternalNative);
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

        // Check object state.
        if (!this.mNativeObject || this.mObjectInvalid || !(await this.validateState(this.mNativeObject))) {
            lNativeChanged = true;
        }

        // Check internal natives.
        for (const [lInternalObject, lLastInternalId] of this.mInternalNatives) {
            const lCurrentInternalId: string = await lInternalObject.nativeId();

            // Compare saved and current native id of all natives.
            if (lCurrentInternalId !== lLastInternalId) {
                // Trigger generation.
                lNativeChanged = true;
                break;
            }
        }

        // Remove native on invalidation to cache change state for future isValidate calls.
        if (lNativeChanged) {
            this.triggerChange();
        }

        return !lNativeChanged;
    }

    /**
     * Generate native object.
     */
    protected abstract generate(): Promise<T>;
}