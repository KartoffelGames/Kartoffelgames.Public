import { ByteUtil } from '@kartoffelgames/core';
import { BaseModuleParser, ModuleParseOptions, SampleHead } from '../base-module-parser.ts';
import { ChannelValue } from '../effect-parser.ts';
import { ModEffectParser } from './mod-effect-parser.ts';

export class ModParser extends BaseModuleParser {
    private static readonly NAME_BYTE_LENGTH: number = 20;
    private static readonly SAMPLE_HEADER_BYTE_LENGTH: number = 30;

    /**
     * Constructor.
     * @param pData - File data.
     */
    public constructor(pData: Uint8Array) {
        super(pData, new ModEffectParser());
    }

    /**
     * Calculate parse options from raw file data.
     * @param pData - Complete file data.
     */
    protected calculateModuleParseOptions(pData: Uint8Array): ModuleParseOptions {
        const lModuleExtension: ModuleExtension = this.getExtensionName(pData);
        const lChannelCount: number = this.getChannelCount(lModuleExtension);
        const lSampleCount: number = lModuleExtension !== '' ? 31 : 15;
        const lPatternCount: number = this.getPatternCount(pData, lSampleCount);

        // Get offset to song Positions. Name + sample header + order length + "RestartPosition"
        const lSongPositionOffset = ModParser.NAME_BYTE_LENGTH + (lSampleCount * ModParser.SAMPLE_HEADER_BYTE_LENGTH) + 1 + 1;
        // Calculate song position count.
        const lSongPositionCount: number = this.getSongPositionLength(pData, lSampleCount);

        // Calculate starting offset of first pattern division.
        let lPatternOffset: number = ModParser.NAME_BYTE_LENGTH + (ModParser.SAMPLE_HEADER_BYTE_LENGTH * lSampleCount);
        lPatternOffset += 130 + ((lSampleCount === 31) ? 4 : 0);  // Pattern count, pattern order and optional module extension.

        // Calculate sample body offset.
        let lSampleBodyOffset: number = ModParser.NAME_BYTE_LENGTH;
        lSampleBodyOffset += ModParser.SAMPLE_HEADER_BYTE_LENGTH * lSampleCount;
        lSampleBodyOffset += 130 + ((lSampleCount === 31) ? 4 : 0); // Pattern count, pattern order and module extension.
        lSampleBodyOffset += 64 * 4 * lChannelCount * lPatternCount; // Pattern data.   

        return {
            name: {
                byteOffset: 0,
                bytes: ModParser.NAME_BYTE_LENGTH,
                emptyValue: 0
            },
            songPositions: {
                count: lSongPositionCount,
                valueByteSize: 1,
                byteOffset: lSongPositionOffset
            },
            pattern: {
                byteOffset: lPatternOffset,
                division: {
                    count: 64,
                },
                channel: {
                    count: lChannelCount,
                    bytes: 4
                }
            },
            sample: {
                count: lSampleCount,
                head: {
                    bytes: ModParser.SAMPLE_HEADER_BYTE_LENGTH,
                    offset: ModParser.NAME_BYTE_LENGTH
                },
                body: {
                    byteOffset: lSampleBodyOffset,
                    valueByteSize: 2,
                    dataStartByteOffset: 2
                }
            }
        };
    }

