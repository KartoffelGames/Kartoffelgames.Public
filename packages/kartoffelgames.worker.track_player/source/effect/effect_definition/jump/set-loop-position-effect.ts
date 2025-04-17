import { StatefullSerializeable } from '@kartoffelgames/core-serializer';
import { IGenericEffect } from '../i-generic-effect.ts';

/**
 * Set pattern loop position effect.
 */
@StatefullSerializeable('770f4945-4e1a-423e-a7c0-b86074ed6a9f')
export class SetLoopPositionEffectEffect implements IGenericEffect {
    private mDivisionIndex: number;

    /**
     * Get division index.
     */
    public get divisionIndex(): number {
        return this.mDivisionIndex;
    }

    /**
     * Get division index.
     */
    public set divisionIndex(pIndex: number) {
        this.mDivisionIndex = pIndex;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mDivisionIndex = 0;
    }
}