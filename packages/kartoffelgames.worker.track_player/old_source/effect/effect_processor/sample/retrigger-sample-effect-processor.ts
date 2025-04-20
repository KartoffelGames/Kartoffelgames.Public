import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { RetriggerSampleEffect } from '../../effect_definition/sample/retrigger-sample-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

export class RetriggerSampleEffectProcessor extends BaseEffectProcessor<RetriggerSampleEffect>{
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
     * @param pTickChanged - If tick changed.
     */
    public override onProcess(pTickChanged: boolean): void {
        // Retrigger sample position when tick reaches a retigger tick.
        if (pTickChanged && (this.globalSettings.cursor.tickCursor % this.effectData.tickInterval) === 0) {
            this.channelSettings.setSamplePosition(0);
        }
    }
}