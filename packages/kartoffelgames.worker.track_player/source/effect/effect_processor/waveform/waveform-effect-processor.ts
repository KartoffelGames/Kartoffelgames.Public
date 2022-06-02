import { EffectPriority } from '../../../enum/effect-priority.enum';
import { WaveformTarget } from '../../../enum/waveform-target.enum';
import { Waveform } from '../../../enum/waveform.enum';
import { WaveformEffect } from '../../effect_definition/waveform/waveform-effect';
import { BaseEffectProcessor } from '../base-effect-processor';

export class WaveformEffectProcessor extends BaseEffectProcessor<WaveformEffect>{
    private mInitialValue: number = 0;

    /**
     * Get effect processor priority.
     */
    public get priority(): EffectPriority {
        return EffectPriority.Low;
    }

    /**
     * On effect end.
     */
    public override onEffectEnd(): void {
        const lTarget: WaveformTarget = this.effectData.target;

        // Reset pitch or volume to the initial value.
        if (lTarget === WaveformTarget.Tremolo) {
            this.channelSettings.volume = this.mInitialValue;
        } else if (lTarget === WaveformTarget.Vibrato) {
            this.channelSettings.pitch = this.mInitialValue;
        }
    }

    /**
     * On effect start.
     */
    public override onEffectStart(): void {
        const lTarget: WaveformTarget = this.effectData.target;

        // Save initial pitch for the reset after this effect.
        if (lTarget === WaveformTarget.Tremolo) {
            this.mInitialValue = this.channelSettings.volume;
        } else if (lTarget === WaveformTarget.Vibrato) {
            this.mInitialValue = this.channelSettings.pitch;
        }

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
        const lAmplitude: number = this.effectData.amplitude;
        const lWaveform: Waveform = this.globalSettings.wave.getWaveform(lTarget).waveform;

        // Get current wave position for waveform target.
        const lCurrentPosition: number = this.channelSettings.getWaveformPosition(lTarget);

        // Get waveform value of current position for set waveform.
        const lCurrentValue: number = this.getWaveValue(lAmplitude, lCurrentPosition, lWaveform);

        // Calculate next position.
        const lNextPosition: number = lCurrentPosition + (this.effectData.circlePerTick / this.globalSettings.length.samples);
        this.channelSettings.setWaveformPosition(lTarget, lNextPosition);

        // Calculate pitch or volume value based on current wave value.
        if (lTarget === WaveformTarget.Tremolo) {
            this.channelSettings.volume = this.mInitialValue + lCurrentValue;
        } else if (lTarget === WaveformTarget.Vibrato) {
            this.channelSettings.pitch = this.mInitialValue * Math.pow(Math.pow(2, 1 / 12), lCurrentValue);
        }
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