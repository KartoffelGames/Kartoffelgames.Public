import { EffectBound } from '../../../enum/effect-bound';
import { EffectPriority } from '../../../enum/effect-priority';
import { SetFinetuneEffect } from '../../../generic_module/effect/pitch/set-finetune-effect';
import { ChannelSettings } from '../../player-channel';
import { BaseEffectProcessor } from '../base-effect-processor';

export class SetFinetuneEffectProcessor extends BaseEffectProcessor<SetFinetuneEffect>{
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
        return EffectPriority.Low;
    }

    /**
     * Process effect.
     * @param pChannelSettings - Executing channel settings.
     */
    public process(pChannelSettings: ChannelSettings): ChannelSettings {
        // Set finetune.
        pChannelSettings.finetune = this.effectData.finetune;
        return pChannelSettings;
    }
}