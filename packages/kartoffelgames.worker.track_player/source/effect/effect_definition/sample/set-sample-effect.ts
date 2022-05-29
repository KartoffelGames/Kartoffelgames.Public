import { IGenericEffect } from '../i-generic-effect';

/**
 * Sample set effect.
 */
export class SetSampleEffect implements IGenericEffect {
    private mSampleIndex: number;

    /**
     * Get sample index.
     */
    public get sampleIndex(): number {
        return this.mSampleIndex;
    }

    /**
     * Set sample index.
     */
    public set sampleIndex(pOffset: number) {
        this.mSampleIndex = pOffset;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mSampleIndex = 0;
    }
}