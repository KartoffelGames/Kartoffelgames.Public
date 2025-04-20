import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { SetVolumeEffect } from '../../effect_definition/volume/set-volume-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

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