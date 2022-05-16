import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { DelaySampleEffect } from '../../../generic_module/effect/sample/delay-sample-effect';
import { ChannelSettings } from '../../player-channel';
import { PlayerModule } from '../../player_module/player-module';
import { BaseEffectProcessor } from '../base-effect-processor';

export class DelaySampleEffectProcessor extends BaseEffectProcessor<DelaySampleEffect>{
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
        // Delay sample position as long as current tick is lower than specified one.
        if (pTickChanged && pPlayerModule.cursor.tickIndex < this.effectData.ticks) {
            pChannelSettings.sampleData.position = 0;
        }

        return pChannelSettings;
    }
}