import { EffectBound } from '../../../enum/effect-bound.enum';
import { EffectPriority } from '../../../enum/effect-priority.enum';
import { ArpeggioEffect } from '../../../generic_module/effect/pitch/arpeggio-effect';
import { ChannelSettings } from '../../player-channel';
import { PlayerModule } from '../../player_module/player-module';
import { BaseEffectProcessor } from '../base-effect-processor';

export class ArpeggioEffectProcessor extends BaseEffectProcessor<ArpeggioEffect>{
    private mSampleCounter: number;

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
     * Constructor.
     * @param pEffect - Effect data.
     */
    public constructor(pEffect: ArpeggioEffect) {
        super(pEffect);
        this.mSampleCounter = 0;
    }

    /**
     * Process effect.
     * @param pChannelSettings - Executing channel settings.
     * @param pPlayerModule - Global player module.
     */
    public process(pChannelSettings: ChannelSettings, pPlayerModule: PlayerModule): ChannelSettings {
        // Calculate count of samples in this division.
        const lSampleCount: number = pPlayerModule.length.samples * pPlayerModule.length.ticks;

        // Calculate current arpeggio pitch by dividing sample count into equal parts.
        const lCurrentPitchIndex: number = Math.floor(this.mSampleCounter / (lSampleCount / this.effectData.notes.length));

        // Set channel pitch.
        pChannelSettings.pitch = this.effectData.notes[lCurrentPitchIndex];

        // Count elapsed samples.
        this.mSampleCounter++;

        return pChannelSettings;
    }
}