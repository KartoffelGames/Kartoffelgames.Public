import { Direction } from '../../../enum/direction.enum';
import { EffectBound } from '../../../enum/effect-bound';
import { EffectPriority } from '../../../enum/effect-priority';
import { SetVolumeEffect } from '../../../generic_module/effect/volume/set-volume-effect';
import { ChannelSettings } from '../../player-channel';
import { PlayerModule } from '../../player_module/player-module';
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
    public process(pChannelSettings: ChannelSettings): ChannelSettings {
        // Set volume.
        pChannelSettings.volume = this.effectData.volume;

        // Apply [0..1] min/max boundary.
        pChannelSettings.volume = Math.max(Math.min(pChannelSettings.volume, 1), 0);

        return pChannelSettings;
    }
}