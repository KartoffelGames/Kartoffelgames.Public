import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SetWaveformEffect } from '../../effect_definition/waveform/set-waveform-effect';
import { BaseEffectProcessor } from '../base-effect-processor';

export class SetWaveformEffectProcessor extends BaseEffectProcessor<SetWaveformEffect>{
    /**
     * Get effect processor priority.
     */
    public get priority(): EffectPriority {
        return EffectPriority.Low;
    }

    /**
     * On process start.
     */
    public override onEffectStart(): void {
        this.globalSettings.wave.setWaveform(this.effectData.waveform, this.effectData.target, this.effectData.retrigger);
    }
}