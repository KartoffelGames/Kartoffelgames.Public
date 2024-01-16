import { PgslSimpleType } from '../type/pgsl-simple-type';

export class PgslStaticValue {
    private readonly mType: PgslSimpleType;
    private readonly mValue: number;
    
    /**
     * Static value type.
     */
    public get type(): PgslSimpleType {
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
    public constructor(pValue: number, pType: PgslSimpleType) {
        this.mValue = pValue;
        this.mType = pType;
    }
}