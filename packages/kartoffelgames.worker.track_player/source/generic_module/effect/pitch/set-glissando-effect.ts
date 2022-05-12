import { IGenericEffect } from '../../interface/i-generic-effect';

/**
 * Set glissando effect.
 */
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