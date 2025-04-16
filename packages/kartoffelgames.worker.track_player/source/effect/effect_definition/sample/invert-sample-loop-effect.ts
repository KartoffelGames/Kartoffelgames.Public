import { StatefullSerializeable } from '@kartoffelgames/core.serializer';
import { IGenericEffect } from '../i-generic-effect';

/**
 * Sample loop invert effect.
 */
@StatefullSerializeable('111c5fcf-ae55-4f1d-8d5a-77f385129ce5')
export class InvertSampleLoopEffect implements IGenericEffect {
    private mInvert: boolean;

    /**
     * Get if loop should be inverted.
     */
    public get invert(): boolean {
        return this.mInvert;
    }

    /**
     * Set if loop should be inverted.
     */
    public set invert(pOffset: boolean) {
        this.mInvert = pOffset;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mInvert = false;
    }
}