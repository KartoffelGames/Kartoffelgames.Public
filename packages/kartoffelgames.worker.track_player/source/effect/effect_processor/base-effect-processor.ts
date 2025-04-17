import { EffectPriority } from '../../enum/effect-priority.enum.ts';
import { PlayerChannelSettings } from '../../player/player-channel-settings.ts';
import { PlayerGlobalSettings } from '../../player/global_settings/player-global-settings.ts';
import { IGenericEffect } from '../effect_definition/i-generic-effect.ts';

export abstract class BaseEffectProcessor<TEffect extends IGenericEffect>  {
    private readonly mEffect: TEffect;
    private readonly mChannelSettings: PlayerChannelSettings;
    private readonly mGlobalSettings: PlayerGlobalSettings;

    /**
     * Priority in wich effects should be applied.
     */
    public abstract readonly priority: EffectPriority;

    /**
     * Get effect data.
     */
    protected get effectData(): TEffect {
        return this.mEffect;
    }

    /**
     * Get channel settings.
     */
    protected get channelSettings(): PlayerChannelSettings {
        return this.mChannelSettings;
    }

    /**
     * Get global player settings.
     */
    protected get globalSettings(): PlayerGlobalSettings {
        return this.mGlobalSettings;
    }

    /**
     * Constructor.
     * @param pEffect - Effect data.
     * @param pChannelSettings - Current channels settings.
     * @param pGlobalSettings - Global player module.
     */
    public constructor(pEffect: TEffect, pChannelSettings: PlayerChannelSettings, pGlobalSettings: PlayerGlobalSettings) {
        this.mEffect = pEffect;
        this.mChannelSettings = pChannelSettings;
        this.mGlobalSettings = pGlobalSettings;
    }

    /**
     * On effect end.
     */
    public onEffectEnd(): void {
        // Does nothing. Overrideable
    }

    /**
     * On effect start.
     */
    public onEffectStart(): void {
        // Does nothing. Overrideable
    }

    /**
     * Process effect and get last
     * @param _pTickChanged - If tick has changed since last process.
     */
    public onProcess(_pTickChanged: boolean): void {
        // Does nothing. Overrideable
    }
}