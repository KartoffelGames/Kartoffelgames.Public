import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { SetPanningEffect } from '../../effect_definition/sample/set-panning-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

export class SetPanningEffectProcessor extends BaseEffectProcessor<SetPanningEffect>{
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
        // Set panning.
        this.channelSettings.panning = this.effectData.panning;
    }
}