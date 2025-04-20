import { Dictionary, List } from '@kartoffelgames/core';
import { IGenericEffect } from '../effect/effect_definition/i-generic-effect.ts';
import { LoopEffect } from '../effect/effect_definition/jump/loop-effect.ts';
import { PositionJumpEffect } from '../effect/effect_definition/jump/position-jump-effect.ts';
import { SetLoopPositionEffectEffect } from '../effect/effect_definition/jump/set-loop-position-effect.ts';
import { DelayPatternEffect } from '../effect/effect_definition/pattern/delay-pattern-effect.ts';
import { ArpeggioEffect } from '../effect/effect_definition/pitch/arpeggio-effect.ts';
import { PeriodSlideEffect } from '../effect/effect_definition/pitch/period-slide-effect.ts';
import { SetFinetuneEffect } from '../effect/effect_definition/pitch/set-finetune-effect.ts';
import { SetGlissandoEffect } from '../effect/effect_definition/pitch/set-glissando-effect.ts';
import { SetPitchEffect } from '../effect/effect_definition/pitch/set-pitch-effect.ts';
import { CutSampleEffect } from '../effect/effect_definition/sample/cut-sample-effect.ts';
import { DelaySampleEffect } from '../effect/effect_definition/sample/delay-sample-effect.ts';
import { InvertSampleLoopEffect } from '../effect/effect_definition/sample/invert-sample-loop-effect.ts';
import { RetriggerSampleEffect } from '../effect/effect_definition/sample/retrigger-sample-effect.ts';
import { SampleOffsetEffect } from '../effect/effect_definition/sample/sample-offset-effect.ts';
import { SetPanningEffect } from '../effect/effect_definition/sample/set-panning-effect.ts';
import { SetSampleEffect } from '../effect/effect_definition/sample/set-sample-effect.ts';
import { SetBeatsPerMinuteEffect } from '../effect/effect_definition/speed/set-bpm-effect.ts';
import { SetSpeedEffect } from '../effect/effect_definition/speed/set-speed-effect.ts';
import { SetVolumeEffect } from '../effect/effect_definition/volume/set-volume-effect.ts';
import { VolumeSlideEffect } from '../effect/effect_definition/volume/volume-slide-effect.ts';
import { SetWaveformEffect } from '../effect/effect_definition/waveform/set-waveform-effect.ts';
import { WaveformEffect } from '../effect/effect_definition/waveform/waveform-effect.ts';
import { BaseEffectProcessor } from '../effect/effect_processor/base-effect-processor.ts';
import { LoopEffectProcessor } from '../effect/effect_processor/jump/loop-effect-processor.ts';
import { PositionJumpEffectProcessor } from '../effect/effect_processor/jump/position-jump-effect-processor.ts';
import { SetLoopPositionEffectProcessor } from '../effect/effect_processor/jump/set-loop-position-effect-processor.ts';
import { DelayPatternEffectProcessor } from '../effect/effect_processor/pattern/delay-pattern-effect.ts';
import { ArpeggioEffectProcessor } from '../effect/effect_processor/pitch/arpeggio-effect-processor.ts';
import { PeriodSlideEffectProcessor } from '../effect/effect_processor/pitch/period-slide-effect-effect-processor.ts';
import { SetFinetuneEffectProcessor } from '../effect/effect_processor/pitch/set-finetune-effect-processor.ts';
import { SetGlissandoEffectProcessor } from '../effect/effect_processor/pitch/set-glissando-effect-processor.ts';
import { SetPitchEffectProcessor } from '../effect/effect_processor/pitch/set-pitch-effect-processor.ts';
import { CutSampleEffectProcessor } from '../effect/effect_processor/sample/cut-sample-effect-processor.ts';
import { DelaySampleEffectProcessor } from '../effect/effect_processor/sample/delay-sample-effect-processor.ts';
import { InvertSampleLoopEffectProcessor } from '../effect/effect_processor/sample/invert-sample-loop-effect-processor.ts';
import { RetriggerSampleEffectProcessor } from '../effect/effect_processor/sample/retrigger-sample-effect-processor.ts';
import { SampleOffsetEffectProcessor } from '../effect/effect_processor/sample/sample-offset-effect-processor.ts';
import { SetPanningEffectProcessor } from '../effect/effect_processor/sample/set-panning-effect-processor.ts';
import { SetSampleEffectProcessor } from '../effect/effect_processor/sample/set-sample-effect-processor.ts';
import { SetBeatsPerMinuteEffectProcessor } from '../effect/effect_processor/speed/set-bpm-effect-processor.ts';
import { SetSpeedEffectProcessor } from '../effect/effect_processor/speed/set-speed-effect-processor.ts';
import { SetVolumeEffectProcessor } from '../effect/effect_processor/volume/set-volume-effect-processor.ts';
import { VolumeSlideEffectProcessor } from '../effect/effect_processor/volume/volume-slide-effect-processor.ts';
import { SetWaveformEffectProcessor } from '../effect/effect_processor/waveform/set-waveform-effect-processor.ts';
import { WaveformEffectProcessor } from '../effect/effect_processor/waveform/waveform-effect-processor.ts';
import { DivisionChannel } from '../generic_module/pattern/division-channel.ts';
import { Pattern } from '../generic_module/pattern/pattern.ts';
import { Sample } from '../generic_module/sample/sample.ts';
import { PlayerGlobalSettings } from './global_settings/player-global-settings.ts';
import { PlayerChannelSettings } from './player-channel-settings.ts';

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
        lEffectToProcessor.set(WaveformEffect, WaveformEffectProcessor);
        lEffectToProcessor.set(DelayPatternEffect, DelayPatternEffectProcessor);
        lEffectToProcessor.set(SetPanningEffect, SetPanningEffectProcessor);
        lEffectToProcessor.set(PositionJumpEffect, PositionJumpEffectProcessor);
        return lEffectToProcessor;
    })();

    private readonly mChannelIndex: number;
    private mChannelSettings: PlayerChannelSettings;
    private mEffectList: Array<BaseEffectProcessor<IGenericEffect>>;
    private mInsideLoop: boolean;
    private readonly mGlobalSettings: PlayerGlobalSettings;

    /**
     * Constructor.
     */
    public constructor(pPlayerModule: PlayerGlobalSettings, pChannelIndex: number) {
        this.mChannelIndex = pChannelIndex;
        this.mGlobalSettings = pPlayerModule;
        this.mInsideLoop = false;

        this.mEffectList = new Array<BaseEffectProcessor<IGenericEffect>>();

        // Set empty continuing information.
        this.mChannelSettings = new PlayerChannelSettings();
    }

    /**
     * Play next tick and get sample position value.
     * Return two values for left and right channel.
     */
    public nextAudioSample(pDivisionChanged: boolean, pTickChanged: boolean): [number, number] {
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
            lEffect.onProcess(pTickChanged);
        }

        // Get current sample.
        const lSample: Sample | null = this.mChannelSettings.sampleData.sample;

        // Reset sample loop state when position was reset.
        if (this.mChannelSettings.sampleData.position === 0) {
            this.mInsideLoop = false;
        }

        // Exit if no sample exists or sample finished playing.
        if (lSample === null || lSample.data.length === 0 || (this.mChannelSettings.sampleData.position + 1) > lSample.data.length) {
            return [0, 0];
        }

        // Get current sample position value. Apply volume.
        const lNextSamplePosition = Math.floor(this.mChannelSettings.sampleData.position);
        let lSamplePositionValue: number = lSample.data[lNextSamplePosition];
        lSamplePositionValue *= this.mChannelSettings.volume;

        // Get current pitch of sample. Calculate fine tune into pitch with: "pitch * sqrt(2, 12)^(fintune/8)"
        // When fine tune is 0, the current pitch does not change.
        // Semitone is "(12th root of two) * current pitch".
        // Fine tune changes 1/8 of an semi tone.
        const lPitch: number = this.mChannelSettings.pitch * Math.pow(Math.pow(2, 1 / 12), this.mChannelSettings.finetune / 8);

        // Calculate next sample position.
        // 7093789.2 is a magic number from old amiga ages.
        const lSampleSpeed = 7093789.2 / ((lPitch * 2) * this.mGlobalSettings.speed.sampleRate);
        this.mChannelSettings.setSamplePosition(this.mChannelSettings.sampleData.position + lSampleSpeed);

        // Check for loop information and sample cursor is after the repeat range.
        if (lSample.repeatLength > 0 && (this.mChannelSettings.sampleData.position + 1) > (lSample.repeatOffset + lSample.repeatLength)) {
            // Move back as long as not inside repeat length.
            this.mChannelSettings.setSamplePosition(lSample.repeatOffset);

            // Set loop state.
            this.mInsideLoop = true;
        }

        // Invert the "loop". Not just the loop but the none loop and siltent data too.
        let lChannelValue: number;
        if (this.mChannelSettings.invertLoop && this.mInsideLoop) {
            lChannelValue = lSamplePositionValue * -1;
        } else {
            lChannelValue = lSamplePositionValue;
        }

        // Apply panning.
        const lLeftMultiply: number = 1 - (this.mChannelSettings.panning / 2 + 0.5);
        const lRightMultiply: number = this.mChannelSettings.panning / 2 + 0.5;

        return [lChannelValue * lLeftMultiply, lChannelValue * lRightMultiply];
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
                const lEffectProcessor: BaseEffectProcessor<IGenericEffect> = new lEffectProcessorConstructor(lGenericEffect, this.mChannelSettings, this.mGlobalSettings);
                lEffectProcessor.onEffectStart();
                lEffectList.push(lEffectProcessor);
            }
        }

        return lEffectList;
    }

    /**
     * Get current playing divisions channel
     */
    private getDivision(): DivisionChannel {
        const lSongPosition: number = this.mGlobalSettings.module.pattern.songPositions[this.mGlobalSettings.cursor.songPositionCursor];
        const lPattern: Pattern = this.mGlobalSettings.module.pattern.getPattern(lSongPosition);

        return lPattern.getDivision(this.mGlobalSettings.cursor.divisionCursor).getChannel(this.mChannelIndex);
    }

    /**
     * On division change.
     * Load all new division effects and clear old division bound effects. 
     */
    private onDivisionChange(): void {
        // Clear division bound effects.
        for (const lEffect of this.mEffectList) {
            lEffect.onEffectEnd();
        }
        this.mEffectList = new Array<BaseEffectProcessor<IGenericEffect>>();

        // Add effect into effect list. Convert generic effect into effect processors. 
        const lConvertedEffect: List<BaseEffectProcessor<IGenericEffect>> = this.createEffects(this.getDivision().effects);
        this.mEffectList.push(...lConvertedEffect);
    }
}

export type EffectProcessorConstructor = new (pEffect: any, pChannelSettings: PlayerChannelSettings, pGlobalSettings: PlayerGlobalSettings) => BaseEffectProcessor<IGenericEffect>;