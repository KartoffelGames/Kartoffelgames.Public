import { Dictionary, List } from '@kartoffelgames/core.data';
import { EffectBound } from '../enum/effect-bound.enum';
import { Pitch } from '../enum/pitch.enum';
import { LoopEffect } from '../generic_module/effect/jump/loop-effect';
import { SetLoopPositionEffectEffect } from '../generic_module/effect/jump/set-loop-position-effect';
import { ArpeggioEffect } from '../generic_module/effect/pitch/arpeggio-effect';
import { PeriodSlideEffect } from '../generic_module/effect/pitch/period-slide-effect';
import { SetFinetuneEffect } from '../generic_module/effect/pitch/set-finetune-effect';
import { SetGlissandoEffect } from '../generic_module/effect/pitch/set-glissando-effect';
import { SetPitchEffect } from '../generic_module/effect/pitch/set-pitch-effect';
import { CutSampleEffect } from '../generic_module/effect/sample/cut-sample-effect';
import { DelaySampleEffect } from '../generic_module/effect/sample/delay-sample-effect';
import { InvertSampleLoopEffect } from '../generic_module/effect/sample/invert-sample-loop-effect';
import { RetriggerSampleEffect } from '../generic_module/effect/sample/retrigger-sample-effect';
import { SampleOffsetEffect } from '../generic_module/effect/sample/sample-offset-effect';
import { SetSampleEffect } from '../generic_module/effect/sample/set-sample-effect';
import { SetBeatsPerMinuteEffect } from '../generic_module/effect/speed/set-bpm-effect';
import { SetSpeedEffect } from '../generic_module/effect/speed/set-speed-effect';
import { SetVolumeEffect } from '../generic_module/effect/volume/set-volume-effect';
import { VolumeSlideEffect } from '../generic_module/effect/volume/volume-slide-effect';
import { SetWaveformEffect } from '../generic_module/effect/waveform/set-waveform-effect';
import { IGenericEffect } from '../generic_module/interface/i-generic-effect';
import { Sample } from '../generic_module/sample/sample';
import { BaseEffectProcessor } from './effect/base-effect-processor';
import { LoopEffectProcessor } from './effect/jump/loop-effect-processor';
import { SetLoopPositionEffectProcessor } from './effect/jump/set-loop-position-effect-processor';
import { ArpeggioEffectProcessor } from './effect/pitch/arpeggio-effect-processor';
import { PeriodSlideEffectProcessor } from './effect/pitch/period-slide-effect-effect-processor';
import { SetFinetuneEffectProcessor } from './effect/pitch/set-finetune-effect-processor';
import { SetGlissandoEffectProcessor } from './effect/pitch/set-glissando-effect-processor';
import { SetPitchEffectProcessor } from './effect/pitch/set-pitch-effect-processor';
import { CutSampleEffectProcessor } from './effect/sample/cut-sample-effect-processor';
import { DelaySampleEffectProcessor } from './effect/sample/delay-sample-effect-processor';
import { InvertSampleLoopEffectProcessor } from './effect/sample/invert-sample-loop-effect-processor';
import { RetriggerSampleEffectProcessor } from './effect/sample/retrigger-sample-effect-processor';
import { SampleOffsetEffectProcessor } from './effect/sample/sample-offset-effect-processor';
import { SetSampleEffectProcessor } from './effect/sample/set-sample-effect-processor';
import { SetBeatsPerMinuteEffectProcessor } from './effect/speed/set-bpm-effect-processor';
import { SetSpeedEffectProcessor } from './effect/speed/set-speed-effect-processor';
import { SetVolumeEffectProcessor } from './effect/volume/set-volume-effect-processor';
import { VolumeSlideEffectProcessor } from './effect/volume/volume-slide-effect-processor';
import { SetWaveformEffectProcessor } from './effect/waveform/set-waveform-effect-processor';
import { PlayerModule } from './player_module/player-module';

