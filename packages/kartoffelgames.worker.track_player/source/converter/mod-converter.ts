import { ByteUtil } from "@kartoffelgames/core";

// TODO: Sampledata length is specified as 2byte so is the repeatinformation but the sample data is still read and processed as 8bit.

export class ModConverter {
    private static readonly NAME_BYTE_LENGTH: number = 20;
    private static readonly SAMPLE_HEADER_BYTE_LENGTH: number = 30;


    public convert(pModFile: ArrayBuffer): ArrayBuffer {
        const lSamples = this.readSamples(pModFile);

        const lModFile: ModFile = {
            samples: lSamples,
            patternOrderList: this.readPatternOrder(pModFile, lSamples.length)
        };

        // TODO:
        return pModFile;
    }

    private readPatternOrder(pModFile: ArrayBuffer, pSampleCount: number): Array<number> {
        // Read data as byte.
        const lByteData: Uint8Array = new Uint8Array(pModFile);

        // Get pattern order length.
        const lSampleOrderLengthOffset = ModConverter.NAME_BYTE_LENGTH + (pSampleCount * ModConverter.SAMPLE_HEADER_BYTE_LENGTH);
        const lSongPositionCount: number = lByteData[lSampleOrderLengthOffset];

        // Get offset to song Positions. Name + sample header + order length + "RestartPosition"
        const lSongPositionOffset = ModConverter.NAME_BYTE_LENGTH + (pSampleCount * ModConverter.SAMPLE_HEADER_BYTE_LENGTH) + 1 + 1;

        // Read complete song position as uint8 data.
        const lSongPositionData: Uint8Array = lByteData.slice(
            lSongPositionOffset,
            lSongPositionOffset + lSongPositionCount
        );

        return Array.from(lSongPositionData);
    }

    private readSamples(pModFile: ArrayBuffer): Array<ModFileSample> {
        // When no module extension is set, its a legacy module with only 15 samples. 
        const lModuleExtension: string = this.getExtensionName(pModFile);
        const lSampleCount: number = lModuleExtension === '' ? 15 : 31;

        // Read channel and pattern count to calculate the sample data offset.
        const lChannelCount: number = this.getChannelCount(lModuleExtension);
        const lPatternCount: number = this.getPatternCount(pModFile, lSampleCount);

        // Sample head and body starting offset.
        let lSampleHeadDataOffset: number = ModConverter.NAME_BYTE_LENGTH;

        // Calculate sample body offset.
        let lSampleBodyDataOffset: number = ModConverter.NAME_BYTE_LENGTH;
        lSampleBodyDataOffset += ModConverter.SAMPLE_HEADER_BYTE_LENGTH * lSampleCount;
        lSampleBodyDataOffset += 130 + ((lSampleCount === 31) ? 4 : 0); // Pattern count, pattern order and module extension.
        lSampleBodyDataOffset += 64 * 4 * lChannelCount * lPatternCount; // Pattern data.   

        // Read data as byte.
        const lByteData: Uint8Array = new Uint8Array(pModFile);

        // Result list.
        const lSampleHeadList: Array<ModFileSample> = new Array<ModFileSample>();

        // Parse sample header.
        for (let lSampleIndex: number = 0; lSampleIndex < lSampleCount; lSampleIndex++) {
            // Get sample data and convert it without data information.
            const lSampleHeadBuffer: Uint8Array = ByteUtil.readBytes(lByteData, lSampleHeadDataOffset, ModConverter.SAMPLE_HEADER_BYTE_LENGTH);
            const lSampleHead: Omit<ModFileSample, 'body'> = this.convertSampleHead(lSampleHeadBuffer);

            // Calculate data length and offset. Body starts after two bytes, as the legacy modules contains repeat information that is not used any more.
            const lDataLength: number = lSampleHead.bodyLength - 2;
            const lDataOffset: number = lSampleBodyDataOffset + 2;

            // Read and convert sample body into a normalized float32 array.
            const lSampleBodyBuffer: Uint8Array = ByteUtil.readBytes(lByteData, lDataOffset, lDataLength);
            lSampleHeadList.push({
                ...lSampleHead,
                body: this.convertSampleBody(lSampleBodyBuffer)
            });

            // Move position cursor.
            lSampleHeadDataOffset += ModConverter.SAMPLE_HEADER_BYTE_LENGTH;
            lSampleBodyDataOffset += lSampleHead.bodyLength;
        }

        return lSampleHeadList;
    }

