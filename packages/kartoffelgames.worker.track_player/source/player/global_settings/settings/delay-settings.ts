
export class DelaySettings {
    private mGlissandoEnabled: boolean;

    /**
     * Get if glissando is enabled.
     */
    public get glissandoEnabled(): boolean {
        return this.mGlissandoEnabled;
    }

    /**
     * Set if glissando is enabled.
     */
    public set glissandoEnabled(pEnabled: boolean) {
        this.mGlissandoEnabled = pEnabled;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mGlissandoEnabled = false;
    }
}