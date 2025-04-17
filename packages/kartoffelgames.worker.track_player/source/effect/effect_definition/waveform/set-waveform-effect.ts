import { StatefullSerializeable } from '@kartoffelgames/core-serializer';
import { WaveformTarget } from '../../../enum/waveform-target.enum.ts';
import { Waveform } from '../../../enum/waveform.enum.ts';
import { IGenericEffect } from '../i-generic-effect.ts';

/**
 * Set effects waveform effect.
 */
@StatefullSerializeable('03f67b87-0760-4a61-8df6-26161c818f16')
export class SetWaveformEffect implements IGenericEffect {
    private mEffectTarget: WaveformTarget;
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
        this.mEffectTarget = WaveformTarget.Vibrato;
    }
}