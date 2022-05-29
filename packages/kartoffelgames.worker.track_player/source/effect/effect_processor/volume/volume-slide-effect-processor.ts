import { Direction } from '../../../enum/direction.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { VolumeSlideEffect } from '../../effect_definition/volume/volume-slide-effect';
import { BaseEffectProcessor } from '../base-effect-processor';

export class VolumeSlideEffectProcessor extends BaseEffectProcessor<VolumeSlideEffect>{
    /**
     * Get effect processor priority.
     */
    public get priority(): EffectPriority {
        return EffectPriority.Low;
    }

    /**
     * Process effect.
     */
    public override onProcess(): void {
        // Calculate volume change per sample.
        const lVolumeChange: number = this.effectData.volumeChangePerTick / this.globalSettings.length.samples;

        // Move in right direction.
        if (this.effectData.direction === Direction.Down) {
            this.channelSettings.volume -= lVolumeChange;
        } else {
            this.channelSettings.volume += lVolumeChange;
        }

        // Apply [0..1] min/max boundary.
        this.channelSettings.volume = Math.max(Math.min(this.channelSettings.volume, 1), 0);
    }
}