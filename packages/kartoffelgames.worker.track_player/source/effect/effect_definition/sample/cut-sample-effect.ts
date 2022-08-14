import { StatefullSerializeable } from '@kartoffelgames/core.serializer';
import { IGenericEffect } from '../i-generic-effect';

/**
 * Sample cut effect.
 */
@StatefullSerializeable('413db579-c8e3-405c-981c-3a791ac45259')
export class CutSampleEffect implements IGenericEffect {
    private mTicks: number;

    /**
     * Get ticks after the sample is cut.
     */
    public get ticks(): number {
        return this.mTicks;
    }

    /**
     * Set ticks after the sample is cut.
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