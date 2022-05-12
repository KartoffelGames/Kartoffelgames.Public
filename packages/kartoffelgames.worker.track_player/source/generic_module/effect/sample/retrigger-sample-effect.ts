import { IGenericEffect } from '../../interface/i-generic-effect';

/**
 * Sample retrigger effect.
 */
export class RetriggerSampleEffect implements IGenericEffect {
    private mRetriggerTickInterval: number;

    /**
     * Get tick interval.
     */
    public get tickInterval(): number {
        return this.mRetriggerTickInterval;
    }

    /**
     * Set tick interval.
     */
    public set tickInterval(pInterval: number) {
        this.mRetriggerTickInterval = pInterval;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mRetriggerTickInterval = 0;
    }
}