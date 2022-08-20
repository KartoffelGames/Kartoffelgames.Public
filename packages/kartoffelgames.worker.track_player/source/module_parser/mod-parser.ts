import { Direction } from '../enum/direction.enum';
import { Pitch } from '../enum/pitch.enum';
import { SetFinetuneEffect } from '../effect/effect_definition/pitch/set-finetune-effect';
import { SetPitchEffect } from '../effect/effect_definition/pitch/set-pitch-effect';
import { CutSampleEffect } from '../effect/effect_definition/sample/cut-sample-effect';
import { DelaySampleEffect } from '../effect/effect_definition/sample/delay-sample-effect';
import { InvertSampleLoopEffect } from '../effect/effect_definition/sample/invert-sample-loop-effect';
import { RetriggerSampleEffect } from '../effect/effect_definition/sample/retrigger-sample-effect';
import { SampleOffsetEffect } from '../effect/effect_definition/sample/sample-offset-effect';
import { SetSampleEffect } from '../effect/effect_definition/sample/set-sample-effect';
import { SetBeatsPerMinuteEffect } from '../effect/effect_definition/speed/set-bpm-effect';
import { SetSpeedEffect } from '../effect/effect_definition/speed/set-speed-effect';
import { SetVolumeEffect } from '../effect/effect_definition/volume/set-volume-effect';
import { VolumeSlideEffect } from '../effect/effect_definition/volume/volume-slide-effect';
import { GenericModule } from '../generic_module/generic-module';
import { IGenericEffect } from '../effect/effect_definition/i-generic-effect';
import { Division } from '../generic_module/pattern/division';
import { DivisionChannel } from '../generic_module/pattern/division-channel';
import { Pattern } from '../generic_module/pattern/pattern';
import { Sample } from '../generic_module/sample/sample';
import { BaseParser } from './base-module-parser';
import { ByteUtil } from './helper/byte-util';

/**
 * MOD file parser.
 */
export class ModParser extends BaseParser {
    private static readonly NAME_BYTE_LENGTH: number = 20;
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
    private static readonly SAMPLE_HEADER_BYTE_LENGTH: number = 30;

    /**
     * Parse MOD file.
     */
    public parse(): GenericModule {
        const lModule: GenericModule = new GenericModule();

        // Read dynamic module values.
        const lExtensionName: ModuleExtension = this.getExtensionName();
        const lChannelCount: number = this.getChannelCount(lExtensionName);
        const lPatternCount: number = this.getPatternCount(lExtensionName);

        // Decode module parts.
        this.parseName(lModule);
        this.parseSample(lModule, lExtensionName, lChannelCount, lPatternCount);
        this.parsePattern(lModule, lExtensionName, lChannelCount, lPatternCount);

        return lModule;
    }

    /**
     * Parse module name.
     * @param pModuleExtension - Module extension name.
     */
    private getChannelCount(pModuleExtension: ModuleExtension): number {
        switch (pModuleExtension) {
            case 'FLT8':
            case '8CHN':
                return 8;
            case '6CHN':
                return 6;
            default:
                return 4;
        }
    }

    /**
     * Parse extension name of module.
     */
    private getExtensionName(): ModuleExtension {
        const lPatternInformationLength = 130;

        // Get 4 character extension name. 
        //When the module has a extension than it has allways 31 samples.
        const lOffset = ModParser.NAME_BYTE_LENGTH + (31 * ModParser.SAMPLE_HEADER_BYTE_LENGTH) + lPatternInformationLength;
        const lModuleExtensionBuffer = ByteUtil.readBytes(this.data, lOffset, 4);
        const lModuleExtensionName: string = ByteUtil.byteToString(lModuleExtensionBuffer);

        // Check for all possible extension names. Return empty if no one matches any of those.
        return <ModuleExtension>((['M.K.', 'FLT4', 'FLT8', 'M!K!', '6CHN', '8CHN'].includes(lModuleExtensionName)) ? lModuleExtensionName : '');
    }

