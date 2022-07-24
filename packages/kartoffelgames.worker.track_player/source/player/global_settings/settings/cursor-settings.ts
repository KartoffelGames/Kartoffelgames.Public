import { LengthSettings } from './length-settings';

export class CursorSettings {
    private mAudioSampleCursor: number;
    private mDivisionCursor: number;
    private readonly mModuleLengthInformation: LengthSettings;
    private mSongPositionCursor: number;
    private mTickCursor: number;

    /**
     * Get current audio sample index.
     */
    public get audioSampleCursor(): number {
        return this.mAudioSampleCursor;
    }

    /**
     * Get current division index.
     */
    public get divisionCursor(): number {
        return this.mDivisionCursor;
    }

    /**
     * Get current songPosition index.
     */
    public get songPositionCursor(): number {
        return this.mSongPositionCursor;
    }

    /**
     * Get current tick index.
     */
    public get tickCursor(): number {
        return this.mTickCursor;
    }

    /**
     * Constructor.
     * @param pLengthInformation - Module length calculator.
     */
    public constructor(pLengthInformation: LengthSettings) {
        this.mModuleLengthInformation = pLengthInformation;

        // Default.
        this.mSongPositionCursor = 0;
        this.mDivisionCursor = 0;
        this.mTickCursor = 0;
        this.mAudioSampleCursor = 0;

        // Reset cursor.
        this.restart();
    }

    /**
     * Jump to position.
     * @param pSongPosition - Song position index.
     * @param pDivision - Division index.
     */
    public jumpTo(pSongPosition: number, pDivision: number): void {
        // Set song position and division.
        this.mSongPositionCursor = pSongPosition;
        this.mDivisionCursor = pDivision;

        // Reset tick and sample.
        this.mAudioSampleCursor = 0;
        this.mTickCursor = 0;

        // TODO: Trigger cursor changes on 
    }

    /**
     * Move cursor one sample next. 
     */
    public next(): CursorChange {
        const lCursorChange = {
            songPosition: false,
            division: false,
            tick: false
        };

        // Check restart position.
        if (this.mSongPositionCursor === -1) {
            // Set everthing on change state.
            lCursorChange.songPosition = true;
            lCursorChange.division = true;
            lCursorChange.tick = true;

            // Set everything on first index.
            this.mAudioSampleCursor = 0;
            this.mTickCursor = 0;
            this.mDivisionCursor = 0;
            this.mSongPositionCursor = 0;
        } else {
            // Increment sample and check overflow.
            this.mAudioSampleCursor++;
            if (this.mAudioSampleCursor === this.mModuleLengthInformation.samples) {
                this.mAudioSampleCursor -= this.mModuleLengthInformation.samples;

                // Set change state, increment tick and check overflow.
                lCursorChange.tick = true;
                this.mTickCursor++;
                if (this.mTickCursor === this.mModuleLengthInformation.ticks) {
                    this.mTickCursor -= this.mModuleLengthInformation.ticks;

                    // Set change state, increment division and check overflow.
                    lCursorChange.division = true;
                    this.mDivisionCursor++;
                    if (this.mDivisionCursor === this.mModuleLengthInformation.divisions) {
                        this.mDivisionCursor -= this.mModuleLengthInformation.divisions;

                        // Set change state and increment song position. Song position can overflow.
                        lCursorChange.songPosition = true;
                        this.mSongPositionCursor++;
                    }
                }
            }
        }

        return lCursorChange;
    }

    /**
     * Restart cursor.
     */
    public restart(): void {
        this.mSongPositionCursor = -1;
        this.mDivisionCursor = -1;
        this.mTickCursor = -1;
        this.mAudioSampleCursor = -1;
    }
}

export interface CursorChange {
    songPosition: boolean;
    division: boolean;
    tick: boolean;
}