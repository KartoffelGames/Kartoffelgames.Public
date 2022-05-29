import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { PositionJumpEffect } from '../../effect_definition/jump/position-jump-effect';
import { PlayerChannelSettings } from '../../../player/player-channel-settings';
import { PlayerGlobalSettings } from '../../../player/player_module/player-global-settings';
import { BaseEffectProcessor } from '../base-effect-processor';

export class JumpEffectProcessor extends BaseEffectProcessor<PositionJumpEffect>{
    /**
     * Get effect processor bound.
     */
    public get effectBound(): EffectBound {
        return EffectBound.Single;
    }

    /**
     * Get effect processor priority.
     */
    public get priority(): EffectPriority {
        return EffectPriority.Low;
    }

    /**
     * Process effect.
     * @param _pChannelSettings - Executing channel settings.
     * @param pGlobalSettings - Global player settings.
     */
    public process(_pChannelSettings: PlayerChannelSettings, pGlobalSettings: PlayerGlobalSettings): void {
        // Set jump position.
        pGlobalSettings.jump.setJumpPosition(this.effectData.songPositionIndex, this.effectData.divisionIndex);
    }
}