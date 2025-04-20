import { IGenericEffect } from '../../effect/effect_definition/i-generic-effect.ts';
import { SetFinetuneEffect } from '../../effect/effect_definition/pitch/set-finetune-effect.ts';
import { SetPitchEffect } from '../../effect/effect_definition/pitch/set-pitch-effect.ts';
import { CutSampleEffect } from '../../effect/effect_definition/sample/cut-sample-effect.ts';
import { DelaySampleEffect } from '../../effect/effect_definition/sample/delay-sample-effect.ts';
import { InvertSampleLoopEffect } from '../../effect/effect_definition/sample/invert-sample-loop-effect.ts';
import { RetriggerSampleEffect } from '../../effect/effect_definition/sample/retrigger-sample-effect.ts';
import { SampleOffsetEffect } from '../../effect/effect_definition/sample/sample-offset-effect.ts';
import { SetPanningEffect } from '../../effect/effect_definition/sample/set-panning-effect.ts';
import { SetSampleEffect } from '../../effect/effect_definition/sample/set-sample-effect.ts';
import { SetBeatsPerMinuteEffect } from '../../effect/effect_definition/speed/set-bpm-effect.ts';
import { SetSpeedEffect } from '../../effect/effect_definition/speed/set-speed-effect.ts';
import { SetVolumeEffect } from '../../effect/effect_definition/volume/set-volume-effect.ts';
import { VolumeSlideEffect } from '../../effect/effect_definition/volume/volume-slide-effect.ts';
import { Direction } from '../../enum/direction.enum.ts';
import { Pitch } from '../../enum/pitch.enum.ts';
import { EffectParser } from '../effect-parser.ts';
import { EffectParseEvent } from '../effect-parse-event.ts';
import { ArpeggioEffect } from '../../effect/effect_definition/pitch/arpeggio-effect.ts';
import { PeriodSlideEffect } from '../../effect/effect_definition/pitch/period-slide-effect.ts';
import { WaveformEffect } from '../../effect/effect_definition/waveform/waveform-effect.ts';
import { WaveformTarget } from '../../enum/waveform-target.enum.ts';
import { PositionJumpEffect } from '../../effect/effect_definition/jump/position-jump-effect.ts';

export class ModEffectParser extends EffectParser {
    private static readonly PITCH_TABLE: { [SourcePitch: number]: number; } = {
        0: Pitch.Empty,

        // Octave 0
        1712: Pitch.Octave0C,
        1616: Pitch.Octave0Csharp,
        1525: Pitch.Octave0D,
        1440: Pitch.Octave0Dsharp,
        1357: Pitch.Octave0E,
        1281: Pitch.Octave0F,
        1209: Pitch.Octave0Fsharp,
        1141: Pitch.Octave0G,
        1077: Pitch.Octave0Gsharp,
        1017: Pitch.Octave0A,
        961: Pitch.Octave0Asharp,
        907: Pitch.Octave0B,

        // Octave 1
        856: Pitch.Octave1C,
        808: Pitch.Octave1Csharp,
        762: Pitch.Octave1D,
        720: Pitch.Octave1Dsharp,
        678: Pitch.Octave1E,
        640: Pitch.Octave1F,
        604: Pitch.Octave1Fsharp,
        570: Pitch.Octave1G,
        538: Pitch.Octave1Gsharp,
        508: Pitch.Octave1A,
        480: Pitch.Octave1Asharp,
        453: Pitch.Octave1B,

        // Octave 2
        428: Pitch.Octave2C,
        404: Pitch.Octave2Csharp,
        381: Pitch.Octave2D,
        360: Pitch.Octave2Dsharp,
        339: Pitch.Octave2E,
        320: Pitch.Octave2F,
        302: Pitch.Octave2Fsharp,
        285: Pitch.Octave2G,
        269: Pitch.Octave2Gsharp,
        254: Pitch.Octave2A,
        240: Pitch.Octave2Asharp,
        226: Pitch.Octave2B,

        // Octave 3
        214: Pitch.Octave3C,
        202: Pitch.Octave3Csharp,
        190: Pitch.Octave3D,
        180: Pitch.Octave3Dsharp,
        170: Pitch.Octave3E,
        160: Pitch.Octave3F,
        151: Pitch.Octave3Fsharp,
        143: Pitch.Octave3G,
        135: Pitch.Octave3Gsharp,
        127: Pitch.Octave3A,
        120: Pitch.Octave3Asharp,
        113: Pitch.Octave3B,

        // Octave 4
        107: Pitch.Octave4C,
        101: Pitch.Octave4Csharp,
        95: Pitch.Octave4D,
        90: Pitch.Octave4Dsharp,
        85: Pitch.Octave4E,
        80: Pitch.Octave4F,
        76: Pitch.Octave4Fsharp,
        71: Pitch.Octave4G,
        67: Pitch.Octave4Gsharp,
        64: Pitch.Octave4A,
        60: Pitch.Octave4Asharp,
        57: Pitch.Octave4B
    };

