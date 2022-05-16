import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SetBeatsPerMinuteEffect } from '../../../generic_module/effect/speed/set-bpm-effect';
import { ChannelSettings } from '../../player-channel';
import { PlayerModule } from '../../player_module/player-module';
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
     */
    public process(pChannelSettings: ChannelSettings, pPlayerModule: PlayerModule): ChannelSettings {
        // Set speed, keep beats per minute.
        const lCurrentSpeedUp: number = pPlayerModule.speed.speed.speedUp;
        pPlayerModule.speed.setSpeed(this.effectData.beatsPerMinute, lCurrentSpeedUp);

        return pChannelSettings;
    }
}