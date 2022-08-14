import { StatefullSerializeable } from '@kartoffelgames/core.serializer';
import { Pitch } from '../../../enum/pitch.enum';
import { IGenericEffect } from '../i-generic-effect';

/**
 * Sample finetune effect.
 */
@StatefullSerializeable('ad509656-422c-464e-9fd0-b26e417d7219')
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