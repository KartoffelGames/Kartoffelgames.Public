import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { CutSampleEffect } from '../../../generic_module/effect/sample/cut-sample-effect';
import { ChannelSettings } from '../../player-channel';
import { PlayerModule } from '../../player_module/player-module';
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
     */
    public process(pChannelSettings: ChannelSettings, pPlayerModule: PlayerModule, pTickChanged: boolean): ChannelSettings {
        // Set volume to 0 on new tick and when tick index reaches tick where the sample should be cut.  
        if (pTickChanged && pPlayerModule.cursor.tickIndex === this.effectData.ticks) {
            pChannelSettings.volume = 0;
        }

        return pChannelSettings;
    }
}