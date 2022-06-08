import { WaveformTarget } from '../../../enum/waveform-target.enum';
import { Waveform } from '../../../enum/waveform.enum';

// TODO: What is this cursed name??? 
export class SettingsSettings {
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

    /**
     * Reset pattern related settings.
     */
    public resetPatternSettings(): void {
        // TODO:
    }
}