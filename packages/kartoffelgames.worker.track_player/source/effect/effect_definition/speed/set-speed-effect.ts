import { IGenericEffect } from '../i-generic-effect';

/**
 * Set speed effect.
 */
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