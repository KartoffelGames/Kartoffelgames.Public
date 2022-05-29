import { EffectPriority } from '../../../enum/effect-priority.enum';
import { WaveformTarget } from '../../../enum/waveform-target.enum';
import { Waveform } from '../../../enum/waveform.enum';
import { WaveformEffect } from '../../effect_definition/waveform/waveform-effect';
import { BaseEffectProcessor } from '../base-effect-processor';

export class WaveformEffectProcessor extends BaseEffectProcessor<WaveformEffect>{
    /**
     * Get effect processor priority.
     */
    public get priority(): EffectPriority {
        return EffectPriority.Low;
    }


    /**
     * On process start.
     */
    public override onEffectStart(): void {
        const lTarget: WaveformTarget = this.effectData.target;

        // Reset waveform position if set to retrigger.
        if (this.globalSettings.wave.getWaveform(lTarget).retrigger) {
            this.channelSettings.setWaveformPosition(lTarget, 0);
        }
    }

    /**
     * Process effect.
     */
    public override onProcess(): void {
        const lTarget: WaveformTarget = this.effectData.target;


        // TODO: Calculate waveform value based on set waveform.
        // TODO: When retrigger is on safe position. HOW?


    }


    /**
     * Generate sine value.
     * @param pAmplitude - Wave amplitude.
     * @param pPosition - On the period 1 wave.
     */
    private getSineValue(pAmplitude: number, pPosition: number): number {
        return pAmplitude * Math.sin(2 * pPosition * Math.PI);
    }

    /**
     * Generate zaw tooth value.
     * @param pAmplitude - Wave amplitude.
     * @param pPosition - On the period 1 wave.
     */
    private getSquareValue(pAmplitude: number, pPosition: number): number {
        return Math.pow(-1, Math.floor(2 * 1 * pPosition)) * pAmplitude;
    }

    /**
     * Generate waveform value.
     * @param pAmplitude - Wave amplitude.
     * @param pPosition - On the period 1 wave.
     * @param pWaveform - Waveform.
     */
    private getWaveValue(pAmplitude: number, pPosition: number, pWaveform: Waveform): number {
        switch (pWaveform) {
            case Waveform.Sine:
                return this.getSineValue(pAmplitude, pPosition);
            case Waveform.Square:
                return this.getSquareValue(pAmplitude, pPosition);
            case Waveform.RampDown:
                return this.getZawToothValue(pAmplitude, pPosition);
        }
    }

    /**
     * Generate zaw tooth value.
     * @param pAmplitude - Wave amplitude.
     * @param pPosition - On the period 1 wave.
     */
    private getZawToothValue(pAmplitude: number, pPosition: number): number {
        return 2 * (pPosition / 1 - Math.floor(0.5 + pPosition / 1)) * pAmplitude;
    }
}