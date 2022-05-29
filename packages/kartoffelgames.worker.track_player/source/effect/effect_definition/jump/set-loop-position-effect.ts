import { IGenericEffect } from '../i-generic-effect';

/**
 * Set pattern loop position effect.
 */
export class SetLoopPositionEffectEffect implements IGenericEffect {
    private mDivisionIndex: number;

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
     * Constructor.
     */
    public constructor() {
        this.mDivisionIndex = 0;
    }
}