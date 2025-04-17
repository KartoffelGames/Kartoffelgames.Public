import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { SetLoopPositionEffectEffect } from '../../effect_definition/jump/set-loop-position-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

export class SetLoopPositionEffectProcessor extends BaseEffectProcessor<SetLoopPositionEffectEffect>{
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
        // Set jump position.
        this.globalSettings.jump.setLoopPosition(this.effectData.divisionIndex);
    }
}