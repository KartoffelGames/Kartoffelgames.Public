import { Direction } from '../../../enum/direction.enum';
import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { VolumeSlideEffect } from '../../effect_definition/volume/volume-slide-effect';
import { PlayerChannelSettings } from '../../../player/player-channel-settings';
import { PlayerGlobalSettings } from '../../../player/player_module/player-global-settings';
import { BaseEffectProcessor } from '../base-effect-processor';

export class VolumeSlideEffectProcessor extends BaseEffectProcessor<VolumeSlideEffect>{
    /**
     * Get effect processor bound.
     */
    public get effectBound(): EffectBound {
        return EffectBound.Division;
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
     * @param pGlobalSettings - Global player settings.
     */
    public process(pChannelSettings: PlayerChannelSettings, pGlobalSettings: PlayerGlobalSettings): void {
        // Calculate volume change per sample.
        const lVolumeChange: number = this.effectData.volumeChangePerTick / pGlobalSettings.length.samples;

        // Move in right direction.
        if (this.effectData.direction === Direction.Down) {
            pChannelSettings.volume -= lVolumeChange;
        } else {
            pChannelSettings.volume += lVolumeChange;
        }

        // Apply [0..1] min/max boundary.
        pChannelSettings.volume = Math.max(Math.min(pChannelSettings.volume, 1), 0);
    }
}