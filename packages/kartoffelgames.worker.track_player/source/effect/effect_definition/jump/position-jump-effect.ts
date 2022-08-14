import { StatefullSerializeable } from '@kartoffelgames/core.serializer';
import { IGenericEffect } from '../i-generic-effect';

/**
 * Jump effect.
 */
@StatefullSerializeable('7ba5c774-d66e-4f58-a23d-49a2973aa4a3')
export class PositionJumpEffect implements IGenericEffect {
    private mDivisionIndex: number;
    private mSongPositionIndex: number;

    /**
     * Get division index.
     */
    public get divisionIndex(): number {
        return this.mDivisionIndex;
    }

    /**
     * Get division index.
     */
    public set divisionIndex(pIndex: number) {
        this.mDivisionIndex = pIndex;
    }

    /**
     * Get song position index.
     */
    public get songPositionIndex(): number {
        return this.mSongPositionIndex;
    }

    /**
     * Get song position index.
     */
    public set songPositionIndex(pIndex: number) {
        this.mSongPositionIndex = pIndex;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mDivisionIndex = 0;
        this.mSongPositionIndex = 0;
    }
}