    /**
     * Parse module name.
     * @param pModuleExtension - Module extension name.
     */
    private getPatternCount(pModuleExtension: ModuleExtension): number {
        const lSampleCount: number = pModuleExtension !== '' ? 31 : 15;

        // Get offset to pattern oder. Name + sample header + order length + "RestartPosition"
        const lOffset = ModParser.NAME_BYTE_LENGTH + (lSampleCount * ModParser.SAMPLE_HEADER_BYTE_LENGTH) + 1 + 1;

        // Get sample play order and find max value.
        const lModuleSongPositionBuffer = ByteUtil.readBytes(this.data, lOffset, 128);
        const lHighestPatternIndex: number = Math.max(...lModuleSongPositionBuffer);

        // Index to count.
        return lHighestPatternIndex + 1;
    }

    /**
     * Parse effect numbers to effect object.
     * @param pEffect - Effect number.
     * @param pParameterX - Effect first parameter.
     * @param pParameterY - Effect second parameter.
     */
    private parseEffect(pEffect: number, pParameterX: number, pParameterY: number, pPitch: Pitch, pSampleNumber: number): Array<IGenericEffect> {
        const lEffectList: Array<IGenericEffect> = new Array<IGenericEffect>();

        // Ignore flags for ignoring channel data when pitch or sample is part of a effect parameter.
        let lIgnoreSample: boolean = false;
        let lIgnorePitch: boolean = false;

        // Parse other Effect.
        switch (pEffect) {
            case 0x0: break; // TODO:
            case 0x1: break; // TODO:
            case 0x2: break; // TODO:
            case 0x3: break; // TODO:
            case 0x4: break; // TODO:
            case 0x5: break; // TODO:
            case 0x6: break; // TODO:
            case 0x7: break; // TODO:
            case 0x8: break; // TODO:
            case 0x9: {
                const lSampleOffsetEffect: SampleOffsetEffect = new SampleOffsetEffect();
                lSampleOffsetEffect.offset = pParameterX * 4096 + pParameterY * 256;
                lEffectList.push(lSampleOffsetEffect);
                break;
            }
            case 0xA: {
                // Ignore YParameter when XParameter is set. Convert 0..64 to 0..1 range. 
                const lVolumeSlideEffect: VolumeSlideEffect = new VolumeSlideEffect();
                lVolumeSlideEffect.direction = (pParameterX > 0) ? Direction.Up : Direction.Down;
                lVolumeSlideEffect.volumeChangePerTick = ((pParameterX > 0) ? pParameterX : pParameterY) / 64;
                lEffectList.push(lVolumeSlideEffect);
                break;
            }
            case 0xB: break; // TODO:
            case 0xC: {
                // Ignore YParameter when XParameter is set. Convert 0..64 to 0..1 range. 
                const lVolumeSetEffect: SetVolumeEffect = new SetVolumeEffect();
                lVolumeSetEffect.volume = (pParameterX * 16 + pParameterY) / 64;
                lEffectList.push(lVolumeSetEffect);
                break;
            }
            case 0xD: break; // TODO:
            case 0xE: {
                switch (pParameterX) {
                    case 0x0: break; // TODO:
                    case 0x1: break; // TODO:
                    case 0x2: break; // TODO:
                    case 0x3: break; // TODO:
                    case 0x4: break; // TODO:
                    case 0x5: {
                        const lSetFinetuneEffect: SetFinetuneEffect = new SetFinetuneEffect();
                        lSetFinetuneEffect.finetune = pParameterY;
                        lEffectList.push(lSetFinetuneEffect);
                        break;
                    }
                    case 0x6: break; // TODO:
                    case 0x7: break; // TODO:
                    case 0x8: break; // TODO:
                    case 0x9: {
                        // Set effect only when the interval parameter is set.
                        if (pParameterY > 0) {
                            const lRetriggerSampleEffect: RetriggerSampleEffect = new RetriggerSampleEffect();
                            lRetriggerSampleEffect.tickInterval = pParameterY;
                            lEffectList.push(lRetriggerSampleEffect);
                        }
                        break;
                    }
                    case 0xA: break; // TODO:
                    case 0xB: break; // TODO:
                    case 0xC: {
                        const lCutSampleEffect: CutSampleEffect = new CutSampleEffect();
                        lCutSampleEffect.ticks = pParameterY;
                        lEffectList.push(lCutSampleEffect);
                        break;
                    }
                    case 0xD: {
                        const lDelaySampleEffect: DelaySampleEffect = new DelaySampleEffect();
                        lDelaySampleEffect.ticks = pParameterY;
                        lEffectList.push(lDelaySampleEffect);
                        break;
                    }
                    case 0xE: break; // TODO:
                    case 0xF: {
                        const lInvertLoopEffect: InvertSampleLoopEffect = new InvertSampleLoopEffect();
                        lInvertLoopEffect.invert = pParameterY > 0;
                        lEffectList.push(lInvertLoopEffect);
                        break;
                    }
                }
                break;
            }
            case 0xF: {
                // Calculate speed change. Speed can not be lower than 1.
                let lSpeed: number = pParameterX * 16 + pParameterY;
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

                break;
            }
        }

        // Add sample as effect if not ignored.
        if (!lIgnoreSample && pSampleNumber > 0) {
            const lSampleEffect: SetSampleEffect = new SetSampleEffect();
            lSampleEffect.sampleIndex = pSampleNumber - 1;
            lEffectList.push(lSampleEffect);
        }

        // Add pitch as effect if not ignored.
        if (!lIgnorePitch && pPitch !== Pitch.Empty) {
            const lPitchEffect: SetPitchEffect = new SetPitchEffect();
            lPitchEffect.pitch = pPitch;
            lEffectList.push(lPitchEffect);
        }

        return lEffectList;
    }

