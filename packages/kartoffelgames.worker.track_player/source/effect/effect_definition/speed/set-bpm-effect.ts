import { StatefullSerializeable } from '@kartoffelgames/core.serializer';
import { IGenericEffect } from '../i-generic-effect';

/**
 * Set beats per minute effect.
 */
@StatefullSerializeable('371d3e18-350a-4737-8fb2-f6dee52e031c')
export class SetBeatsPerMinuteEffect implements IGenericEffect {
    private mBeatsPerMinute: number;

    /**
     * Get beats per minute.
     */
    public get beatsPerMinute(): number {
        return this.mBeatsPerMinute;
    }

    /**
     * Set beats per minute.
     */
    public set beatsPerMinute(pVolume: number) {
        this.mBeatsPerMinute = pVolume;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mBeatsPerMinute = 0;
    }
}