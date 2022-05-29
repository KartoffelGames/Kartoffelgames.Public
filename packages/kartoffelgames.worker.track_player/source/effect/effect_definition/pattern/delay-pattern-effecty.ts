import { IGenericEffect } from '../i-generic-effect';

/**
 * Sample delay effect.
 */
export class DelayPatternEffect implements IGenericEffect {
    private mDivisions: number;

    /**
     * Get division after the pattern is played.
     */
    public get divisions(): number {
        return this.mDivisions;
    }

    /**
     * Set division after the pattern is played.
     */
    public set divisions(pOffset: number) {
        this.mDivisions = pOffset;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mDivisions = 0;
    }
}