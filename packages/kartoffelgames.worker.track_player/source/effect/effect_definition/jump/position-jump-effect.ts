import { StatefullSerializeable } from '@kartoffelgames/core.serializer';
import { IGenericEffect } from '../i-generic-effect';

/**
 * Jump effect.
 */
@StatefullSerializeable('7ba5c774-d66e-4f58-a23d-49a2973aa4a3')
export class PositionJumpEffect implements IGenericEffect {
    private mDivisionIndex: number;
    private mSongPositionIndex: number;
    private mSongPositionShiftMode: boolean;

    /**
     * Division index.
     */
    public get divisionIndex(): number {
        return this.mDivisionIndex;
    } set divisionIndex(pIndex: number) {
        this.mDivisionIndex = pIndex;
    }

    /**
     * Song position index or shift value based on shift mode.
     */
    public get songPosition(): number {
        return this.mSongPositionIndex;
    } set songPosition(pIndex: number) {
        this.mSongPositionIndex = pIndex;
    }

    /**
     * Song position shift mode.
     */
    public get songPositionShiftMode(): boolean {
        return this.mSongPositionShiftMode;
    } set songPositionShiftMode(pIndex: boolean) {
        this.mSongPositionShiftMode = pIndex;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mDivisionIndex = 0;
        this.mSongPositionIndex = 0;
        this.mSongPositionShiftMode = false;
    }
}