    /**
     * Constructor.
     */
    public constructor() {
        super();

        // Pitch handler.
        this.addPitchHandler((pEvent: EffectParseEvent): Array<IGenericEffect> => {
            const lEffectList: Array<IGenericEffect> = new Array<IGenericEffect>();
            const lPitch: Pitch = ModEffectParser.PITCH_TABLE[pEvent.data.pitch];

            // Only add pitch when pitch is set.
            if (pEvent.data.pitch !== Pitch.Empty) {
                const lPitchEffect: SetPitchEffect = new SetPitchEffect();
                lPitchEffect.pitch = lPitch;
                lEffectList.push(lPitchEffect);
            }

            return lEffectList;
        });

        // Sample handler.
        this.addSampleHandler((pEvent: EffectParseEvent): Array<IGenericEffect> => {
            const lEffectList: Array<IGenericEffect> = new Array<IGenericEffect>();

            // Only add sample when sample is set.
            if (pEvent.data.sample > 0) {
                const lSampleEffect: SetSampleEffect = new SetSampleEffect();
                lSampleEffect.sampleIndex = pEvent.data.sample - 1; // Number to index.
                lEffectList.push(lSampleEffect);

                // Calculate channel panning based on channel index.
                // L] [R R L L] [R R... => Period length is 4. Index 0 interpreted as last index of period (3).
                const lIsLeftChannel: boolean = ((pEvent.data.channelIndex + 3) % 4) > 1; // Range from 0...3

                // Add panning effect base on channel index.
                const lPanningEffect: SetPanningEffect = new SetPanningEffect();
                lPanningEffect.panning = lIsLeftChannel ? -1 : 1;
                lEffectList.push(lPanningEffect);
            }

            return lEffectList;
        });

        // 0x0 => Arpeggio Effect.
        this.addEffectHandler('0000.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            // Exit on empty effect. Prevents unnecessary effect creation on empty effects.
            if (pEvent.data.parameter.first === 0 && pEvent.data.parameter.second === 0) {
                return [];
            }

            const lArpeggioEffect: ArpeggioEffect = new ArpeggioEffect();

            // Add notes for arpeggio
            lArpeggioEffect.addNote(pEvent.data.pitch);
            lArpeggioEffect.addNote(pEvent.data.pitch * Math.pow(Math.pow(2, 1 / 12), pEvent.data.parameter.first));
            lArpeggioEffect.addNote(pEvent.data.pitch * Math.pow(Math.pow(2, 1 / 12), pEvent.data.parameter.second));
            lArpeggioEffect.addNote(pEvent.data.pitch);

            return [lArpeggioEffect];
        });