    /**
     * Parse module name.
     * @param pModule - Generic module.
     */
    private parseName(pModule: GenericModule): void {
        const lStartingOffset: number = 0;

        // Get module name as byte array.
        const lNameBuffer = ByteUtil.readBytes(this.data, lStartingOffset, ModParser.NAME_BYTE_LENGTH);

        // Convert byte to string.
        pModule.songName = ByteUtil.byteToString(lNameBuffer);
    }

    /**
     * Parse Pattern data. 
     * @param pModule - Generic module.
     * @param pChannelCount - Channel count.
     * @param pPatternCount - Pattern count.
     */
    private parsePattern(pModule: GenericModule, pModuleExtension: ModuleExtension, pChannelCount: number, pPatternCount: number): void {
        // Get pattern count.
        const lSampleCount: number = (pModuleExtension !== '') ? 31 : 15;

        // Get pattern order length.
        const lSampleOrderLengthOffset = ModParser.NAME_BYTE_LENGTH + (lSampleCount * ModParser.SAMPLE_HEADER_BYTE_LENGTH);
        const lSampleOrderLengthBuffer = ByteUtil.readBytes(this.data, lSampleOrderLengthOffset, 1);
        const lSampleOrderLength: number = lSampleOrderLengthBuffer[0];

        // Get pattern order.
        const lSampleOrderOffset = ModParser.NAME_BYTE_LENGTH + (lSampleCount * ModParser.SAMPLE_HEADER_BYTE_LENGTH) + 1 + 1;
        const lModuleSongPositionBuffer = ByteUtil.readBytes(this.data, lSampleOrderOffset, 128);
        pModule.pattern.songPositions = [...lModuleSongPositionBuffer.slice(0, lSampleOrderLength)];

        // Set starting offset of first pattern division.
        let lNextPatternDevisionPosition: number = ModParser.NAME_BYTE_LENGTH + (ModParser.SAMPLE_HEADER_BYTE_LENGTH * lSampleCount);
        lNextPatternDevisionPosition += 130 + ((lSampleCount === 31) ? 4 : 0);  // Pattern count, pattern order and module extension.

        // Create new pattern.
        for (let lPatternIndex: number = 0; lPatternIndex < pPatternCount; lPatternIndex++) {
            const lPattern: Pattern = pModule.pattern.addPattern(lPatternIndex);

            // Fill each division row.
            for (let lDivisionIndex: number = 0; lDivisionIndex < 64; lDivisionIndex++) {
                const lDivision: Division = lPattern.addDivision(lDivisionIndex);

                // Create new pattern division for each channel.
                for (let lChannelIndex: number = 0; lChannelIndex < pChannelCount; lChannelIndex++) {
                    // Get 32bit and concat all bits into one number: wwww xxxxxxxxxxxx yyyy zzzzzzzzzzzz = Length 32bit. 
                    const lDevisionBuffer: Uint8Array = ByteUtil.readBytes(this.data, lNextPatternDevisionPosition, 4);
                    const lBufferNumber: bigint = ByteUtil.concatBytes(lDevisionBuffer);

                    // wwww yyyy (8 bits ) - sample number, not index.
                    const lSampleNumber: number = Number(ByteUtil.pickBits(lBufferNumber, 32, [0, 1, 2, 3, 16, 17, 18, 19]));

                    // xxxx xxxx xxxx (12 bits) - sample period
                    const lSamplePeriod: number = Number(ByteUtil.pickBits(lBufferNumber, 32, [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));

                    // zzzz zzzz zzzz (12 bits) - sample effect
                    const lSampleEffect: number = Number(ByteUtil.pickBits(lBufferNumber, 32, [20, 21, 22, 23]));
                    const lSampleEffectParameterX: number = Number(ByteUtil.pickBits(lBufferNumber, 32, [24, 25, 26, 27]));
                    const lSampleEffectParameterY: number = Number(ByteUtil.pickBits(lBufferNumber, 32, [28, 29, 30, 31]));

                    // Add division.
                    const lDivisionChannel: DivisionChannel = lDivision.addChannel(lChannelIndex);

                    // Add division effect.
                    const lEffectList: Array<IGenericEffect> = this.parseEffect(lSampleEffect, lSampleEffectParameterX, lSampleEffectParameterY, ModParser.PITCH_TABLE[lSamplePeriod] ?? 0, lSampleNumber);
                    for (const lEffect of lEffectList) {
                        lDivisionChannel.setEffect(lEffect);
                    }

                    // Set next divison position.
                    lNextPatternDevisionPosition += 4;
                }

            }
        }
    }

    /**
     * Parse sample headers.
     * @param pModule - Generic module.
     * @param pModuleExtension - Module extension name.
     * @param pChannelCount - Channel count.
     * @param pPatternCount - Pattern count.
     */
    private parseSample(pModule: GenericModule, pModuleExtension: ModuleExtension, pChannelCount: number, pPatternCount: number): void {
        const lStartingOffset: number = ModParser.NAME_BYTE_LENGTH; // Module name.

        // Check for 31 or 15 Samples
        const lSampleCount: number = (pModuleExtension !== '') ? 31 : 15;

        // Sample header offsets.
        const lSampleNameOffset: number = 0; // String
        const lSampleLengthOffset: number = 22; // Word
        const lSampleFinetuneOffset: number = 24; // Signed-Lower-Nibble -8..7
        const lSampleVolumeOffset: number = 25; // Byte: 0..64
        const lSampleRepeatOffsetOffset: number = 26; // Word
        const lSampleRepeatLengthOffset: number = 28; // Word

        // Calculate sample body data offset.
        let lDataOffset: number = ModParser.NAME_BYTE_LENGTH;
        lDataOffset += ModParser.SAMPLE_HEADER_BYTE_LENGTH * lSampleCount;
        lDataOffset += 130 + ((lSampleCount === 31) ? 4 : 0); // Pattern count, pattern order and module extension.
        lDataOffset += 64 * 4 * pChannelCount * pPatternCount; // Pattern data.

        // Parse each sample header.
        let lPreviousSampleBodyDataLength: number = 0;
        for (let lSampleIndex: number = 0; lSampleIndex < lSampleCount; lSampleIndex++) {
            const lSampleHeaderOffset = (lSampleIndex * ModParser.SAMPLE_HEADER_BYTE_LENGTH) + lStartingOffset;
            const lSample: Sample = pModule.samples.addSample(lSampleIndex);

            // Read sample name.
            const lSampleNameBuffer: Uint8Array = ByteUtil.readBytes(this.data, lSampleHeaderOffset + lSampleNameOffset, 22);
            lSample.name = ByteUtil.byteToString(lSampleNameBuffer);

            // Read sample length and save for later use.
            const lSampleLengthBuffer: Uint8Array = ByteUtil.readBytes(this.data, lSampleHeaderOffset + lSampleLengthOffset, 2);
            const lSampleLength = ByteUtil.byteToWorld(lSampleLengthBuffer[0], lSampleLengthBuffer[1]) * 2; // WorldLength to ByteLength

            // Read sample fine tune. Lowest four bits represent a signed nibble.
            const lSampleFinetuneBuffer: Uint8Array = ByteUtil.readBytes(this.data, lSampleHeaderOffset + lSampleFinetuneOffset, 1);
            lSample.fineTune = ByteUtil.byteToNibble(lSampleFinetuneBuffer[0], true)[1];

            // Read sample volume.
            const lSampleVolumeBuffer: Uint8Array = ByteUtil.readBytes(this.data, lSampleHeaderOffset + lSampleVolumeOffset, 1);
            lSample.volume = ByteUtil.byteToByte(lSampleVolumeBuffer[0]) / 64;

            // Read sample repeat offset.
            const lSampleRepeatOffsetBuffer: Uint8Array = ByteUtil.readBytes(this.data, lSampleHeaderOffset + lSampleRepeatOffsetOffset, 2);
            let lSampleRepeatOffset: number = ByteUtil.byteToWorld(lSampleRepeatOffsetBuffer[0], lSampleRepeatOffsetBuffer[1]) * 2; // WorldLength to ByteLength
            lSampleRepeatOffset -= 2; // Remove repeat information in first word. 

            // Read sample repeat length.
            const lSampleRepeatLengthBuffer: Uint8Array = ByteUtil.readBytes(this.data, lSampleHeaderOffset + lSampleRepeatLengthOffset, 2);
            let lSampleRepeatLength: number = ByteUtil.byteToWorld(lSampleRepeatLengthBuffer[0], lSampleRepeatLengthBuffer[1]) * 2; // WorldLength to ByteLength
            lSampleRepeatLength -= 2; // Remove repeat information in first word. 

            // Set repeat information.
            lSample.setRepeatInformation(lSampleRepeatOffset, lSampleRepeatLength);

            // Read sample body data and convert to Uint16.
            const lSampleLengthWithoutRepeat: number = lSampleLength - 2;
            if (lSampleLengthWithoutRepeat > 0) {
                const lSampleBodyDataInt8Buffer: Uint8Array = ByteUtil.readBytes(this.data, lDataOffset + lPreviousSampleBodyDataLength, lSampleLengthWithoutRepeat);
                const lSampleBodyDataFloat32Buffer: Float32Array = new Float32Array(lSampleLengthWithoutRepeat);
                for (let lIndex: number = 0; lIndex < lSampleLengthWithoutRepeat; lIndex++) {
                    lSampleBodyDataFloat32Buffer[lIndex] = ByteUtil.byteToByte(lSampleBodyDataInt8Buffer[lIndex], true) / 128; // Range [-1 .. 1]
                }
                lSample.data = lSampleBodyDataFloat32Buffer;
            } else {
                lSample.data = new Float32Array(0);
            }
            // Count previous sample body data length.
            lPreviousSampleBodyDataLength += lSampleLength;
        }
    }
}

type ModuleExtension = 'M.K.' | 'FLT4' | 'FLT8' | 'M!K!' | '6CHN' | '8CHN' | '';