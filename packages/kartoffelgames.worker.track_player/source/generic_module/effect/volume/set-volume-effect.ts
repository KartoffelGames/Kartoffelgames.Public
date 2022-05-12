import { IGenericEffect } from '../../interface/i-generic-effect';

/**
 * Sample volume slide effect.
 */
export class SetVolumeEffect implements IGenericEffect {
    private mVolume: number;

    /**
     * Get volume.
     */
    public get volume(): number {
        return this.mVolume;
    }

    /**
     * Set volume.
     */
    public set volume(pVolume: number) {
        this.mVolume = pVolume;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mVolume = 1;
    }
}