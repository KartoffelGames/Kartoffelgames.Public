import { StatefullSerializeable } from '@kartoffelgames/core-serializer';
import { IGenericEffect } from '../i-generic-effect.ts';

/**
 * Sample offset effect.
 */
@StatefullSerializeable('5f87532e-eb80-4e0b-8563-b5530f4d8f0c')
export class SampleOffsetEffect implements IGenericEffect {
    private mOffset: number;

    /**
     * Get sample offset.
     */
    public get offset(): number {
        return this.mOffset;
    }

    /**
     * Set sample offset.
     */
    public set offset(pOffset: number) {
        this.mOffset = pOffset;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mOffset = 0;
    }
}