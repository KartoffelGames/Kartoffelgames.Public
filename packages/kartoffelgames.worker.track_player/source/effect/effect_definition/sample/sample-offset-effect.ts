import { IGenericEffect } from '../i-generic-effect';

/**
 * Sample offset effect.
 */
export class SampleOffsetEffect implements IGenericEffect {
    private mOffset: number;

    /**
     * Get sample offset.
     */
    public get offset(): number {
        return this.mOffset;
    }

    /**
     * Set sample offset.
     */
    public set offset(pOffset: number) {
        this.mOffset = pOffset;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mOffset = 0;
    }
}