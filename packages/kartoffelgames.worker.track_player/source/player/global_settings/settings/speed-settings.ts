export class SpeedSettings {
    private mSampleRate: number;
    private mBeatsPerMinute: number;
    private mSpeedUp: number;

    /**
     * Get sample rate.
     */
    public get sampleRate(): number {
        return this.mSampleRate;
    }

    /**
     * Get beats per minute.
     */
    public get beatsPerMinute(): number {
        return this.mBeatsPerMinute;
    }

    /**
     * Set beats per minute.
     */
    public set beatsPerMinute(pBeatsPerMinute: number) {
        this.mBeatsPerMinute = pBeatsPerMinute;
    }

    /**
     * Get speedUp.
     */
    public get speedUp(): number {
        return this.mSpeedUp;
    }

    /**
     * Set speedUp.
     */
    public set speedUp(pSpeedUp: number) {
        this.mSpeedUp = pSpeedUp;
    }

    /**
     * Constructor.
     * @param pModule - Playing module.
     * @param pSampleRate - Global sample rate.
     */
    public constructor(pSampleRate: number) {
        // Init speed information.
        this.mSampleRate = pSampleRate;
        this.mBeatsPerMinute = 125;
        this.mSpeedUp = 1;
    }
}