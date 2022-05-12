import { Waveform } from '../../../enum/waveform.enum';
import { IGenericEffect } from '../../interface/i-generic-effect';

/**
 * Set effects waveform effect.
 */
export class SetWaveformEffect implements IGenericEffect {
    private mEffectTarget: WaveformEffectTarget;
    private mRetrigger: boolean;
    private mWaveform: Waveform;

    /**
     * Get if waveform should retrigger each call.
     */
    public get retrigger(): boolean {
        return this.mRetrigger;
    }

    /**
     * Set if waveform should retrigger each call.
     */
    public set retrigger(pRetrigger: boolean) {
        this.mRetrigger = pRetrigger;
    }

    /**
     * Get effect target.
     */
    public get target(): WaveformEffectTarget {
        return this.mEffectTarget;
    }

    /**
     * Set effect target.
     */
    public set target(pTarget: WaveformEffectTarget) {
        this.mEffectTarget = pTarget;
    }

    /**
     * Get waveform.
     */
    public get waveform(): Waveform {
        return this.mWaveform;
    }

    /**
     * Set waveform.
     */
    public set waveform(pWaveform: Waveform) {
        this.mWaveform = pWaveform;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mRetrigger = true;
        this.mWaveform = Waveform.Sine;
        this.mEffectTarget = 'vibrato';
    }
}

type WaveformEffectTarget = 'vibrato' | 'tremolo';