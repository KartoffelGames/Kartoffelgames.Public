import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { CutSampleEffect } from '../../../generic_module/effect/sample/cut-sample-effect';
import { PlayerChannelSettings } from '../../player-channel-settings';
import { PlayerGlobalSettings } from '../../player_module/player-global-settings';
import { BaseEffectProcessor } from '../base-effect-processor';

export class CutSampleEffectProcessor extends BaseEffectProcessor<CutSampleEffect>{
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
     * @param pGlobalSettings - Glbal player settings.
     * @param pTickChanged - If tick changed.
     */
    public process(pChannelSettings: PlayerChannelSettings, pGlobalSettings: PlayerGlobalSettings, pTickChanged: boolean): void {
        // Set volume to 0 on new tick and when tick index reaches tick where the sample should be cut.  
        if (pTickChanged && pGlobalSettings.cursor.tickIndex === this.effectData.ticks) {
            pChannelSettings.volume = 0;
        }
    }
}