
export class EffectProcessEvent {
    private mIgnorePitch: boolean;
    private mIgnoreSample: boolean;
    private readonly mData: EffectProcessEventData;

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

    public constructor(pParameterX: number, pParameterY: number, pPitch: number, pSample: number) {
        // Default.
        this.mIgnorePitch = false;
        this.mIgnoreSample = false;

        // Create data object.
        this.mData = {
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
    parameter: {
        first: number;
        second: number;
    };
    pitch: number;
    sample: number;
};