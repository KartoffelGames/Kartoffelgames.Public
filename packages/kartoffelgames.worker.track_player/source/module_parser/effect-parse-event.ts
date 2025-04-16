import { EffectParseHistory } from './effect-parse-history';

export class EffectParseEvent {
    private mIgnorePitch: boolean;
    private mIgnoreSample: boolean;
    private readonly mHistory: EffectParseHistory;
    private readonly mData: EffectProcessEventData;

    /**
     * Get parse history of current channel. 
     */
    public get history(): EffectParseHistory {
        return this.mHistory;
    }

    /**
     * Ignore pitch processing.
     */
    public get ignorePitch(): boolean {
        return this.mIgnorePitch;
    }

    /**
     * Ignore sample processing.
     */
    public get ignoreSample(): boolean {
        return this.mIgnoreSample;
    }

    /**
     * Get effect processing data.
     */
    public get data(): EffectProcessEventData {
        return this.mData;
    }

    /**
     * Constructor.
     * @param pChannelIndex - Channel index.
     * @param pHistory - Effect parse history for current channel.
     * @param pParameterX - Effect parameter one.
     * @param pParameterY - Effect parameter two.
     * @param pPitch - Channels pitch.
     * @param pSample - Channels sample.
     */
    public constructor(pChannelIndex: number, pHistory: EffectParseHistory, pParameterX: number, pParameterY: number, pPitch: number, pSample: number) {
        // Default.
        this.mIgnorePitch = false;
        this.mIgnoreSample = false;
        this.mHistory = pHistory;

        // Create data object.
        this.mData = {
            channelIndex: pChannelIndex,
            parameter: {
                first: pParameterX,
                second: pParameterY
            },
            pitch: pPitch,
            sample: pSample
        };
    }

    /**
     * Prevent pitch processing.
     */
    public preventPitch(): void {
        this.mIgnorePitch = true;
    }

    /**
     * Prevent sample processing.
     */
    public preventSample(): void {
        this.mIgnoreSample = true;
    }
}

type EffectProcessEventData = {
    channelIndex: number;
    parameter: {
        first: number;
        second: number;
    };
    pitch: number;
    sample: number;
};