export class PlayerChannel {
    private static readonly EFFECT_MAP: Dictionary<IGenericEffect, EffectProcessorConstructor> = (() => {
        const lEffectToProcessor: Dictionary<IGenericEffect, EffectProcessorConstructor> = new Dictionary<IGenericEffect, EffectProcessorConstructor>();
        lEffectToProcessor.set(SetSampleEffect, SetSampleEffectProcessor);
        lEffectToProcessor.set(SetPitchEffect, SetPitchEffectProcessor);
        lEffectToProcessor.set(VolumeSlideEffect, VolumeSlideEffectProcessor);
        lEffectToProcessor.set(SetVolumeEffect, SetVolumeEffectProcessor);
        lEffectToProcessor.set(SetSpeedEffect, SetSpeedEffectProcessor);
        lEffectToProcessor.set(SetBeatsPerMinuteEffect, SetBeatsPerMinuteEffectProcessor);
        lEffectToProcessor.set(CutSampleEffect, CutSampleEffectProcessor);
        lEffectToProcessor.set(DelaySampleEffect, DelaySampleEffectProcessor);
        lEffectToProcessor.set(RetriggerSampleEffect, RetriggerSampleEffectProcessor);
        lEffectToProcessor.set(SampleOffsetEffect, SampleOffsetEffectProcessor);
        lEffectToProcessor.set(InvertSampleLoopEffect, InvertSampleLoopEffectProcessor);
        lEffectToProcessor.set(SetFinetuneEffect, SetFinetuneEffectProcessor);
        lEffectToProcessor.set(PeriodSlideEffect, PeriodSlideEffectProcessor);
        lEffectToProcessor.set(ArpeggioEffect, ArpeggioEffectProcessor);
        lEffectToProcessor.set(SetGlissandoEffect, SetGlissandoEffectProcessor);
        lEffectToProcessor.set(SetLoopPositionEffectEffect, SetLoopPositionEffectProcessor);
        lEffectToProcessor.set(LoopEffect, LoopEffectProcessor);
        lEffectToProcessor.set(SetWaveformEffect, SetWaveformEffectProcessor);

        // TODO: DelayPatternEffect
        // TODO: WaveformEffect

        return lEffectToProcessor;
    })();

    private readonly mChannelIndex: number;
    private mChannelSettings: ChannelSettings;
    private mEffectList: Array<BaseEffectProcessor<IGenericEffect>>;
    private readonly mPlayerModule: PlayerModule;

    /**
     * Constructor.
     */
    public constructor(pPlayerModule: PlayerModule, pChannelIndex: number) {
        this.mChannelIndex = pChannelIndex;
        this.mPlayerModule = pPlayerModule;

        this.mEffectList = new Array<BaseEffectProcessor<IGenericEffect>>();

        // Set empty continuing information.
        this.mChannelSettings = {
            pitch: Pitch.Empty,
            sampleData: {
                sample: null,
                position: 0
            },
            volume: 0,
            finetune: 0,
            invertLoop: false
        };
    }

