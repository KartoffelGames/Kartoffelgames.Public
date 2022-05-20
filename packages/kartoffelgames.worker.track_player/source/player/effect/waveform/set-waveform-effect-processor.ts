import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SetWaveformEffect } from '../../../generic_module/effect/waveform/set-waveform-effect';
import { PlayerChannelSettings } from '../../player-channel-settings';
import { PlayerGlobalSettings } from '../../player_module/player-global-settings';
import { BaseEffectProcessor } from '../base-effect-processor';

export class SetWaveformEffectProcessor extends BaseEffectProcessor<SetWaveformEffect>{
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
     * @param pGlobalSettings - Global player settings.
     */
    public process(_pChannelSettings: PlayerChannelSettings, pGlobalSettings: PlayerGlobalSettings): void {
        pGlobalSettings.settings.setWaveform(this.effectData.waveform, this.effectData.target, this.effectData.retrigger);
    }
}