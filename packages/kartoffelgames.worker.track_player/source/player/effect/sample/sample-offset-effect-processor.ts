import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SampleOffsetEffect } from '../../../generic_module/effect/sample/sample-offset-effect';
import { ChannelSettings } from '../../player-channel';
import { BaseEffectProcessor } from '../base-effect-processor';

export class SampleOffsetEffectProcessor extends BaseEffectProcessor<SampleOffsetEffect>{
    /**
     * Get effect processor bound.
     */
    public get effectBound(): EffectBound {
        return EffectBound.Single;
    }

    /**
     * Get effect processor priority.
     */
    public get priority(): EffectPriority {
        return EffectPriority.Low;
    }

    /**
     * Process effect.
     * @param pChannelSettings - Executing channel settings.
     */
    public process(pChannelSettings: ChannelSettings): ChannelSettings {
        pChannelSettings.sampleData.position = this.effectData.offset;
        return pChannelSettings;
    }
}