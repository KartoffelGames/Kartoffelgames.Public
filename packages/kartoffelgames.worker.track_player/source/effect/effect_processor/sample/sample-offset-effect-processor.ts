import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { SampleOffsetEffect } from '../../effect_definition/sample/sample-offset-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

export class SampleOffsetEffectProcessor extends BaseEffectProcessor<SampleOffsetEffect>{
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
        this.channelSettings.setSamplePosition(this.effectData.offset);
    }
}