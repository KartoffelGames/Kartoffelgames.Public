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
        if (!this.mNativeObject) {
            this.mNativeObject = await this.generate();
        }

        return this.mNativeObject;
    }

    /**
     * Reset generated native object.
     */
    protected reset(): void {
        this.mNativeObject = null;
    }

    /**
     * Generate native object.
     */
    protected abstract generate(): Promise<T>;
}