import { PgslTypeName } from '../type/pgsl-type-name.enum';

export class PgslLiteralValueExpressions {
    private readonly mType: PgslTypeName;
    private readonly mValue: number;
    
    /**
     * Static value type.
     */
    public get type(): PgslTypeName {
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
    public constructor(pValue: number, pType: PgslTypeName) {
        this.mValue = pValue;
        this.mType = pType;
    }
}