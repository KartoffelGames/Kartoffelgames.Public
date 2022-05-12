import { EffectBound } from '../../enum/effect-bound';
import { EffectPriority } from '../../enum/effect-priority';
import { IGenericEffect } from '../../generic_module/interface/i-generic-effect';
import { ChannelSettings } from '../player-channel';
import { PlayerModule } from '../player_module/player-module';

export abstract class BaseEffectProcessor<TEffect extends IGenericEffect>  {
    private readonly mEffect: TEffect;

    /**
     * If this effect should only be called once at division start.
     */
    public abstract readonly effectBound: EffectBound;

    /**
     * Priority in wich effects should be applied.
     */
    public abstract readonly priority: EffectPriority;

    /**
     * Effect data.
     */
    protected get effectData(): TEffect {
        return this.mEffect;
    }

    /**
     * Constructor.
     * @param pEffect - Effect data.
     */
    public constructor(pEffect: TEffect) {
        this.mEffect = pEffect;
    }

    /**
     * On effect end.
     */
    public onEffectEnd(): void {
        // Does nothing. Overrideable
    }

    /**
     * Process effect and get last
     * @param pSampleStep - Current next sample step.
     * @param pPlayerModule - Global player module.
     * @param pTickChanged - If tick has changed since last process.
     */
    public abstract process(pChannelSettings: ChannelSettings, pPlayerModule: PlayerModule, pTickChanged: boolean): ChannelSettings;
}