import { EffectPriority } from '../../../enum/effect-priority.enum';
import { SetVolumeEffect } from '../../effect_definition/volume/set-volume-effect';
import { BaseEffectProcessor } from '../base-effect-processor';

export class SetVolumeEffectProcessor extends BaseEffectProcessor<SetVolumeEffect>{
    /**
     * Get effect processor priority.
     */
    public get priority(): EffectPriority {
        return EffectPriority.Low;
    }

    /**
     * On process start.
     */
    public override onEffectStart(): void {
        // Set volume.
        this.channelSettings.volume = this.effectData.volume;

        // Apply [0..1] min/max boundary.
        this.channelSettings.volume = Math.max(Math.min(this.channelSettings.volume, 1), 0);
    }

}