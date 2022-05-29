import { EffectPriority } from '../../../enum/effect-priority.enum';
import { LoopEffect } from '../../effect_definition/jump/loop-effect';
import { BaseEffectProcessor } from '../base-effect-processor';

export class LoopEffectProcessor extends BaseEffectProcessor<LoopEffect>{
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
        // Set loop count.
        this.globalSettings.jump.setLoop(this.effectData.loopCount);
    }
}