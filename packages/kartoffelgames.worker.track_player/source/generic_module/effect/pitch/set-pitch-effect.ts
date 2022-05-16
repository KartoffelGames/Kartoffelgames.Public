import { Pitch } from '../../../enum/pitch.enum';
import { IGenericEffect } from '../../interface/i-generic-effect';

/**
 * Sample finetune effect.
 */
export class SetPitchEffect implements IGenericEffect {
    private mPitch: Pitch;

    /**
     * Get pitch.
     */
    public get pitch(): Pitch {
        return this.mPitch;
    }

    /**
     * Set pitch.
     */
    public set pitch(pFinetune: Pitch) {
        this.mPitch = pFinetune;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mPitch = Pitch.Octave2C;
    }
}