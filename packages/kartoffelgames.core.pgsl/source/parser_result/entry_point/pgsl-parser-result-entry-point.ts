/**
 * Represents a entry point result from PGSL parser with parameter and return information.
 */
export class PgslParserResultEntryPoint {
    private readonly mName: string;
    private readonly mType: PgslParserResultEntryPointType;

    /**
     * Gets the name of the entry point.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Gets the type of the entry point.
     */
    public get type(): PgslParserResultEntryPointType {
        return this.mType;
    }

    /**
     * Creates a new instance of PgslParserResultEntryPoint.
     * 
     * @param pType - Type of the entry point. 
     * @param pName - Name of the entry point.
     */
    public constructor(pType: PgslParserResultEntryPointType, pName: string) {
        this.mType = pType;
        this.mName = pName;
    }
}

export type PgslParserResultEntryPointType = 'vertex' | 'fragment' | 'compute';