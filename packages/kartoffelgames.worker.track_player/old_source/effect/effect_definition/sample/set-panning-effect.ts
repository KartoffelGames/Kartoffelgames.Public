import { StatefullSerializeable } from '@kartoffelgames/core-serializer';
import { IGenericEffect } from '../i-generic-effect.ts';

/**
 * Set panning effect.
 */
@StatefullSerializeable('a82c0549-79ef-4059-b0bc-f969fda0d012')
export class SetPanningEffect implements IGenericEffect {
    private mPanning: number;

    /**
     * Get sample offset.
     */
    public get panning(): number {
        return this.mPanning;
    }

    /**
     * Set sample offset.
     */
    public set panning(pOffset: number) {
        this.mPanning = pOffset;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mPanning = 0;
    }
}