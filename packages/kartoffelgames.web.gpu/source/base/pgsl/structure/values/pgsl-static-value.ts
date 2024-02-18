import { PgslTypenName } from '../type/pgsl-type-name.enum';

export class PgslStaticValue {
    private readonly mType: PgslTypenName;
    private readonly mValue: number;
    
    /**
     * Static value type.
     */
    public get type(): PgslTypenName {
        return this.mType;
    }

    /**
     * Static value.
     */
    public get value(): number {
        return this.mValue;
    }

    /**
     * Constructor.
     * @param pValue - Value as string.
     * @param pType - Value type.
     */
    public constructor(pValue: number, pType: PgslTypenName) {
        this.mValue = pValue;
        this.mType = pType;
    }
}