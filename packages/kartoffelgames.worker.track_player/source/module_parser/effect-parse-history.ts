import { Dictionary } from '@kartoffelgames/core.data';
import { IGenericEffect } from '../effect/effect_definition/i-generic-effect';

export class EffectParseHistory {
    private readonly mLastEffectType: Dictionary<EffectConstructor<any>, IGenericEffect>;

    /**
     * Constructor.
     */
    public constructor() {
        this.mLastEffectType = new Dictionary<EffectConstructor<any>, IGenericEffect>();
    }

    /**
     * Add effect to history.
     * @param pEffect - Effect.
     */
    public add(pEffect: IGenericEffect): void {
        // Get effect constructor and override last effect of this type.
        const lConstructor: EffectConstructor<any> = <any>pEffect.constructor;
        this.mLastEffectType.set(lConstructor, pEffect);
    }

    /**
     * Get last parsed effect of set type.
     * @param pEffectConstructor - Effect type.
     */
    public last<K extends IGenericEffect>(pEffectConstructor: EffectConstructor<K>): K | undefined {
        return <K | undefined>this.mLastEffectType.get(pEffectConstructor);
    }
}

type EffectConstructor<T extends IGenericEffect> = new () => T;
