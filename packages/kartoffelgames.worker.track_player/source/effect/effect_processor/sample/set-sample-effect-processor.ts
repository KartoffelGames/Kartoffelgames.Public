import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SetSampleEffect } from '../../effect_definition/sample/set-sample-effect';
import { Sample } from '../../../generic_module/sample/sample';
import { PlayerChannelSettings } from '../../../player/player-channel-settings';
import { PlayerGlobalSettings } from '../../../player/player_module/player-global-settings';
import { BaseEffectProcessor } from '../base-effect-processor';

export class SetSampleEffectProcessor extends BaseEffectProcessor<SetSampleEffect>{
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
     * @param pGlobalSettings - Global player settings.
     */
    public process(pChannelSettings: PlayerChannelSettings, pGlobalSettings: PlayerGlobalSettings): void {
        const lSample: Sample = pGlobalSettings.module.samples.getSample(this.effectData.sampleIndex);

        // Reset volume and finetune. Set sample.
        pChannelSettings.finetune = lSample.fineTune;
        pChannelSettings.sampleData.sample = lSample;
        pChannelSettings.volume = lSample.volume;
        pChannelSettings.invertLoop = false;
    }
}