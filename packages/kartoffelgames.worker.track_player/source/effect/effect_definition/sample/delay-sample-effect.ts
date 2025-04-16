import { StatefullSerializeable } from '@kartoffelgames/core.serializer';
import { IGenericEffect } from '../i-generic-effect';

/**
 * Sample delay effect.
 */
@StatefullSerializeable('bff7a452-d645-4264-a132-d996bb37f5c1')
export class DelaySampleEffect implements IGenericEffect {
    private mTicks: number;

    /**
     * Get ticks after the sample is played.
     */
    public get ticks(): number {
        return this.mTicks;
    }

    /**
     * Set ticks after the sample is played.
     */
    public set ticks(pOffset: number) {
        this.mTicks = pOffset;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mTicks = 0;
    }
}