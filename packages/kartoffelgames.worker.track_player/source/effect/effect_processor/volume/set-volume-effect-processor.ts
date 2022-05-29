import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SetVolumeEffect } from '../../effect_definition/volume/set-volume-effect';
import { PlayerChannelSettings } from '../../../player/player-channel-settings';
import { BaseEffectProcessor } from '../base-effect-processor';

export class SetVolumeEffectProcessor extends BaseEffectProcessor<SetVolumeEffect>{
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
        // Set volume.
        pChannelSettings.volume = this.effectData.volume;

        // Apply [0..1] min/max boundary.
        pChannelSettings.volume = Math.max(Math.min(pChannelSettings.volume, 1), 0);
    }
}