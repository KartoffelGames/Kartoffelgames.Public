import { WaveformTarget } from '../../../enum/waveform-target.enum';
import { Waveform } from '../../../enum/waveform.enum';

export class SettingsSettings {
    private mGlissandoEnabled: boolean;
    private readonly mWaveformSetting: WaveformSettings;

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
        this.mWaveformSetting = {
            vibrato: {
                waveform: Waveform.Sine,
                retrigger: true
            },
            tremolo: {
                waveform: Waveform.Sine,
                retrigger: true
            }
        };
    }

    /**
     * Get waveform of target.
     * @param pTarget - Setting target.
     */
    public getWaveform(pTarget: WaveformTarget): WaveformSetting {
        if (pTarget === WaveformTarget.Tremolo) {
            return {
                waveform: this.mWaveformSetting.tremolo.waveform,
                retrigger: this.mWaveformSetting.tremolo.retrigger
            };
        } else {
            return {
                waveform: this.mWaveformSetting.vibrato.waveform,
                retrigger: this.mWaveformSetting.vibrato.retrigger
            };
        }
    }

    /**
     * Reset pattern related settings.
     */
    public resetPatternSettings(): void {
        // TODO:
    }

    /**
     * Set global waveform of effects.
     * @param pWaveform - Waveform.
     * @param pTarget - Setting target.
     * @param pRetrigger - If waveform should retrigger after each division.
     */
    public setWaveform(pWaveform: Waveform, pTarget: WaveformTarget, pRetrigger: boolean): void {
        if (pTarget === WaveformTarget.Tremolo) {
            this.mWaveformSetting.tremolo.waveform = pWaveform;
            this.mWaveformSetting.tremolo.retrigger = pRetrigger;
        } else {
            this.mWaveformSetting.vibrato.waveform = pWaveform;
            this.mWaveformSetting.vibrato.retrigger = pRetrigger;
        }
    }
}

interface WaveformSetting {
    waveform: Waveform;
    retrigger: boolean;
}

interface WaveformSettings {
    vibrato: WaveformSetting;
    tremolo: WaveformSetting;
}