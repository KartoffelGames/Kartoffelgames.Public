import { IGenericEffect } from '../../interface/i-generic-effect';

/**
 * Loop effect.
 */
export class LoopEffect implements IGenericEffect {
    private mLoopCount: number;

    /**
     * Get loop count.
     */
    public get loopCount(): number {
        return this.mLoopCount;
    }

    /**
     * Set loop count.
     */
    public set loopCount(pIndex: number) {
        this.mLoopCount = pIndex;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mLoopCount = 0;
    }
}