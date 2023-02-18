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
     * Get native object.
     */
    public async native(): Promise<T> {
        // Generate new native object when not already created.
        if (!this.mNativeObject || await this.validateState()) {
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
     * Generate native object.
     */
    protected abstract generate(): Promise<T>;
}