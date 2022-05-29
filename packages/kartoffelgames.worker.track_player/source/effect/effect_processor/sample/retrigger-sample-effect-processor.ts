import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { RetriggerSampleEffect } from '../../effect_definition/sample/retrigger-sample-effect';
import { PlayerChannelSettings } from '../../../player/player-channel-settings';
import { PlayerGlobalSettings } from '../../../player/player_module/player-global-settings';
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
     * @param pGlobalSettings - Global player settings.
     * @param pTickChanged - If tick changed.
     */
    public process(pChannelSettings: PlayerChannelSettings, pGlobalSettings: PlayerGlobalSettings, pTickChanged: boolean): void {
        // Retrigger sample position when tick reaches a retigger tick.
        if (pTickChanged && (pGlobalSettings.cursor.tickIndex % this.effectData.tickInterval) === 0) {
            pChannelSettings.sampleData.position = 0;
        }
    }
}