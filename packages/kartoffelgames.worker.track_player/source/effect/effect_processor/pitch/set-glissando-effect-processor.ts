import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { SetGlissandoEffect } from '../../effect_definition/pitch/set-glissando-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

export class SetGlissandoEffectProcessor extends BaseEffectProcessor<SetGlissandoEffect>{
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
        // Set global glissando state.
        this.globalSettings.delay.glissandoEnabled = this.effectData.enabled;
    }
}