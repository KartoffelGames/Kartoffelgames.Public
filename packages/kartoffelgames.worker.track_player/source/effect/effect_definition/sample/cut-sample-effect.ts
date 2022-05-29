import { IGenericEffect } from '../i-generic-effect';

/**
 * Sample cut effect.
 */
export class CutSampleEffect implements IGenericEffect {
    private mTicks: number;

    /**
     * Get ticks after the sample is cut.
     */
    public get ticks(): number {
        return this.mTicks;
    }

    /**
     * Set ticks after the sample is cut.
     */
    public set ticks(pOffset: number) {
        this.mTicks = pOffset;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mTicks = 0;
    }
}