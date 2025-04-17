import { StatefullSerializeable } from '@kartoffelgames/core-serializer';
import { IGenericEffect } from '../i-generic-effect.ts';

/**
 * Sample volume slide effect.
 */
@StatefullSerializeable('cc8156b4-f9ff-4eba-94fb-2640f525bac2')
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