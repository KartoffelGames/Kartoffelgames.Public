import { EffectBound } from '../../../enum/effect-bound';
import { EffectPriority } from '../../../enum/effect-priority';
import { SetGlissandoEffect } from '../../../generic_module/effect/pitch/set-glissando-effect';
import { ChannelSettings } from '../../player-channel';
import { PlayerModule } from '../../player_module/player-module';
import { BaseEffectProcessor } from '../base-effect-processor';

export class SetGlissandoEffectProcessor extends BaseEffectProcessor<SetGlissandoEffect>{
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
        // Set global glissando state.
        pPlayerModule.settings.glissandoEnabled = this.effectData.enabled;

        return pChannelSettings;
    }
}