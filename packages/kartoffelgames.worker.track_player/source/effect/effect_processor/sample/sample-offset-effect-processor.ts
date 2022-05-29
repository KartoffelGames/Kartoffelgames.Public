import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SampleOffsetEffect } from '../../effect_definition/sample/sample-offset-effect';
import { PlayerChannelSettings } from '../../../player/player-channel-settings';
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
    public process(pChannelSettings: PlayerChannelSettings): void {
        pChannelSettings.sampleData.position = this.effectData.offset;
    }
}