    /**
     * Parse sample head from raw byte data. 
     * @param pSampleHeadData - Sample head data.
     */
    protected convertSampleHead(pSampleHeadData: Uint8Array): Omit<ModFileSample, 'body'> {
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
     * Parse extension name of module.
     * 
     * @param pModFile - Complete mode file data.
     */
    private getExtensionName(pModFile: ArrayBuffer): string {
        const lPatternInformationLength = 130;

        // View data as a byte array.
        const lByteData: Uint8Array = new Uint8Array(pModFile);

        // Get the 4 character length extension name. 
        // When the module has a extension than it has allways 31 samples.
        const lOffset = ModConverter.NAME_BYTE_LENGTH + (31 * ModConverter.SAMPLE_HEADER_BYTE_LENGTH) + lPatternInformationLength;
        const lModuleExtensionBuffer = ByteUtil.readBytes(lByteData, lOffset, 4);
        const lModuleExtensionName: string = ByteUtil.byteToString(lModuleExtensionBuffer);

        // Check for all possible extension names. Return empty if no one matches any of those.
        return ((['M.K.', 'FLT4', 'FLT8', 'M!K!', '6CHN', '8CHN'].includes(lModuleExtensionName)) ? lModuleExtensionName : '');
    }

    /**
     * Parse module name.
     * 
     * @param pModuleExtension - Module extension name.
     */
    private getChannelCount(pModuleExtension: string): number {
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
     * Parse raw sample body to a normalized [1 .. -1] Float32 range.
     * 
     * @param pSampleBodyData - Sample body data.
     */
    protected convertSampleBody(pSampleBodyData: Uint8Array): Float32Array {
        const lFloat32Buffer: Float32Array = new Float32Array(pSampleBodyData.length);
        for (let lIndex: number = 0; lIndex < pSampleBodyData.length; lIndex++) {
            lFloat32Buffer[lIndex] = ByteUtil.byteToByte(pSampleBodyData[lIndex], true) / 128; // Range [-1 .. 1]
        }

        return lFloat32Buffer;
    }

    /**
     * Parse module pattern count.
     * @param pData - Complete data.
     * @param pSampleCount - Sample count.
     */
    private getPatternCount(pModFile: ArrayBuffer, pSampleCount: number): number {
        // View data as a byte array.
        const lByteData: Uint8Array = new Uint8Array(pModFile);

        // Get offset to pattern order. Name + sample header + order length + "RestartPosition"
        // "RestartPosition" is a legacy data to allow modules to loop its pattern.
        const lOffset = ModConverter.NAME_BYTE_LENGTH + (pSampleCount * ModConverter.SAMPLE_HEADER_BYTE_LENGTH) + 1 + 1;

        // Get sample play order and find max value.
        const lModuleSongPositionBuffer = ByteUtil.readBytes(lByteData, lOffset, 128);
        const lHighestPatternIndex: number = Math.max(...lModuleSongPositionBuffer);

        // Index to count.
        return lHighestPatternIndex + 1;
    }

    /**
     * Parse channel from raw data.
     * @param pChannelData - Single channel data.
     */
    private parseChannel(pChannelData: Uint8Array): ModFilePatternDivisionChannel {
        // Get 32bit and concat all bits into one number: wwww xxxxxxxxxxxx yyyy zzzzzzzzzzzz = Length 32bit. 
        const lBufferNumber: bigint = ByteUtil.concatBytes(pChannelData);

        // wwww yyyy (8 bits ) - sample number, not index.
        const lSampleNumber: number = Number(ByteUtil.pickBits(lBufferNumber, 32, [0, 1, 2, 3, 16, 17, 18, 19]));

        // xxxx xxxx xxxx (12 bits) - sample period
        const lSamplePeriod: number = Number(ByteUtil.pickBits(lBufferNumber, 32, [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]));

        // zzzz zzzz zzzz (12 bits) - sample effect
        const lSampleEffect: number = Number(ByteUtil.pickBits(lBufferNumber, 32, [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]));

        // Return single channel value. 
        return {
            effect: lSampleEffect,
            pitch: lSamplePeriod,
            sample: lSampleNumber
        };
    }

    private parsePatterns(pModFile: ArrayBuffer, pPatternOrderList: Array<number>, pSampleCount: number): Array<ModFilePattern> {
        // View data as a byte array.
        const lByteData: Uint8Array = new Uint8Array(pModFile);

        // Get pattern count from highest song position pattern index.
        const lPatternCount: number = Math.max(...pPatternOrderList) + 1;

        // Read channel count.
        const lModuleExtension: string = this.getExtensionName(pModFile);
        const lChannelCount: number = this.getChannelCount(lModuleExtension);

        // Calculate starting offset of first pattern division.
        let lPatternPosition: number = ModConverter.NAME_BYTE_LENGTH + (ModConverter.SAMPLE_HEADER_BYTE_LENGTH * pSampleCount);
        lPatternPosition += 130 + ((pSampleCount === 31) ? 4 : 0);  // Pattern count, pattern order and optional module extension.

        // Parse pattern.
        const lPatternList: Array<ModFilePattern> = new Array<ModFilePattern>();
        for (let lPatternIndex: number = 0; lPatternIndex < lPatternCount; lPatternIndex++) {
            // Create new pattern.
            const lPattern: ModFilePattern = {
                divisions: new Array<ModFilePatternDivision>()
            };

            // Postbone add the empty pattern to pattern result list.
            lPatternList.push(lPattern);

            // Parse division.
            for (let lDivisionIndex: number = 0; lDivisionIndex < 64; lDivisionIndex++) {
                // Create emtpy pattern division.
                const lDivision: ModFilePatternDivision = {
                    channels: new Array<ModFilePatternDivisionChannel>()
                };

                // Postbone add the empty division to pattern.
                lPattern.divisions.push(lDivision);

                // Parse division channel.
                for (let lChannelIndex: number = 0; lChannelIndex < lChannelCount; lChannelIndex++) {
                    // For MOD files:
                    // Get 32bit and concat all bits into one number: wwww xxxxxxxxxxxx yyyy zzzzzzzzzzzz = Length 32bit. 
                    const lDivisionBuffer: Uint8Array = ByteUtil.readBytes(lByteData, lPatternPosition, 4);
                    const lDivisionChannel: ModFilePatternDivisionChannel = this.parseChannel(lDivisionBuffer);

                    // Add channel to division.
                    lDivision.channels.push(lDivisionChannel);

                    // Something the pattern possition by 32bit.
                    lPatternPosition += 4;
                }
            }
        }

        return lPatternList;
    }
}

export type ModFile = {
    samples: Array<ModFileSample>;
    patternOrderList: Array<number>;
};

export type ModFileSample = {
    name: string;
    volume: number;
    fineTune: number;
    repeatOffset: number;
    repeatLength: number;
    bodyLength: number;
    body: Float32Array;
};

export type ModFilePatternDivisionChannelEffect = {
    type: number;
    paramters: [];
};

export type ModFilePatternDivisionChannel = {
    effect: ModFilePatternDivisionChannelEffect | null;
    pitch: number;
    sample: number;
};

export type ModFilePatternDivision = {
    channels: Array<ModFilePatternDivisionChannel>;
};

export type ModFilePattern = {
    divisions: Array<ModFilePatternDivision>;
};