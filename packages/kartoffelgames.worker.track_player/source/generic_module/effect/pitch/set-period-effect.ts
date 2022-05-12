import { Pitch } from '../../../enum/Pitch';
import { IGenericEffect } from '../../interface/i-generic-effect';

/**
 * Devision period slide effect.
 */
export class SetPeriodEffect implements IGenericEffect {
    private mPeriod: Pitch;

    /**
     * Set period.
     */
    public get period(): Pitch {
        return this.mPeriod;
    }

    /**
     * Set period.
     */
    public set period(pPeriod: Pitch) {
        this.mPeriod = pPeriod;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mPeriod = Pitch.Empty;
    }
}