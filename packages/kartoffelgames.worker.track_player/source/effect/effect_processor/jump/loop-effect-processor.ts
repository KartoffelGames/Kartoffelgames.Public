import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { LoopEffect } from '../../effect_definition/jump/loop-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

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