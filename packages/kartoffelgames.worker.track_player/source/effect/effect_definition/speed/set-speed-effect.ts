import { StatefullSerializeable } from '@kartoffelgames/core.serializer';
import { IGenericEffect } from '../i-generic-effect';

/**
 * Set speed effect.
 */
@StatefullSerializeable('1641d552-51fc-4f24-8e01-52a29de9271c')
export class SetSpeedEffect implements IGenericEffect {
    private mSpeed: number;

    /**
     * Get speed.
     */
    public get speed(): number {
        return this.mSpeed;
    }

    /**
     * Set speed.
     */
    public set speed(pVolume: number) {
        this.mSpeed = pVolume;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mSpeed = 0;
    }
}