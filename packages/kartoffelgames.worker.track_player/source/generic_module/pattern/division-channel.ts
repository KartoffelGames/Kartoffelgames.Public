
import { List } from '@kartoffelgames/core.data';
import { IGenericEffect } from '../interface/i-generic-effect';

export class DivisionChannel {
    private readonly mEffectList: List<IGenericEffect>;

    /**
     * Set effect.
     */
    public get effects(): Array<IGenericEffect> {
        return this.mEffectList;
    }

    /**
     * Constructor.
     * Set empty information.
     */
    public constructor() {
        this.mEffectList = new List<IGenericEffect>();
    }

    /**
     * Remove a set effect. Can be the original effect or only effect of the same type.
     * @param pEffect - Effect. Or only effect with the same type.
     */
    public removeEffect(pEffect: IGenericEffect): void {
        // Find same type of effect.
        const lSameEffectType: IGenericEffect | undefined = this.mEffectList.find((pAppliedEffect: IGenericEffect) => {
            return pAppliedEffect.constructor === pEffect.constructor;
        });

        // Remove old effect of same type.
        if (typeof lSameEffectType !== 'undefined') {
            this.mEffectList.remove(lSameEffectType);
        }
    }

    /**
     * Set effect. Only one type of effect can be applyed at once.
     * Same types are replaced.
     */
    public setEffect(pEffect: IGenericEffect): void {
        // Find same type of effect.
        const lSameEffectType: IGenericEffect | undefined = this.mEffectList.find((pAppliedEffect: IGenericEffect) => {
            return pAppliedEffect.constructor === pEffect.constructor;
        });

        // Remove old effect of same type.
        if (typeof lSameEffectType !== 'undefined') {
            this.mEffectList.remove(lSameEffectType);
        }

        this.mEffectList.push(pEffect);
    }
}