import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { SetFinetuneEffect } from '../../effect_definition/pitch/set-finetune-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

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