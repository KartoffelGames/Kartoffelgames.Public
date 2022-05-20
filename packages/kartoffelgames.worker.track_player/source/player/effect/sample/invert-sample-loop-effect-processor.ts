import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { InvertSampleLoopEffect } from '../../../generic_module/effect/sample/invert-sample-loop-effect';
import { PlayerChannelSettings } from '../../player-channel-settings';
import { BaseEffectProcessor } from '../base-effect-processor';

export class InvertSampleLoopEffectProcessor extends BaseEffectProcessor<InvertSampleLoopEffect>{
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
        pChannelSettings.invertLoop = this.effectData.invert;
    }
}