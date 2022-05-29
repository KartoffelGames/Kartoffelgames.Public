import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { DelaySampleEffect } from '../../effect_definition/sample/delay-sample-effect';
import { PlayerChannelSettings } from '../../../player/player-channel-settings';
import { PlayerGlobalSettings } from '../../../player/player_module/player-global-settings';
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
     * @param pGlobalSettings - Global player settings.
     */
    public process(pChannelSettings: PlayerChannelSettings, pGlobalSettings: PlayerGlobalSettings, pTickChanged: boolean): void {
        // Delay sample position as long as current tick is lower than specified one.
        if (pTickChanged && pGlobalSettings.cursor.tickIndex < this.effectData.ticks) {
            pChannelSettings.sampleData.position = 0;
        }
    }
}