        // 0x1 => Period Slide Up
        this.addEffectHandler('0001.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            const lPeriodSlideEffect: PeriodSlideEffect = new PeriodSlideEffect();
            lPeriodSlideEffect.direction = Direction.Up;
            lPeriodSlideEffect.noteBoundary = Pitch.Octave3B;
            lPeriodSlideEffect.periodSlidePerTick = pEvent.data.parameter.first * 16 + pEvent.data.parameter.second;

            return [lPeriodSlideEffect];
        });

        // 0x2 => Period Slide Down
        this.addEffectHandler('0010.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            const lPeriodSlideEffect: PeriodSlideEffect = new PeriodSlideEffect();
            lPeriodSlideEffect.direction = Direction.Down;
            lPeriodSlideEffect.noteBoundary = Pitch.Octave1C;
            lPeriodSlideEffect.periodSlidePerTick = pEvent.data.parameter.first * 16 + pEvent.data.parameter.second;

            return [lPeriodSlideEffect];
        });

        // 0x3 => Slide to note
        this.addEffectHandler('0011.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            const lPeriodSlideEffect: PeriodSlideEffect = new PeriodSlideEffect();

            // Load last slide when not parameter is applied.
            if (pEvent.data.parameter.first !== 0 || pEvent.data.parameter.second !== 0) {
                // Load last pitch. Use C2 when not last pitch was set.
                const lLastPitch: Pitch = pEvent.history.last(SetPitchEffect)?.pitch ?? Pitch.Octave2C;

                // Set pitch depending on last pitch.
                lPeriodSlideEffect.direction = (lLastPitch < pEvent.data.pitch) ? Direction.Down : Direction.Up;
                lPeriodSlideEffect.noteBoundary = pEvent.data.pitch;
                lPeriodSlideEffect.periodSlidePerTick = pEvent.data.parameter.first * 16 + pEvent.data.parameter.second;
            } else {
                // Load last used period slide effect.
                const lLastPeriodSlide: PeriodSlideEffect | undefined = pEvent.history.last(PeriodSlideEffect);
                const lLastEffectPitchBoundary: Pitch = lLastPeriodSlide?.noteBoundary ?? Pitch.Octave2C;
                const lLastEffectSlide: number = lLastPeriodSlide?.periodSlidePerTick ?? 0;

                // Load last pitch. Use C2 when not last pitch was set.
                const lLastPitch: Pitch = pEvent.history.last(SetPitchEffect)?.pitch ?? Pitch.Octave2C;

                // Set pitch depending on last pitch.
                lPeriodSlideEffect.direction = (lLastPitch < lLastEffectPitchBoundary) ? Direction.Down : Direction.Up;
                lPeriodSlideEffect.noteBoundary = lLastEffectPitchBoundary;
                lPeriodSlideEffect.periodSlidePerTick = lLastEffectSlide;
            }

            // Ignore period.
            pEvent.preventPitch();

            return [lPeriodSlideEffect];
        });

        // 0x4 => Vibrato
        this.addEffectHandler('0100.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            // Load current pitch. Use C2 when not last pitch was set.
            const lLastPitch: Pitch = pEvent.data.pitch || (pEvent.history.last(SetPitchEffect)?.pitch ?? Pitch.Octave2C);

            const lVibratoEffect: WaveformEffect = new WaveformEffect();

            // Load old vibrato effect when one of the parameter is zero. 
            if (pEvent.data.parameter.first !== 0 && pEvent.data.parameter.second !== 0) {
                lVibratoEffect.target = WaveformTarget.Vibrato;
                lVibratoEffect.circlePerTick = pEvent.data.parameter.first / 64;

                // Amplitude y/16 Semitones.
                lVibratoEffect.amplitude = lLastPitch * Math.pow(Math.pow(2, 1 / 12), pEvent.data.parameter.second / 16);
            } else {
                // Load last vibrato effect.
                const lLastVibratoEffect: WaveformEffect | undefined = pEvent.history.last(WaveformEffect);

                // Apply last effect values.
                lVibratoEffect.amplitude = lLastVibratoEffect?.amplitude ?? 0;
                lVibratoEffect.circlePerTick = lLastVibratoEffect?.amplitude ?? 1;
                lVibratoEffect.target = WaveformTarget.Vibrato;
            }

            return [lVibratoEffect];
        });

        // 0x5 => Continue 'Slide to note', but also do Volume slide
        this.addEffectHandler('0101.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            const lVolumeSlideEffect: VolumeSlideEffect = new VolumeSlideEffect();

            // Set direction based on set parameter.
            if (pEvent.data.parameter.first !== 0) {
                lVolumeSlideEffect.direction == Direction.Up;
                lVolumeSlideEffect.volumeChangePerTick = pEvent.data.parameter.first;
            } else {
                lVolumeSlideEffect.direction == Direction.Up;
                lVolumeSlideEffect.volumeChangePerTick = pEvent.data.parameter.second;
            }

            const lPeriodSlideEffect: PeriodSlideEffect = new PeriodSlideEffect();

            // Load last used period slide effect.
            const lLastPeriodSlide: PeriodSlideEffect | undefined = pEvent.history.last(PeriodSlideEffect);
            const lLastEffectPitchBoundary: Pitch = lLastPeriodSlide?.noteBoundary ?? Pitch.Octave2C;
            const lLastEffectSlide: number = lLastPeriodSlide?.periodSlidePerTick ?? 0;

            // Load last pitch. Use C2 when not last pitch was set.
            const lLastPitch: Pitch = pEvent.history.last(SetPitchEffect)?.pitch ?? Pitch.Octave2C;

            // Set pitch depending on last pitch.
            lPeriodSlideEffect.direction = (lLastPitch < lLastEffectPitchBoundary) ? Direction.Down : Direction.Up;
            lPeriodSlideEffect.noteBoundary = lLastEffectPitchBoundary;
            lPeriodSlideEffect.periodSlidePerTick = lLastEffectSlide;

            return [lVolumeSlideEffect, lPeriodSlideEffect];
        });

        // 0x6 => Continue 'Vibrato', but also do Volume slide
        this.addEffectHandler('0110.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            const lVolumeSlideEffect: VolumeSlideEffect = new VolumeSlideEffect();

            // Set direction based on set parameter.
            if (pEvent.data.parameter.first !== 0) {
                lVolumeSlideEffect.direction == Direction.Up;
                lVolumeSlideEffect.volumeChangePerTick = pEvent.data.parameter.first;
            } else {
                lVolumeSlideEffect.direction == Direction.Up;
                lVolumeSlideEffect.volumeChangePerTick = pEvent.data.parameter.second;
            }

            const lVibratoEffect: WaveformEffect = new WaveformEffect();

            // Load last vibrato effect.
            const lLastVibratoEffect: WaveformEffect | undefined = pEvent.history.last(WaveformEffect);

            // Apply last effect values.
            lVibratoEffect.amplitude = lLastVibratoEffect?.amplitude ?? 0;
            lVibratoEffect.circlePerTick = lLastVibratoEffect?.amplitude ?? 1;
            lVibratoEffect.target = WaveformTarget.Vibrato;

            return [lVolumeSlideEffect, lVibratoEffect];
        });

        // 0x7 => Tremolo
        this.addEffectHandler('0111.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            const lTremoloEffect: WaveformEffect = new WaveformEffect();

            // Load old vibrato effect when one of the parameter is zero. 
            if (pEvent.data.parameter.first !== 0 && pEvent.data.parameter.second !== 0) {
                lTremoloEffect.target = WaveformTarget.Tremolo;
                lTremoloEffect.circlePerTick = pEvent.data.parameter.first / 64;

                // Amplitude y/16 Semitones.
                lTremoloEffect.amplitude = pEvent.data.parameter.second;
            } else {
                // Load last vibrato effect.
                const lLastTremoloEffect: WaveformEffect | undefined = pEvent.history.last(WaveformEffect);

                // Apply last effect values.
                lTremoloEffect.amplitude = lLastTremoloEffect?.amplitude ?? 0;
                lTremoloEffect.circlePerTick = lLastTremoloEffect?.amplitude ?? 1;
                lTremoloEffect.target = WaveformTarget.Tremolo;
            }

            return [lTremoloEffect];
        });

        // 0x8 => Set panning position
        this.addEffectHandler('1000.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            const lSetPanningEffect: SetPanningEffect = new SetPanningEffect();
            // Panning ranges from 0 to 128. Convert to -1...1 range.
            lSetPanningEffect.panning = ((pEvent.data.parameter.first * 16 + pEvent.data.parameter.second) - 64) / 64;

            return [lSetPanningEffect];
        });

        // 0x9 => Set sample offset
        this.addEffectHandler('1001.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            const lSampleOffsetEffect: SampleOffsetEffect = new SampleOffsetEffect();
            lSampleOffsetEffect.offset = pEvent.data.parameter.first * 4096 + pEvent.data.parameter.second * 256;
            return [lSampleOffsetEffect];
        });

        // 0xA => Volume slide
        this.addEffectHandler('1010.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            // Ignore YParameter when XParameter is set. Convert 0..64 to 0..1 range. 
            const lVolumeSlideEffect: VolumeSlideEffect = new VolumeSlideEffect();
            lVolumeSlideEffect.direction = (pEvent.data.parameter.first > 0) ? Direction.Up : Direction.Down;
            lVolumeSlideEffect.volumeChangePerTick = ((pEvent.data.parameter.first > 0) ? pEvent.data.parameter.first : pEvent.data.parameter.second) / 64;
            return [lVolumeSlideEffect];
        });

        // 0xB => Position Jump
        this.addEffectHandler('1011.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            const lJumpEffect: PositionJumpEffect = new PositionJumpEffect();
            lJumpEffect.divisionIndex = 0;
            lJumpEffect.songPosition = pEvent.data.parameter.first * 16 + pEvent.data.parameter.second;

            return [lJumpEffect];
        });

        // 0xC => Set volume
        this.addEffectHandler('1100.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            // Ignore YParameter when XParameter is set. Convert 0..64 to 0..1 range. 
            const lVolumeSetEffect: SetVolumeEffect = new SetVolumeEffect();
            lVolumeSetEffect.volume = (pEvent.data.parameter.first * 16 + pEvent.data.parameter.second) / 64;
            return [lVolumeSetEffect];
        });

        // 0xD => Pattern Break
        this.addEffectHandler('1101.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            const lJumpEffect: PositionJumpEffect = new PositionJumpEffect();
            lJumpEffect.divisionIndex = pEvent.data.parameter.first * 10 + pEvent.data.parameter.second;
            lJumpEffect.songPosition = 1;
            lJumpEffect.songPositionShiftMode = true;

            return [lJumpEffect];
        });

        // 0xE
        {
            // 0x0 => Set filter on/off. UNUSED.
            //this.addEffectHandler('1110.0000.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => { /* UNUSED */ });

            // 0x1
            //this.addEffectHandler('1110.0001.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => { return []; /* TODO: */ });

            // 0x2
            //this.addEffectHandler('1110.0010.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => { return []; /* TODO: */ });

            // 0x3
            //this.addEffectHandler('1110.0011.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => { return []; /* TODO: */ });

            // 0x4
            //this.addEffectHandler('1110.0100.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => { return []; /* TODO: */ });

            // 0x5
            this.addEffectHandler('1110.0101.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
                const lSetFinetuneEffect: SetFinetuneEffect = new SetFinetuneEffect();
                lSetFinetuneEffect.finetune = pEvent.data.parameter.second;
                return [lSetFinetuneEffect];
            });

            // 0x6
            //this.addEffectHandler('1110.0110.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => { return []; /* TODO: */ });

            // 0x7
            //this.addEffectHandler('1110.0111.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => { return []; /* TODO: */ });

            // 0x8
            //this.addEffectHandler('1110.1000.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => { return []; /* TODO: */ });

            // 0x9
            this.addEffectHandler('1110.1001.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
                const lEffectList: Array<IGenericEffect> = new Array<IGenericEffect>();

                // Set effect only when the interval parameter is set.
                if (pEvent.data.parameter.second > 0) {
                    const lRetriggerSampleEffect: RetriggerSampleEffect = new RetriggerSampleEffect();
                    lRetriggerSampleEffect.tickInterval = pEvent.data.parameter.second;
                    lEffectList.push(lRetriggerSampleEffect);
                }

                return lEffectList;
            });

            // 0xA
            //this.addEffectHandler('1110.1010.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => { return []; /* TODO: */ });

            // 0xB
            //this.addEffectHandler('1110.1011.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => { return []; /* TODO: */ });

            // 0xC
            this.addEffectHandler('1110.1100.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
                const lCutSampleEffect: CutSampleEffect = new CutSampleEffect();
                lCutSampleEffect.ticks = pEvent.data.parameter.second;
                return [lCutSampleEffect];
            });

            // 0xD
            this.addEffectHandler('1110.1101.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
                const lDelaySampleEffect: DelaySampleEffect = new DelaySampleEffect();
                lDelaySampleEffect.ticks = pEvent.data.parameter.second;
                return [lDelaySampleEffect];
            });

            // 0xE
            //this.addEffectHandler('1110.1110.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => { return []; /* TODO: */ });

            // 0xF
            this.addEffectHandler('1110.1111.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
                const lInvertLoopEffect: InvertSampleLoopEffect = new InvertSampleLoopEffect();
                lInvertLoopEffect.invert = pEvent.data.parameter.second > 0;
                return [lInvertLoopEffect];
            });
        }

        // 0xF
        this.addEffectHandler('1111.xxxx.yyyy', (pEvent: EffectParseEvent): Array<IGenericEffect> => {
            const lEffectList: Array<IGenericEffect> = new Array<IGenericEffect>();

            // Calculate speed change. Speed can not be lower than 1.
            let lSpeed: number = pEvent.data.parameter.first * 16 + pEvent.data.parameter.second;
            lSpeed = Math.max(lSpeed, 1);

            // Different effect for different speed value.
            if (lSpeed <= 32) {
                const lSetSpeedEffect: SetSpeedEffect = new SetSpeedEffect();
                lSetSpeedEffect.speed = lSpeed;
                lEffectList.push(lSetSpeedEffect);
            } else {
                const lSetBeatsPerMinuteEffect: SetBeatsPerMinuteEffect = new SetBeatsPerMinuteEffect();
                lSetBeatsPerMinuteEffect.beatsPerMinute = lSpeed;
                lEffectList.push(lSetBeatsPerMinuteEffect);
            }

            return lEffectList;
        });
    }
}