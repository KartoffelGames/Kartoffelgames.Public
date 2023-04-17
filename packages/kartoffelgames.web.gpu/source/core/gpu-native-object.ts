import { Dictionary } from '@kartoffelgames/core.data';
import { Gpu } from './gpu';

/**
 * Gpu native object.
 */
export abstract class GpuNativeObject<T> {
    private readonly mGpu: Gpu;
    private mLabel: string;
    private mNativeChanged: boolean;
    private readonly mNativeName: string;
    private mNativeObject: T | null;
    private mNativeObjectId: string;
    private readonly mUpdateListener: Dictionary<GpuNativeObject<any>, GenericListener>;

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
        this.mNativeChanged = false;

        this.mUpdateListener = new Dictionary<GpuNativeObject<any>, GenericListener>();

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
     * Equal objects.
     * @param pObject - Object. 
     */
    public equal(pObject: any): boolean {
        return this === pObject;
    }

    /**
     * Get native object.
     */
    public async native(): Promise<T> {
        // Generate new native object when not already created.
        if (!this.mNativeObject || this.mNativeChanged || !(await this.validateState(this.mNativeObject))) {
            // Destroy old native object.
            await this.destroy();

            // Generate new native object.
            this.mNativeObject = await this.generate();

            // Generate new id for new generated 
            this.mNativeObjectId = globalThis.crypto.randomUUID();

            // Execute one way listener on new generated.
            for (const lListener of this.mUpdateListener.values()) {
                lListener();
            }

            // Reset change listener when changes where made.
            this.mNativeChanged = false;
        }

        return this.mNativeObject;
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
     * Register internal native object.
     * Invalidated native when internal changes.
     * @param pInternalNative - Internal used native.
     */
    protected registerInternalNative(pInternalNative: GpuNativeObject<any>): void {
        pInternalNative.registerChangeListener(() => {
            this.mNativeChanged = true;
        }, this);

        // Trigger change.
        this.mNativeChanged = true;
    }

    /**
     * Unregister internal native object.
     * @param pInternalNative - Internal used native.
     */
    protected unregisterInternalNative(pInternalNative: GpuNativeObject<any>): void {
        pInternalNative.unregisterChangeListener(this);

        // Trigger change.
        this.mNativeChanged = true;
    }

    /**
     * Validate native object. Refresh native on negative state.
     * @param _pNativeObject - Generated native object.
     */
    protected async validateState(_pNativeObject: T): Promise<boolean> {
        return true;
    }

    /**
     * Sets listener for changes.
     * Does not set new listener when referer has allready an registered listener.
     * @param pListener - Change listener.
     * @param pReferrer - Referer.
     */
    private registerChangeListener(pListener: GenericListener, pReferrer: GpuNativeObject<any>): void {
        if (!this.mUpdateListener.has(pReferrer)) {
            this.mUpdateListener.set(pReferrer, pListener);
        }
    }

    /**
     * Sets one way listener for changes.
     * Does not set new listener when referer has allready an registered listener.
     * @param pListener - Change listener.
     * @param pReferrer - Referer.
     */
    private unregisterChangeListener(pReferrer: GpuNativeObject<any>): void {
        this.mUpdateListener.delete(pReferrer);
    }

    /**
     * Destory object.
     */
    protected abstract destroyNative(pNativeObject: T): Promise<void>;

    /**
     * Generate native object.
     */
    protected abstract generate(): Promise<T>;
}

type GenericListener = () => void;