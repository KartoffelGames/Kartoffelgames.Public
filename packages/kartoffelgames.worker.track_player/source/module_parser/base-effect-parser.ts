import { IGenericEffect } from '../effect/effect_definition/i-generic-effect';
import { SetPitchEffect } from '../effect/effect_definition/pitch/set-pitch-effect';

export class BaseEffectParser {
    public addEffectHandler(pBitPattern: string, pHandler: (pParameterX: number, pParameterY: number) => Array<IGenericEffect>) {
        // TODO: 
    }

    public addPitchHandler(pHandler: (pPitch: number) => SetPitchEffect) {
        // TODO:
    }

    public parseChannel(pChannel: ChannelValue): Array<IGenericEffect> {
        // TODO:
        return [];
    }
}

export type ChannelValue = {
    effect: number;
    pitch: number;
    sample: number;
};