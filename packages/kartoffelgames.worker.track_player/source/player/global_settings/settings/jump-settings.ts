import { CursorSettings } from './cursor-settings';

export class JumpSettings {
    private readonly mCursor: CursorSettings;
    private mJumpSongPosition: JumpPosition | null;
    private readonly mLoopPosition: LoopPosition;

    /**
     * Constructor.
     * @param pCursor - Player cursor.
     */
    public constructor(pCursor: CursorSettings) {
        this.mCursor = pCursor;

        // Initialize with none working jump position. 
        this.mJumpSongPosition = null;
        this.mLoopPosition = {
            division: -1,
            counter: 0,
            loopCount: 0
        };
    }

    /**
     * Try to execute jump and return success.
     */
    public executeJump(): boolean {
        // Look for existing jump.
        if (this.mJumpSongPosition !== null) {
            // Execute jump.
            this.mCursor.jumpTo(this.mJumpSongPosition.songPosition, this.mJumpSongPosition.division);

            // Reset jump.
            this.mJumpSongPosition = null;

            return true;
        }

        return false;
    }

    /**
     * Reset loop position.
     */
    public resetLoop(): void {
        this.mLoopPosition.counter = 0;
        this.mLoopPosition.division = 0;
        this.mLoopPosition.loopCount = 0;
    }

    /**
     * Set single jump executed after this division.
     * @param pSongPosition - Song position for jump.
     * @param pDivisionIndex - Division index for jump.
     */
    public setJumpPosition(pSongPosition: number, pDivisionIndex: number): void {
        this.mJumpSongPosition = {
            songPosition: pSongPosition,
            division: pDivisionIndex
        };
    }

    /**
     * Activate loop after current division.
     * Cancels loop when loop count is reached.
     * Different loop count means different loop.
     * @param pLoopCount - Loop count.
     */
    public setLoop(pLoopCount: number): void {
        // Refresh only when another loop count is set.
        if (this.mLoopPosition.loopCount !== pLoopCount) {
            this.mLoopPosition.loopCount = pLoopCount;
            this.mLoopPosition.counter = 0;
        }

        // Set jump position only when loops are left.
        if (this.mLoopPosition.counter < this.mLoopPosition.loopCount) {
            this.mLoopPosition.counter++;
            this.setJumpPosition(this.mCursor.songPositionCursor, this.mLoopPosition.division);
        }
    }

    /**
     * Set loop position for this pattern.
     * @param pDivision - Set loop position.
     */
    public setLoopPosition(pDivision: number): void {   
        // Reset loop. Loop can uninteded without exit.
        this.resetLoop();

        this.mLoopPosition.division = pDivision;
    }
}

interface JumpPosition {
    songPosition: number;
    division: number;
}

interface LoopPosition {
    division: number;
    counter: number;
    loopCount: number;
}