import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SetBeatsPerMinuteEffect } from '../../effect_definition/speed/set-bpm-effect';
import { BaseEffectProcessor } from '../base-effect-processor';

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
        // Set speed, keep beats per minute.
        const lCurrentSpeedUp: number = this.globalSettings.speed.speed.speedUp;
        this.globalSettings.speed.setSpeed(this.effectData.beatsPerMinute, lCurrentSpeedUp);
    }
}