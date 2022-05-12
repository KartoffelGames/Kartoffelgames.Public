import { EffectBound } from '../../../enum/effect-bound';
import { EffectPriority } from '../../../enum/effect-priority';
import { SetSampleEffect } from '../../../generic_module/effect/sample/set-sample-effect';
import { Sample } from '../../../generic_module/sample/sample';
import { ChannelSettings } from '../../player-channel';
import { PlayerModule } from '../../player_module/player-module';
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
     * @param pTickChanged - True when tick has changed.
     * @param pPlayerModule - Global player module.
     */
    public process(pChannelSettings: ChannelSettings, _pTickChanged: boolean, pPlayerModule: PlayerModule): ChannelSettings {
        const lSample: Sample = pPlayerModule.module.samples.getSample(this.effectData.sampleIndex);

        // Reset volume and finetune. Set sample.
        pChannelSettings.finetune = lSample.fineTune;
        pChannelSettings.sampleData.sample = lSample;
        pChannelSettings.volume = lSample.volume;

        return pChannelSettings;
    }
}