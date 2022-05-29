import { IGenericEffect } from '../i-generic-effect';

/**
 * Sample delay effect.
 */
export class DelaySampleEffect implements IGenericEffect {
    private mTicks: number;

    /**
     * Get ticks after the sample is played.
     */
    public get ticks(): number {
        return this.mTicks;
    }

    /**
     * Set ticks after the sample is played.
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