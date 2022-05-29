import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SetLoopPositionEffectEffect } from '../../effect_definition/jump/set-loop-position-effect';
import { PlayerChannelSettings } from '../../../player/player-channel-settings';
import { PlayerGlobalSettings } from '../../../player/player_module/player-global-settings';
import { BaseEffectProcessor } from '../base-effect-processor';

export class SetLoopPositionEffectProcessor extends BaseEffectProcessor<SetLoopPositionEffectEffect>{
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
        pGlobalSettings.jump.setLoopPosition(this.effectData.divisionIndex);
    }
}