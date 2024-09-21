export class GpuObjectUpdateReason {
    private readonly mReasons: Set<UpdateReason>;

    /**
     * Constructor.
     */
    public constructor() {
        this.mReasons = new Set<UpdateReason>();
    }

    /**
     * Add update reason.
     * @param pReason - Update reason.
     */
    public add(pReason: UpdateReason): void {
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
    public has(pReason: UpdateReason): boolean {
        return this.mReasons.has(pReason);
    }
}

/**
 * Update reason.
 */
export enum UpdateReason {
    Setting = 1,
    Data = 2,
    ChildData = 3,
    LifeTime = 4
}