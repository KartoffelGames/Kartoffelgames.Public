import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SetFinetuneEffect } from '../../effect_definition/pitch/set-finetune-effect';
import { BaseEffectProcessor } from '../base-effect-processor';

export class SetFinetuneEffectProcessor extends BaseEffectProcessor<SetFinetuneEffect>{
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
        // Set finetune.
        this.channelSettings.finetune = this.effectData.finetune;
    }
}