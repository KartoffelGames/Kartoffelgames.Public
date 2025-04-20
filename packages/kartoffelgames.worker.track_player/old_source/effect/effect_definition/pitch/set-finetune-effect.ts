import { StatefullSerializeable } from '@kartoffelgames/core-serializer';
import { IGenericEffect } from '../i-generic-effect.ts';

/**
 * Sample finetune effect.
 */
@StatefullSerializeable('a0572a01-adc4-479b-b874-7969d26ef0c8')
export class SetFinetuneEffect implements IGenericEffect {
    private mFinetune: number;

    /**
     * Get finetune.
     */
    public get finetune(): number {
        return this.mFinetune;
    }

    /**
     * Set finetune.
     */
    public set finetune(pFinetune: number) {
        this.mFinetune = pFinetune;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mFinetune = 0;
    }
}