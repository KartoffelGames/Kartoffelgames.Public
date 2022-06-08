import { EffectPriority } from '../../../enum/effect-priority.enum';
import { DelaySampleEffect } from '../../effect_definition/sample/delay-sample-effect';
import { BaseEffectProcessor } from '../base-effect-processor';

export class DelaySampleEffectProcessor extends BaseEffectProcessor<DelaySampleEffect>{
    /**
     * Get effect processor priority.
     */
    public get priority(): EffectPriority {
        return EffectPriority.Low;
    }

    /**
     * Process effect.
     * @param pTickChanged - If tick changed.
     */
    public override onProcess(pTickChanged: boolean): void {
        // Delay sample position as long as current tick is lower than specified one.
        if (pTickChanged && this.globalSettings.cursor.tickCursor < this.effectData.ticks) {
            this.channelSettings.setSamplePosition(0);
        }
    }
}