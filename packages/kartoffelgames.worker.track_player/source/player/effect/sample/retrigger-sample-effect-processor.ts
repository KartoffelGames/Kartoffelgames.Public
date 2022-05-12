import { EffectBound } from '../../../enum/effect-bound';
import { EffectPriority } from '../../../enum/effect-priority';
import { RetriggerSampleEffect } from '../../../generic_module/effect/sample/retrigger-sample-effect';
import { ChannelSettings } from '../../player-channel';
import { PlayerModule } from '../../player_module/player-module';
import { BaseEffectProcessor } from '../base-effect-processor';

export class RetriggerSampleEffectProcessor extends BaseEffectProcessor<RetriggerSampleEffect>{
    /**
     * Get effect processor bound.
     */
    public get effectBound(): EffectBound {
        return EffectBound.Division;
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
    public process(pChannelSettings: ChannelSettings, pPlayerModule: PlayerModule, pTickChanged: boolean): ChannelSettings {
        // Retrigger sample position when tick reaches a retigger tick.
        if (pTickChanged && (pPlayerModule.cursor.tickIndex % this.effectData.tickInterval) === 0) {
            pChannelSettings.sampleData.position = 0;
        }

        return pChannelSettings;
    }
}