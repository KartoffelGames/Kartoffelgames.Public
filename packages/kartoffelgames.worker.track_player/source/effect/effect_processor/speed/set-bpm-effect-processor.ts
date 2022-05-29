import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SetBeatsPerMinuteEffect } from '../../effect_definition/speed/set-bpm-effect';
import { PlayerChannelSettings } from '../../../player/player-channel-settings';
import { PlayerGlobalSettings } from '../../../player/player_module/player-global-settings';
import { BaseEffectProcessor } from '../base-effect-processor';

export class SetBeatsPerMinuteEffectProcessor extends BaseEffectProcessor<SetBeatsPerMinuteEffect>{
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
     * @param pChannelSettings - Executing channel settings.
     * @param pGlobalSettings - Global player settings.
     */
    public process(_pChannelSettings: PlayerChannelSettings, pGlobalSettings: PlayerGlobalSettings): void {
        // Set speed, keep beats per minute.
        const lCurrentSpeedUp: number = pGlobalSettings.speed.speed.speedUp;
        pGlobalSettings.speed.setSpeed(this.effectData.beatsPerMinute, lCurrentSpeedUp);
    }
}