    /**
     * Parse channel from raw data.
     * @param pChannelData - Single channel data.
     */
    protected parseChannel(pChannelData: Uint8Array): Array<ChannelValue> {
        // Get 32bit and concat all bits into one number: wwww xxxxxxxxxxxx yyyy zzzzzzzzzzzz = Length 32bit. 
        const lBufferNumber: bigint = ByteUtil.concatBytes(pChannelData);

        // wwww yyyy (8 bits ) - sample number, not index.
        const lSampleNumber: number = Number(ByteUtil.pickBits(lBufferNumber, 32, [0, 1, 2, 3, 16, 17, 18, 19]));

        // xxxx xxxx xxxx (12 bits) - sample period
        const lSamplePeriod: number = Number(ByteUtil.pickBits(lBufferNumber, 32, [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));

        // zzzz zzzz zzzz (12 bits) - sample effect
        const lSampleEffect: number = Number(ByteUtil.pickBits(lBufferNumber, 32, [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]));

        // Save single channel value into array. 
        const lChannelValueList: Array<ChannelValue> = new Array<ChannelValue>();
        lChannelValueList.push({
            effect: lSampleEffect,
            pitch: lSamplePeriod,
            sample: lSampleNumber
        });

        return lChannelValueList;
    }

    /**
     * Parse sample head from raw byte data. 
     * @param pSampleHeadData - Sample head data.
     */
    protected parseSampleHead(pSampleHeadData: Uint8Array): SampleHead {
        // Sample header offsets.
        const lSampleNameOffset: number = 0; // String
        const lSampleLengthOffset: number = 22; // Word
        const lSampleFinetuneOffset: number = 24; // Signed-Lower-Nibble -8..7
        const lSampleVolumeOffset: number = 25; // Byte: 0..64
        const lSampleRepeatOffsetOffset: number = 26; // Word
        const lSampleRepeatLengthOffset: number = 28; // Word

        // Read sample name.
        const lSampleNameBuffer: Uint8Array = ByteUtil.readBytes(pSampleHeadData, lSampleNameOffset, 22);
        const lSampleName: string = ByteUtil.byteToString(lSampleNameBuffer);

        // Read sample length and save for later use.
        const lSampleLengthBuffer: Uint8Array = ByteUtil.readBytes(pSampleHeadData, lSampleLengthOffset, 2);
        const lSampleLength = ByteUtil.byteToWorld(lSampleLengthBuffer[0], lSampleLengthBuffer[1]); // WorldLength

        // Read sample fine tune. Lowest four bits represent a signed nibble.
        const lSampleFinetuneBuffer: Uint8Array = ByteUtil.readBytes(pSampleHeadData, lSampleFinetuneOffset, 1);
        const lSampleFineTune: number = ByteUtil.byteToNibble(lSampleFinetuneBuffer[0], true)[1];

        // Read sample volume.
        const lSampleVolumeBuffer: Uint8Array = ByteUtil.readBytes(pSampleHeadData, lSampleVolumeOffset, 1);
        const lSampleVolume: number = ByteUtil.byteToByte(lSampleVolumeBuffer[0]) / 64;

        // Read sample repeat offset.
        const lSampleRepeatOffsetBuffer: Uint8Array = ByteUtil.readBytes(pSampleHeadData, lSampleRepeatOffsetOffset, 2);
        let lSampleRepeatOffset: number = ByteUtil.byteToWorld(lSampleRepeatOffsetBuffer[0], lSampleRepeatOffsetBuffer[1]); // WorldLength
        lSampleRepeatOffset -= 2; // Remove repeat information in first word. 

        // Read sample repeat length.
        const lSampleRepeatLengthBuffer: Uint8Array = ByteUtil.readBytes(pSampleHeadData, lSampleRepeatLengthOffset, 2);
        let lSampleRepeatLength: number = ByteUtil.byteToWorld(lSampleRepeatLengthBuffer[0], lSampleRepeatLengthBuffer[1]); // WorldLength
        lSampleRepeatLength -= 2; // Remove repeat information in first word. 

        // Get sample body length with removed repeat information in first word.
        const lSampleLengthWithoutRepeat: number = lSampleLength;

        return {
            name: lSampleName,
            volume: lSampleVolume,
            fineTune: lSampleFineTune,
            repeatOffset: lSampleRepeatOffset,
            repeatLength: lSampleRepeatLength,
            bodyLength: lSampleLengthWithoutRepeat
        };
    }

    /**
     * Parse raw sample body to [1 .. -1] Float32 range.
     * @param pSampleBodyData - Sample body data.
     */
    protected parseSampleBody(pSampleBodyData: Uint8Array): Float32Array {
        const lFloat32Buffer: Float32Array = new Float32Array(pSampleBodyData.length);
        for (let lIndex: number = 0; lIndex < pSampleBodyData.length; lIndex++) {
            lFloat32Buffer[lIndex] = ByteUtil.byteToByte(pSampleBodyData[lIndex], true) / 128; // Range [-1 .. 1]
        }

        return lFloat32Buffer;
    }

    /**
     * Parse extension name of module.
     */
    private getExtensionName(pData: Uint8Array): ModuleExtension {
        const lPatternInformationLength = 130;

        // Get 4 character extension name. 
        //When the module has a extension than it has allways 31 samples.
        const lOffset = ModParser.NAME_BYTE_LENGTH + (31 * ModParser.SAMPLE_HEADER_BYTE_LENGTH) + lPatternInformationLength;
        const lModuleExtensionBuffer = ByteUtil.readBytes(pData, lOffset, 4);
        const lModuleExtensionName: string = ByteUtil.byteToString(lModuleExtensionBuffer);

        // Check for all possible extension names. Return empty if no one matches any of those.
        return <ModuleExtension>((['M.K.', 'FLT4', 'FLT8', 'M!K!', '6CHN', '8CHN'].includes(lModuleExtensionName)) ? lModuleExtensionName : '');
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
     * Parse module pattern count.
     * @param pData - Complete data.
     * @param pSampleCount - Sample count.
     */
    private getPatternCount(pData: Uint8Array, pSampleCount: number): number {
        // Get offset to pattern oder. Name + sample header + order length + "RestartPosition"
        const lOffset = ModParser.NAME_BYTE_LENGTH + (pSampleCount * ModParser.SAMPLE_HEADER_BYTE_LENGTH) + 1 + 1;

        // Get sample play order and find max value.
        const lModuleSongPositionBuffer = ByteUtil.readBytes(pData, lOffset, 128);
        const lHighestPatternIndex: number = Math.max(...lModuleSongPositionBuffer);

        // Index to count.
        return lHighestPatternIndex + 1;
    }

    /**
     * Parse length of song list.
     * @param pData - Complete data.
     * @param pSampleCount - Sample count.
     */
    private getSongPositionLength(pData: Uint8Array, pSampleCount: number): number {
        // Get pattern order length.
        const lSampleOrderLengthOffset = ModParser.NAME_BYTE_LENGTH + (pSampleCount * ModParser.SAMPLE_HEADER_BYTE_LENGTH);
        const lSampleOrderLengthBuffer = ByteUtil.readBytes(pData, lSampleOrderLengthOffset, 1);
        return lSampleOrderLengthBuffer[0];
    }
}

type ModuleExtension = 'M.K.' | 'FLT4' | 'FLT8' | 'M!K!' | '6CHN' | '8CHN' | '';