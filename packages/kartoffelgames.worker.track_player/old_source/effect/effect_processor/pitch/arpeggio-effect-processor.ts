import { EffectPriority } from '../../../enum/effect-priority.enum.ts';
import { PlayerChannelSettings } from '../../../player/player-channel-settings.ts';
import { PlayerGlobalSettings } from '../../../player/global_settings/player-global-settings.ts';
import { ArpeggioEffect } from '../../effect_definition/pitch/arpeggio-effect.ts';
import { BaseEffectProcessor } from '../base-effect-processor.ts';

export class ArpeggioEffectProcessor extends BaseEffectProcessor<ArpeggioEffect>{
    private mSampleCounter: number;

    /**
     * Get effect processor priority.
     */
    public get priority(): EffectPriority {
        return EffectPriority.Low;
    }

    /**
     * Constructor.
     * @param pEffect - Effect data.
     * @param pChannelSettings - Current channels settings.
     * @param pGlobalSettings - Global player module.
     */
    public constructor(pEffect: ArpeggioEffect, pChannelSettings: PlayerChannelSettings, pGlobalSettings: PlayerGlobalSettings) {
        super(pEffect, pChannelSettings, pGlobalSettings);
        this.mSampleCounter = 0;
    }

    /**
     * Process effect.
     */
    public override onProcess(): void {
        // Calculate count of samples in this division.
        const lSampleCount: number = this.globalSettings.length.samples * this.globalSettings.length.ticks;

        // Calculate current arpeggio pitch by dividing sample count into equal parts.
        const lCurrentPitchIndex: number = Math.floor(this.mSampleCounter / (lSampleCount / this.effectData.notes.length));

        // Set channel pitch.
        this.channelSettings.pitch = this.effectData.notes[lCurrentPitchIndex];

        // Count elapsed samples.
        this.mSampleCounter++;
    }
}