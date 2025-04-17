import { StatefullSerializeable } from '@kartoffelgames/core-serializer';
import { IGenericEffect } from '../i-generic-effect.ts';

/**
 * Sample retrigger effect.
 */
@StatefullSerializeable('4b8bbb2f-d1ed-490c-ac37-0aae07a66b99')
export class RetriggerSampleEffect implements IGenericEffect {
    private mRetriggerTickInterval: number;

    /**
     * Get tick interval.
     */
    public get tickInterval(): number {
        return this.mRetriggerTickInterval;
    }

    /**
     * Set tick interval.
     */
    public set tickInterval(pInterval: number) {
        this.mRetriggerTickInterval = pInterval;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mRetriggerTickInterval = 0;
    }
}