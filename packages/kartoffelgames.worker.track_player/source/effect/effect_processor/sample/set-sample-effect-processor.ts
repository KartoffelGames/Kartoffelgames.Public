import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { Sample } from '../../../generic_module/sample/sample.ts';
import { SetSampleEffect } from '../../effect_definition/sample/set-sample-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

export class SetSampleEffectProcessor extends BaseEffectProcessor<SetSampleEffect>{
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
        const lSample: Sample = this.globalSettings.module.samples.getSample(this.effectData.sampleIndex);

        // Reset volume and finetune. Set sample.
        this.channelSettings.finetune = lSample.fineTune;
        this.channelSettings.setSample(lSample);
        this.channelSettings.volume = lSample.volume;
        this.channelSettings.invertLoop = false;
    }
}