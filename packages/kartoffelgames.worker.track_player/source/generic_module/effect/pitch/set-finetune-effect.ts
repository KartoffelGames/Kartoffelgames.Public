import { IGenericEffect } from '../../interface/i-generic-effect';

/**
 * Sample finetune effect.
 */
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