    /**
     * Play next tick and get sample position value.
     */
    public nextSample(_pSongPositionChanged: boolean, pDivisionChanged: boolean, pTickChanged: boolean): number {
        if (pDivisionChanged) {
            this.onDivisionChange();
        }

        // Sort effects for priority.
        this.mEffectList.sort((pEffectA, pEffectB) => {
            // Sort priority number ASC.
            return pEffectA.priority - pEffectB.priority;
        });

        // Execute all effects in priority order.
        for (const lEffect of this.mEffectList) {
            this.mChannelSettings = lEffect.process(this.mChannelSettings, this.mPlayerModule, pTickChanged);
        }

        // Clear single bound effects after execution.
        this.clearEffectBoundEffects(EffectBound.Single);

        // Get current sample.
        const lSample: Sample | null = this.mChannelSettings.sampleData.sample;

        // Exit if no sample exists or sample finished playing.
        if (lSample === null || lSample.data.length === 0 || (this.mChannelSettings.sampleData.position + 1) > lSample.data.length) {
            return 0;
        }

        // Get next sample position value. Apply volume.
        const lNextSamplePosition = Math.floor(this.mChannelSettings.sampleData.position);
        let lSamplePositionValue: number = lSample.data[lNextSamplePosition];
        lSamplePositionValue *= this.mChannelSettings.volume;

        // Get current pitch of sample. Calculate finetune with "(12th root of two) * current pitch * finetune."
        const lPitch: number = this.mChannelSettings.pitch + ((Math.pow(2, 1 / 12) * this.mChannelSettings.pitch) * this.mChannelSettings.finetune);

        // Calculate next sample position.
        const lSampleSpeed = 7093789.2 / ((lPitch * 2) * this.mPlayerModule.speed.speed.sampleRate);
        this.mChannelSettings.sampleData.position += lSampleSpeed;

        // TODO: Invert loop. this.mChannelSettings.invertLoop

        // Check for loop information.
        if (lSample.repeatLength > 0) {
            // Check if sample cursor is after the repeat range.
            if ((this.mChannelSettings.sampleData.position + 1) > (lSample.repeatOffset + lSample.repeatLength)) {
                // Move back as long as not inside repeat length.
                this.mChannelSettings.sampleData.position = lSample.repeatOffset;
            }
        }

        return lSamplePositionValue;
    }

    /**
     * Clear effects with specified effect bound.
     * @param pEffectBound - Effect bound to clear.
     */
    private clearEffectBoundEffects(pEffectBound: EffectBound): void {
        this.mEffectList = this.mEffectList.filter((pEffect) => {
            // "Deconstruct" when effect should be deleted.
            if (pEffect.effectBound === pEffectBound) {
                pEffect.onEffectEnd();
            }

            return pEffect.effectBound !== pEffectBound;
        });
    }

    /**
     * Convert generic effects into effect processors.
     * @param pGenericEffects - Division effects for this channel.
     */
    private createEffects(pGenericEffects: Array<IGenericEffect>): List<BaseEffectProcessor<IGenericEffect>> {
        const lEffectList: List<BaseEffectProcessor<IGenericEffect>> = new List<BaseEffectProcessor<IGenericEffect>>();

        // Convert each generic effect into processable effect.
        for (const lGenericEffect of pGenericEffects) {
            // Read effect processor for generic effect.
            const lEffectProcessorConstructor: EffectProcessorConstructor | undefined = PlayerChannel.EFFECT_MAP.get(lGenericEffect.constructor);

            // Create supported effect.
            if (typeof lEffectProcessorConstructor !== 'undefined') {
                const lEffectProcessor: BaseEffectProcessor<IGenericEffect> = new lEffectProcessorConstructor(lGenericEffect);
                lEffectList.push(lEffectProcessor);
            }
        }

        return lEffectList;
    }

    /**
     * On division change.
     * Load all new division effects and clear old division bound effects. 
     */
    private onDivisionChange(): void {
        // Clear division bound effects.
        this.clearEffectBoundEffects(EffectBound.Division);

        // Add effect into effect list. Convert generic effect into effect processors. 
        const lConvertedEffect: List<BaseEffectProcessor<IGenericEffect>> = this.createEffects(this.mPlayerModule.getDivision(this.mChannelIndex).effects);
        this.mEffectList.push(...lConvertedEffect);
    }
}

interface SampleData {
    sample: Sample | null,
    position: number;
}

export interface ChannelSettings {
    pitch: Pitch,
    /**
     * Volume range form 0 to 1.
     */
    volume: number,
    finetune: number,
    invertLoop: boolean,
    sampleData: SampleData;
}

export type EffectProcessorConstructor = new (pEffect: any) => BaseEffectProcessor<IGenericEffect>;