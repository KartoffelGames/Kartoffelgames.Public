export class GpuObjectInvalidationReasons<TReasons extends string> {
    private readonly mReasons: Set<GpuObjectInvalidationReason | TReasons>;

    /**
     * Constructor.
     */
    public constructor() {
        this.mReasons = new Set<GpuObjectInvalidationReason | TReasons>();
    }

    /**
     * Add update reason.
     * @param pReason - Update reason.
     */
    public add(pReason: GpuObjectInvalidationReason | TReasons): void {
        this.mReasons.add(pReason);
    }

    /**
     * If update reason has any existing reason.
     */
    public any(): boolean {
        return this.mReasons.size > 0;
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
    public has(pReason: GpuObjectInvalidationReason | TReasons): boolean {
        return this.mReasons.has(pReason);
    }
}

/**
 * Update reason.
 */
export enum GpuObjectInvalidationReason {
    Deconstruct = '_Deconstruction',
    LifeTime = '_ LifeTimeEndReached',
}