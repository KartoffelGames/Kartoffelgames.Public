import { EffectBound } from '../../../enum/effect-bound';
import { EffectPriority } from '../../../enum/effect-priority';
import { LoopEffect } from '../../../generic_module/effect/jump/loop-effect';
import { ChannelSettings } from '../../player-channel';
import { PlayerModule } from '../../player_module/player-module';
import { BaseEffectProcessor } from '../base-effect-processor';

export class LoopEffectProcessor extends BaseEffectProcessor<LoopEffect>{
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
     * @param pPlayerModule - Global player module.
     */
    public process(pChannelSettings: ChannelSettings, pPlayerModule: PlayerModule): ChannelSettings {
        // Set loop count.
        pPlayerModule.jump.setLoop(this.effectData.loopCount);

        return pChannelSettings;
    }
}