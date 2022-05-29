import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SetSpeedEffect } from '../../effect_definition/speed/set-speed-effect';
import { BaseEffectProcessor } from '../base-effect-processor';

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