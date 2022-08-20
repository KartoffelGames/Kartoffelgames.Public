import { IGenericEffect } from '../effect/effect_definition/i-generic-effect';
import { GenericModule } from '../generic_module/generic-module';
import { Division } from '../generic_module/pattern/division';
import { DivisionChannel } from '../generic_module/pattern/division-channel';
import { Pattern } from '../generic_module/pattern/pattern';
import { Sample } from '../generic_module/sample/sample';
import { BaseEffectParser, ChannelValue } from './base-effect-parser';
import { ByteUtil } from '@kartoffelgames/core.data';

export abstract class BaseModuleParser {
    private readonly mData: Uint8Array;
    private readonly mEffectParser: BaseEffectParser;

    /**
     * Constructor.
     * @param pData - Byte data of module.
     */
    public constructor(pData: Uint8Array, pEffectParser: BaseEffectParser) {
        this.mData = pData;
        this.mEffectParser = pEffectParser;
    }

    /**
     * Parse data to a generic module.
     */
    public parse(): GenericModule {
        const lModule: GenericModule = new GenericModule();
        const lParseOptions: ModuleParseOptions = this.calculateModuleParseOptions(this.mData);

        // Parse module name.
        const lNameBuffer = ByteUtil.readBytes(this.mData, lParseOptions.name.offset, lParseOptions.name.length);
        lModule.songName = ByteUtil.byteToString(lNameBuffer, lParseOptions.name.emptyValue);

        // Pattern starting position.
        let lPatternPosition: number = lParseOptions.pattern.offset;

        // Parse pattern.
        for (let lPatternIndex: number = 0; lPatternIndex < lParseOptions.pattern.count; lPatternIndex++) {
            const lPattern: Pattern = lModule.pattern.addPattern(lPatternIndex);
            // Parse division.
            for (let lDivisionIndex: number = 0; lDivisionIndex < lParseOptions.pattern.division.count; lDivisionIndex++) {
                const lDivision: Division = lPattern.addDivision(lDivisionIndex);
                // Parse division channel.
                for (let lChannelIndex: number = 0; lChannelIndex < lParseOptions.pattern.channel.count; lChannelIndex++) {
                    const lDivisionChannel: DivisionChannel = lDivision.addChannel(lChannelIndex);

                    // For MOD files:
                    // Get 32bit and concat all bits into one number: wwww xxxxxxxxxxxx yyyy zzzzzzzzzzzz = Length 32bit. 
                    const lDevisionBuffer: Uint8Array = ByteUtil.readBytes(this.mData, lPatternPosition, lParseOptions.pattern.channel.length);
                    const lChannelValueList: Array<ChannelValue> = this.parseChannel(lDevisionBuffer);

                    // Convert received channel data to effects.
                    for (const lChannelValue of lChannelValueList) {
                        const lEffectList: Array<IGenericEffect> = this.mEffectParser.parseChannel(lChannelValue);

                        // Add all effects to new division channel.
                        for (const lEffect of lEffectList) {
                            lDivisionChannel.setEffect(lEffect);
                        }
                    }

                    lPatternPosition += lParseOptions.pattern.channel.length;
                }
            }
        }

        // Read and convert song position.
        const lPatternOrderList: Array<number> = new Array<number>();
        let lSongOrderPosition: number = lParseOptions.songOrder.offset;
        for (let lPatternOrderIndex: number = 0; lPatternOrderIndex < lParseOptions.songOrder.count; lPatternOrderIndex++) {
            const lPatternIndexBuffer: Uint8Array = ByteUtil.readBytes(this.mData, lSongOrderPosition, lParseOptions.songOrder.byteSize);

            // Convert pattern index buffer to number.
            lPatternOrderList.push(Number(ByteUtil.concatBytes(lPatternIndexBuffer)));

            lSongOrderPosition += lParseOptions.songOrder.byteSize;
        }
        lModule.pattern.songPositions = lPatternOrderList;

        // Sample head starting position.
        let lSampleHeadPosition: number = lParseOptions.sample.head.offset;
        let lSampleBodyPosition: number = lParseOptions.sample.body.offset;

        // Parse sample header.
        for (let lSampleIndex: number = 0; lSampleIndex < lParseOptions.sample.count; lSampleIndex++) {
            const lSample: Sample = lModule.samples.addSample(lSampleIndex);

            // Get sample data and parse.
            const lSampleHeadBuffer: Uint8Array = ByteUtil.readBytes(this.mData, lSampleHeadPosition, lParseOptions.sample.head.length);
            const lSampleHead: SampleHead = this.parseSampleHead(lSampleHeadBuffer);

            // Fill sample data.
            lSample.name = lSampleHead.name;
            lSample.fineTune = lSampleHead.fineTune;
            lSample.volume = lSampleHead.volume;
            lSample.setRepeatInformation(lSampleHead.repeatOffset, lSampleHead.repeatLength);

            // Retrieve and parse sample body.
            const lSampleBodyBuffer: Uint8Array = ByteUtil.readBytes(this.mData, lSampleBodyPosition, lSampleHead.length * lParseOptions.sample.body.byteSize);
            lSample.data = this.parseSampleBody(lSampleBodyBuffer);

            // Move position cursor.
            lSampleHeadPosition += lParseOptions.sample.head.length;
            lSampleBodyPosition += lSampleHead.length * lParseOptions.sample.body.byteSize;
        }

        return lModule;
    }

    /**
     * Caluculate parse options based on raw module data.
     * @param pData - Module byte data.
     */
    protected abstract calculateModuleParseOptions(pData: Uint8Array): ModuleParseOptions;

    /**
     * Parse channel as effect list only.
     * Result effect are looked up as byte pattern of effect parser.
     * 
     * Example: 1001 0000 0101 => 
     * Effect | Param1 | Param2
     * 1001   | 0000   | 0101
     * So the effect pattern would be.
     * "1001xxxxyyyy"
     * 
     * @param pChannelData - Bytes only of channel.
     */
    protected abstract parseChannel(pChannelData: Uint8Array): Array<ChannelValue>;

    /**
     * Parse sample head data.
     * Sample name doesn't get trimmed.
     * @param pSampleHeadData - Bytes only of sample head.
     */
    protected abstract parseSampleHead(pSampleHeadData: Uint8Array): SampleHead;

    /**
     * Parse sample body data.
     * Data should range between 0 and 1.
     * @param pSampleBodyData - Bytes only of sample body.
     */
    protected abstract parseSampleBody(pSampleBodyData: Uint8Array): Float32Array;
}

export type ModuleParseOptions = {
    name: ModuleNameParseOptions;
    pattern: ModulePatternParseOptions;
    sample: ModuleSampleParseOptions;
    songOrder: ModuleSongOrderParseOption;
};

export type ModuleNameParseOptions = {
    offset: number;
    length: number;
    emptyValue: number;
};

export type ModulePatternParseOptions = {
    count: number;
    offset: number;
    division: {
        count: number;
    };
    channel: {
        count: number;
        length: number;
    };
};

export type ModuleSongOrderParseOption = {
    offset: number;
    count: number,
    byteSize: number;
};

export type ModuleSampleParseOptions = {
    count: number;
    head: {
        offset: number;
        length: number;
    };
    body: {
        offset: number;
        byteSize: number;
    };
};

export type SampleHead = {
    name: string;
    volume: number;
    fineTune: number;
    repeatOffset: number;
    repeatLength: number;
    length: number;
};
