import { ByteUtil } from "@kartoffelgames/core";

// TODO: Sampledata length is specified as 2byte so is the repeatinformation but the sample data is still read and processed as 8bit.

export class ModConverter {
    private static readonly NAME_BYTE_LENGTH: number = 20;
    private static readonly SAMPLE_HEADER_BYTE_LENGTH: number = 30;


    public convert(pModFile: ArrayBuffer): ArrayBuffer {
        // TODO:
        return pModFile;
    }

    private readSamples(pModFile: ArrayBuffer): Array<ModFileSample> {
        // When no module extension is set, its a legacy module with only 15 samples. 
        const lModuleExtension: string = this.getExtensionName(pModFile);
        const lSampleCount: number = lModuleExtension === '' ?  15 : 31;

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
            })

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
}

export type ModFileSample = {
    name: string;
    volume: number;
    fineTune: number;
    repeatOffset: number;
    repeatLength: number;
    bodyLength: number;
    body: Float32Array;
};
