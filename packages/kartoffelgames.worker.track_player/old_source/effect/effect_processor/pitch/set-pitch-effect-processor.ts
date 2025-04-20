import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { SetPitchEffect } from '../../effect_definition/pitch/set-pitch-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

export class SetPitchEffectProcessor extends BaseEffectProcessor<SetPitchEffect>{
    /**
     * Get effect processor priority.
     */
    public get priority(): EffectPriority {
        return EffectPriority.High;
    }

    /**
     * On process start.
     */
    public override onEffectStart(): void {
        // Reset sample position. Set pitch.
        this.channelSettings.pitch = this.effectData.pitch;
        this.channelSettings.setSamplePosition(0);
    }
}