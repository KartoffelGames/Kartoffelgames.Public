import { StatefullSerializeable } from '@kartoffelgames/core-serializer';
import { IGenericEffect } from '../i-generic-effect.ts';

/**
 * Sample set effect.
 */
@StatefullSerializeable('4d89d145-7a92-4639-bebf-cfaa916e77ff')
export class SetSampleEffect implements IGenericEffect {
    private mSampleIndex: number;

    /**
     * Get sample index.
     */
    public get sampleIndex(): number {
        return this.mSampleIndex;
    }

    /**
     * Set sample index.
     */
    public set sampleIndex(pOffset: number) {
        this.mSampleIndex = pOffset;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mSampleIndex = 0;
    }
}