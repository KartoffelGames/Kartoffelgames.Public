import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SetPitchEffect } from '../../effect_definition/pitch/set-pitch-effect';
import { PlayerChannelSettings } from '../../../player/player-channel-settings';
import { BaseEffectProcessor } from '../base-effect-processor';

export class SetPitchEffectProcessor extends BaseEffectProcessor<SetPitchEffect>{
    /**
     * Get effect processor bound.
     */
    public get effectBound(): EffectBound {
        return EffectBound.Single;
    }

    /**
     * Get effect processor priority.
     */
    public get priority(): EffectPriority {
        return EffectPriority.High;
    }

    /**
     * Process effect.
     * @param pChannelSettings - Executing channel settings.
     */
    public process(pChannelSettings: PlayerChannelSettings): void {
        // Reset sample position. Set pitch.
        pChannelSettings.pitch = this.effectData.pitch;
        pChannelSettings.sampleData.position = 0;
    }
}