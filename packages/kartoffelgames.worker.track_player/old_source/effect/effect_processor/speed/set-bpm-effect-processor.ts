import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { SetBeatsPerMinuteEffect } from '../../effect_definition/speed/set-bpm-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

export class SetBeatsPerMinuteEffectProcessor extends BaseEffectProcessor<SetBeatsPerMinuteEffect>{
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
        // Set speed.
        this.globalSettings.speed.beatsPerMinute = this.effectData.beatsPerMinute;
    }
}