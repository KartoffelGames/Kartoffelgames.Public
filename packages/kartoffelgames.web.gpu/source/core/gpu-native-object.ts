import { Gpu } from './gpu';

/**
 * Gpu native object.
 */
export abstract class GpuNativeObject<T> {
    private readonly mGpu: Gpu;
    private mLabel: string;
    private mNativeObject: T | null;

    /**
     * Debug label.
     */
    public get label(): string {
        return this.mLabel;
    } set label(pLabel: string) {
        this.mLabel = pLabel;
    }

    /**
     * Generated native object.
     */
    protected get generatedNative(): T | null {
        return this.mNativeObject;
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
     */
    public constructor(pGpu: Gpu) {
        this.mGpu = pGpu;
        this.mNativeObject = null;
        this.mLabel = '';
    }

    /**
     * Destroy generated native object.
     */
    public async destroy(): Promise<void> {
        // Destroy old native object.
        if (this.mNativeObject) {
            await this.destroyNative(this.mNativeObject);
        }
    }

    /**
     * Get native object.
     */
    public async native(): Promise<T> {
        // Generate new native object when not already created.
        if (!this.mNativeObject || await this.validateState()) {
            // Destroy old native object.
            await this.destroy();

            // Generate new native object.
            this.mNativeObject = await this.generate();
        }

        return this.mNativeObject;
    }

    /**
     * Validate native object. Refresh native on negative state.
     */
    protected async validateState(): Promise<boolean> {
        return true;
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