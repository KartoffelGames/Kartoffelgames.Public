export class ComputeParameter {
    private readonly mWorkgroupCountX: number;
    private readonly mWorkgroupCountY?: number | undefined;
    private readonly mWorkgroupCountZ?: number | undefined;

    /**
     * Workgroup count on X axis.
     */
    public get workgroupCountX(): number {
        return this.mWorkgroupCountX;
    }

    /**
     * Workgroup count on Y axis.
     */
    public get workgroupCountY(): number {
        return this.mWorkgroupCountY ?? 1;
    }

    /**
     * Workgroup count on Z axis.
     */
    public get workgroupCountZ(): number {
        return this.mWorkgroupCountZ ?? 1;
    }

    /**
     * 
     * @param pX - Workgroup count on X axis.
     * @param pY - Workgroup count on Y axis.
     * @param pZ - Workgroup count on Z axis.
     */
    public constructor(pX: number, pY?: number, pZ?: number) {
        this.mWorkgroupCountX = pX;
        this.mWorkgroupCountY = pY;
        this.mWorkgroupCountZ = pZ;
    }
}