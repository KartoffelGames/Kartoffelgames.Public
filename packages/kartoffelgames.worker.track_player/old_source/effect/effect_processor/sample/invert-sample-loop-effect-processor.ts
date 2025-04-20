import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { InvertSampleLoopEffect } from '../../effect_definition/sample/invert-sample-loop-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

export class InvertSampleLoopEffectProcessor extends BaseEffectProcessor<InvertSampleLoopEffect>{
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
        this.channelSettings.invertLoop = this.effectData.invert;
    }
}