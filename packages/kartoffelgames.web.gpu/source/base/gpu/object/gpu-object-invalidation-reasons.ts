import { Exception } from '@kartoffelgames/core';

export class GpuObjectInvalidationReasons<TReasons extends string> {
    private mDeconstruct: boolean;
    private mLifeTimeReached: boolean;
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
     * Life time was reached.
     */
    public get lifeTimeReached(): boolean {
        return this.mLifeTimeReached;
    } set lifeTimeReached(pLifeTimeReached: boolean) {
        this.mLifeTimeReached = pLifeTimeReached;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mReasons = new Set<TReasons>();
        this.mLifeTimeReached = false;
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
        return this.mReasons.size > 0 || this.mLifeTimeReached || this.mDeconstruct;
    }

    /**
     * Clear all reasons.
     */
    public clear(): void {
        this.mLifeTimeReached = false;
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