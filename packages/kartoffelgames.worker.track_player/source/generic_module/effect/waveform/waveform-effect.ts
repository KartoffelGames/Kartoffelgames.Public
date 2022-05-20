import { WaveformTarget } from '../../../enum/waveform-target.enum';
import { IGenericEffect } from '../../interface/i-generic-effect';

/**
 * Devision waveform effect.
 */
export class WaveformEffect implements IGenericEffect {
    private mAmplitude: number;
    private mCirclesPerTick: number;
    private mEffectTarget: WaveformTarget;

    /**
     * Get amplitude.
     */
    public get amplitude(): number {
        return this.mAmplitude;
    }

    /**
     * Set amplitude.
     */
    public set amplitude(pAmplitude: number) {
        this.mAmplitude = pAmplitude;
    }

    /**
     * Get circles per tick.
     */
    public get circlePerTick(): number {
        return this.mCirclesPerTick;
    }

    /**
     * Set circles per tick.
     */
    public set circlePerTick(pCirclePerTick: number) {
        this.mCirclesPerTick = pCirclePerTick;
    }

    /**
     * Get effect target.
     */
    public get target(): WaveformTarget {
        return this.mEffectTarget;
    }

    /**
     * Set effect target.
     */
    public set target(pTarget: WaveformTarget) {
        this.mEffectTarget = pTarget;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mAmplitude = 0;
        this.mCirclesPerTick = 0;
        this.mEffectTarget = WaveformTarget.Vibrato;
    }
}