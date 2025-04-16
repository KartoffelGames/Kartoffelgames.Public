import { EffectPriority } from '../../../enum/effect-priority.enum';
import { PositionJumpEffect } from '../../effect_definition/jump/position-jump-effect';
import { BaseEffectProcessor } from '../base-effect-processor';

export class PositionJumpEffectProcessor extends BaseEffectProcessor<PositionJumpEffect>{
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
        // Shift or jump song position.
        if (this.effectData.songPositionShiftMode) {
            const lCurrentSongPosition: number = this.globalSettings.cursor.songPositionCursor;

            // Set jump position.
            this.globalSettings.jump.setJumpPosition(lCurrentSongPosition + this.effectData.songPosition, this.effectData.divisionIndex);
        } else {
            // Set jump position.
            this.globalSettings.jump.setJumpPosition(this.effectData.songPosition, this.effectData.divisionIndex);
        }


    }
}