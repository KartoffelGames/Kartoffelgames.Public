import { PgslParserResultEntryPoint } from './pgsl-parser-result-entry-point.ts';

export class PgslParserResultComputeEntryPoint extends PgslParserResultEntryPoint {
    private readonly mWorkgroupSize: PgslParserResultComputeEntryPointWorkgroupSize;

    /**
     * Gets the workgroup size of the compute entry point.
     */
    public get workgroupSize(): PgslParserResultComputeEntryPointWorkgroupSize {
        return this.mWorkgroupSize;
    }

    /**
     * Creates a new compute entry point result.
     * 
     * @param pName - Entry point name.
     * @param pSizeX - Workgroup size X dimension.
     * @param pSizeY - Workgroup size Y dimension.
     * @param pSizeZ - Workgroup size Z dimension.
     */
    public constructor(pName: string, pSizeX: number, pSizeY: number, pSizeZ: number) {
        super('compute', pName);
        this.mWorkgroupSize = {
            x: pSizeX,
            y: pSizeY,
            z: pSizeZ
        };
    }
}

export type PgslParserResultComputeEntryPointWorkgroupSize = {
    /**
     * X dimension of the workgroup
     */
    x: number;

    /**
     * Y dimension of the workgroup
     */
    y: number;

    /**
     * Z dimension of the workgroup
     */
    z: number;
};