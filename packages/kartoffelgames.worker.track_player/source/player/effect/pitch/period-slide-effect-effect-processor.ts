import { Direction } from '../../../enum/direction.enum';
import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { Pitch } from '../../../enum/pitch.enum';
import { PeriodSlideEffect } from '../../../generic_module/effect/pitch/period-slide-effect';
import { ChannelSettings } from '../../player-channel';
import { PlayerModule } from '../../player_module/player-module';
import { BaseEffectProcessor } from '../base-effect-processor';

export class PeriodSlideEffectProcessor extends BaseEffectProcessor<PeriodSlideEffect>{
    /**
     * Get effect processor bound.
     */
    public get effectBound(): EffectBound {
        return EffectBound.Division;
    }

    /**
     * Get effect processor priority.
     */
    public get priority(): EffectPriority {
        return EffectPriority.Low;
    }

    /**
     * Process effect.
     * @param pChannelSettings - Executing channel settings.
     * @param pPlayerModule - Global player module.
     */
    public process(pChannelSettings: ChannelSettings, pPlayerModule: PlayerModule, pTickChanged: boolean): ChannelSettings {
        // Calculate pitch change per sample. Slide in semitones on glisando enabled and effect is glissando sensitive.
        let lPeriodSlide: number = 0;
        if (pPlayerModule.settings.glissandoEnabled && this.effectData.glissandoSensitive) {
            if (pTickChanged) {
                lPeriodSlide = pChannelSettings.pitch * Math.pow(2, 1 / 12);
            }
        } else {
            lPeriodSlide = this.effectData.periodSlidePerTick / pPlayerModule.length.samples;
        }

        // Move in right direction. Pitch down increases the pitch period value.
        if (this.effectData.direction === Direction.Down) {
            pChannelSettings.pitch += lPeriodSlide;
        } else {
            pChannelSettings.pitch -= lPeriodSlide;
        }

        // Set boundary.
        if (this.effectData.noteBoundary !== Pitch.Empty) {
            // Set boundary dependent on slide direction.
            if (this.effectData.direction === Direction.Down) {
                pChannelSettings.pitch = Math.min(pChannelSettings.pitch, this.effectData.noteBoundary);
            } else {
                pChannelSettings.pitch = Math.max(pChannelSettings.pitch, this.effectData.noteBoundary);
            }
        } else {
            // Default boundary between C1 and B3.
            pChannelSettings.pitch = Math.max(Math.min(pChannelSettings.pitch, Pitch.Octave1C), Pitch.Octave3B);
        }

        return pChannelSettings;
    }
}