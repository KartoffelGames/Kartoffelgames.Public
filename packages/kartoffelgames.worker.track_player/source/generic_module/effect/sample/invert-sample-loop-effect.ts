import { IGenericEffect } from '../../interface/i-generic-effect';

/**
 * Sample loop invert effect.
 */
export class InvertSampleLoopEffect implements IGenericEffect {
    private mInvert: boolean;

    /**
     * Get if loop should be inverted.
     */
    public get offset(): boolean {
        return this.mInvert;
    }

    /**
     * Set if loop should be inverted.
     */
    public set offset(pOffset: boolean) {
        this.mInvert = pOffset;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mInvert = false;
    }
}