import { StatefullSerializeable } from '@kartoffelgames/core.serializer';
import { IGenericEffect } from '../i-generic-effect';

/**
 * Set glissando effect.
 */
@StatefullSerializeable('f498e24d-3454-4b63-868b-be02e4cb5ec5')
export class SetGlissandoEffect implements IGenericEffect {
    private mEnabled: boolean;

    /**
     * Get state of glissando.
     */
    public get enabled(): boolean {
        return this.mEnabled;
    }

    /**
     * Get state of glissando.
     */
    public set enabled(pEnabled: boolean) {
        this.mEnabled = pEnabled;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mEnabled = false;
    }
}