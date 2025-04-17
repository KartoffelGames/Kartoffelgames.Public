import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { SetSpeedEffect } from '../../effect_definition/speed/set-speed-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

export class SetSpeedEffectProcessor extends BaseEffectProcessor<SetSpeedEffect>{
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
        this.globalSettings.length.setTickRate(this.effectData.speed);
    }
}