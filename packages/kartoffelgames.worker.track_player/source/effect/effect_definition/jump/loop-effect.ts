import { StatefullSerializeable } from '@kartoffelgames/core.serializer';
import { IGenericEffect } from '../i-generic-effect';

/**
 * Loop effect.
 */
@StatefullSerializeable('c585e578-4246-4e2a-afab-fb586457e4ab')
export class LoopEffect implements IGenericEffect {
    private mLoopCount: number;

    /**
     * Get loop count.
     */
    public get loopCount(): number {
        return this.mLoopCount;
    }

    /**
     * Set loop count.
     */
    public set loopCount(pIndex: number) {
        this.mLoopCount = pIndex;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mLoopCount = 0;
    }
}