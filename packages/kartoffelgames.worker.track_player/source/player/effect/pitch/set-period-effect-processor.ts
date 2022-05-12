import { EffectBound } from '../../../enum/effect-bound';
import { EffectPriority } from '../../../enum/effect-priority';
import { SetPitchEffect } from '../../../generic_module/effect/pitch/set-pitch-effect';
import { ChannelSettings } from '../../player-channel';
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
    public process(pChannelSettings: ChannelSettings): ChannelSettings {
        // Reset sample position. Set pitch.
        pChannelSettings.pitch = this.effectData.pitch;
        pChannelSettings.sampleData.position = 0;

        return pChannelSettings;
    }
}