import { Exception } from '@kartoffelgames/core';

/**
 * Reason list why a gpu object was invalidated.
 */
export class GpuObjectInvalidationReasons<TReasons extends string> {
    private mDeconstruct: boolean;
    private readonly mReasons: Set<TReasons>;

    /**
     * Life time was reached.
     */
    public get deconstruct(): boolean {
        return this.mDeconstruct;
    } set deconstruct(pDeconstruct: boolean) {
        if (!pDeconstruct) {
            throw new Exception(`Deconstruct reason can not be reverted. Sadly.`, this);
        }

        this.mDeconstruct = pDeconstruct;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mReasons = new Set<TReasons>();
        this.mDeconstruct = false;
    }

    /**
     * Add update reason.
     * @param pReason - Update reason.
     */
    public add(pReason: TReasons): void {
        this.mReasons.add(pReason);
    }

    /**
     * If update reason has any existing reason.
     */
    public any(): boolean {
        return this.mReasons.size > 0  || this.mDeconstruct;
    }

    /**
     * Clear all reasons.
     */
    public clear(): void {
        this.mReasons.clear();
    }

    /**
     * Check for update reason.
     * @param pReason - Update reason.
     */
    public has(pReason: TReasons): boolean {
        return this.mReasons.has(pReason);
    }
}