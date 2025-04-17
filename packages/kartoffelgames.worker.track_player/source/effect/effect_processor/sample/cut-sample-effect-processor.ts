import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { CutSampleEffect } from '../../effect_definition/sample/cut-sample-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

export class CutSampleEffectProcessor extends BaseEffectProcessor<CutSampleEffect>{
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
        // Set volume to 0 on new tick and when tick index reaches tick where the sample should be cut.  
        if (pTickChanged && this.globalSettings.cursor.tickCursor === this.effectData.ticks) {
            this.channelSettings.volume = 0;
        }
    }
}