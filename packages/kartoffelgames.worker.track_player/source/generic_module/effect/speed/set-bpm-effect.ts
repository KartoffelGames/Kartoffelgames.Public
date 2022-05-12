import { IGenericEffect } from '../../interface/i-generic-effect';

/**
 * Set beats per minute effect.
 */
export class SetBeatsPerMinuteEffect implements IGenericEffect {
    private mBeatsPerMinute: number;

    /**
     * Get beats per minute.
     */
    public get beatsPerMinute(): number {
        return this.mBeatsPerMinute;
    }

    /**
     * Set beats per minute.
     */
    public set beatsPerMinute(pVolume: number) {
        this.mBeatsPerMinute = pVolume;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mBeatsPerMinute = 0;
    }
}