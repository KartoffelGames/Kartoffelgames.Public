import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SetFinetuneEffect } from '../../../generic_module/effect/pitch/set-finetune-effect';
import { PlayerChannelSettings } from '../../player-channel-settings';
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
    public process(pChannelSettings: PlayerChannelSettings): void {
        // Set finetune.
        pChannelSettings.finetune = this.effectData.finetune;
    }
}