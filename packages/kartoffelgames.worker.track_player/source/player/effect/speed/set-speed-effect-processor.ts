import { EffectBound } from '../../../enum/effect-bound';
import { EffectPriority } from '../../../enum/effect-priority';
import { SetSpeedEffect } from '../../../generic_module/effect/speed/set-speed-effect';
import { ChannelSettings } from '../../player-channel';
import { PlayerModule } from '../../player_module/player-module';
import { BaseEffectProcessor } from '../base-effect-processor';

export class SetSpeedEffectProcessor extends BaseEffectProcessor<SetSpeedEffect>{
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
        pPlayerModule.length.setTickRate(this.effectData.speed);
        return pChannelSettings;
    }
}