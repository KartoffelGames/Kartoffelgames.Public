import { EffectPriority } from '../../../enum/effect-priority.enum';
import { PositionJumpEffect } from '../../effect_definition/jump/position-jump-effect';
import { BaseEffectProcessor } from '../base-effect-processor';

export class JumpEffectProcessor extends BaseEffectProcessor<PositionJumpEffect>{
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
        this.globalSettings.jump.setJumpPosition(this.effectData.songPositionIndex, this.effectData.divisionIndex);
    }
}