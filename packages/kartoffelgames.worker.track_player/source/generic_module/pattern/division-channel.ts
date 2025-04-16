
import { StatefullSerializeable } from '@kartoffelgames/core.serializer';
import { IGenericEffect } from '../../effect/effect_definition/i-generic-effect';

@StatefullSerializeable('3fd4b733-df66-4499-819a-78002d25b649')
export class DivisionChannel {
    private readonly mEffectList: Array<IGenericEffect>;

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
        this.mEffectList = new Array<IGenericEffect>();
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
            const lEffectIndex: number = this.mEffectList.indexOf(lSameEffectType);
            if (lEffectIndex !== -1) {
                this.mEffectList.splice(lEffectIndex, 1);
            }
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
            const lEffectIndex: number = this.mEffectList.indexOf(lSameEffectType);
            if (lEffectIndex !== -1) {
                this.mEffectList.splice(lEffectIndex, 1);
            }
        }

        this.mEffectList.push(pEffect);
    }
}