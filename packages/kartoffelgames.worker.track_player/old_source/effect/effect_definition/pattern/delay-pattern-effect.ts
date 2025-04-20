import { StatefullSerializeable } from '@kartoffelgames/core-serializer';
import { IGenericEffect } from '../i-generic-effect.ts';

/**
 * Sample delay effect.
 */
@StatefullSerializeable('9aca6964-f76d-447f-8d7e-5b8c70ffdb3e')
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