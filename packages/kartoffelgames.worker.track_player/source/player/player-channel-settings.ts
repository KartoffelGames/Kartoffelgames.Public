import { Pitch } from '../enum/pitch.enum';
import { WaveformTarget } from '../enum/waveform-target.enum';
import { Sample } from '../generic_module/sample/sample';

// TODO: Retructurize.
export class PlayerChannelSettings {
    private mFinetune: number;
    private mInvertLoop: boolean;
    private mPitch: Pitch;
    private readonly mSampleData: SampleData;
    private mVolume: number;
    private readonly mWaveformPositions: WaveformPositions;
    private mPanning: number;

    /**
     * Current channel finetune.
     */
    public get finetune(): number {
        return this.mFinetune;
    } set finetune(pFinetune: number) {
        this.mFinetune = pFinetune;
    }

    /**
     * If loop should be inverted.
     */
    public get invertLoop(): boolean {
        return this.mInvertLoop;
    } set invertLoop(pInvertLoop: boolean) {
        this.mInvertLoop = pInvertLoop;
    }

    /**
     * Channel panning.
     * Range from -1 (full left) to 1 (full right).
     */
    public get panning(): number {
        return this.mPanning;
    } set panning(pPanning: number) {
        this.mPanning = pPanning;
    }

    /**
     * Current channel pitch.
     */
    public get pitch(): Pitch {
        return this.mPitch;
    } set pitch(pPitch: Pitch) {
        this.mPitch = pPitch;
    }

    /**
     * Get sample information.
     */
    public get sampleData() {
        return {
            sample: this.mSampleData.sample,
            position: this.mSampleData.position
        } as const;
    }

    /**
     * Current channel volume.
     */
    public get volume(): number {
        return this.mVolume;
    } set volume(pVolume: number) {
        this.mVolume = pVolume;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mFinetune = 0;
        this.mInvertLoop = false;
        this.mPitch = Pitch.Empty;
        this.mVolume = 0;
        this.mPanning = 0;
        this.mSampleData = {
            sample: null,
            position: 0
        };
        this.mWaveformPositions = {
            vibrato: 0,
            tremolo: 0
        };
    }

    /**
     * Get waveform position.
     * @param pTarget - Position set target.
     */
    public getWaveformPosition(pTarget: WaveformTarget): number {
        if (pTarget === WaveformTarget.Tremolo) {
            return this.mWaveformPositions.tremolo;
        } else {
            return this.mWaveformPositions.vibrato;
        }
    }

    /**
     * Set channels sample. Does reset sample position. 
     * @param pSample - Sample.
     */
    public setSample(pSample: Sample): void {
        this.mSampleData.sample = pSample;
        this.mSampleData.position = 0;
    }

    /**
     * Set channels sample position.
     * @param pBytePosition - Byte position of next sample.
     */
    public setSamplePosition(pBytePosition: number): void {
        this.mSampleData.position = pBytePosition;
    }

    /**
     * Set waveform position.
     * When position is greater than 1, the relative position from zero is preserved and not reset.
     * @param pTarget - Position set target.
     * @param pPosition - New position between 0 and 1.
     */
    public setWaveformPosition(pTarget: WaveformTarget, pPosition: number): void {
        // Position boundary between 0 and 1.
        // When position is greater than 1, the relative position from zero is preserved and not reset.
        const lPosition: number = Math.max(Math.min(pPosition % 1, 1), 0);

        if (pTarget === WaveformTarget.Tremolo) {
            this.mWaveformPositions.tremolo = lPosition;
        } else {
            this.mWaveformPositions.vibrato = lPosition;
        }
    }
}

interface SampleData {
    sample: Sample | null,
    position: number;
}

interface WaveformPositions {
    tremolo: number;
    vibrato: number;
}