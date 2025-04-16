import { Direction } from '../../../enum/direction.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { Pitch } from '../../../enum/pitch.enum';
import { PeriodSlideEffect } from '../../effect_definition/pitch/period-slide-effect';
import { BaseEffectProcessor } from '../base-effect-processor';

export class PeriodSlideEffectProcessor extends BaseEffectProcessor<PeriodSlideEffect>{
    /**
     * Get effect processor priority.
     */
    public get priority(): EffectPriority {
        return EffectPriority.Low;
    }

    /**
     * Process effect.
     * @param pTickChanged - If tick changed.
     */
    public override onProcess(pTickChanged: boolean): void {
        // Calculate pitch change per sample. Slide in semitones on glisando enabled and effect is glissando sensitive.
        let lPeriodSlide: number = 0;
        if (this.globalSettings.delay.glissandoEnabled && this.effectData.glissandoSensitive) {
            if (pTickChanged) {
                lPeriodSlide = this.channelSettings.pitch * Math.pow(2, 1 / 12);
            }
        } else {
            lPeriodSlide = this.effectData.periodSlidePerTick / this.globalSettings.length.samples;
        }

        // Move in right direction. Pitch down increases the pitch period value.
        if (this.effectData.direction === Direction.Down) {
            this.channelSettings.pitch += lPeriodSlide;
        } else {
            this.channelSettings.pitch -= lPeriodSlide;
        }

        // Set boundary.
        if (this.effectData.noteBoundary !== Pitch.Empty) {
            // Set boundary dependent on slide direction.
            if (this.effectData.direction === Direction.Down) {
                this.channelSettings.pitch = Math.min(this.channelSettings.pitch, this.effectData.noteBoundary);
            } else {
                this.channelSettings.pitch = Math.max(this.channelSettings.pitch, this.effectData.noteBoundary);
            }
        } else {
            // Default boundary between C1 and B3.
            this.channelSettings.pitch = Math.max(Math.min(this.channelSettings.pitch, Pitch.Octave1C), Pitch.Octave3B);
        }
    }
}