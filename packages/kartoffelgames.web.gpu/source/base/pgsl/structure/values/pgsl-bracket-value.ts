import { PgslValue } from './pgsl-value';

export class PgslBracketValue {
    private readonly mValue: PgslValue;

    /**
     * Value.
     */
    public get value(): PgslValue {
        return this.mValue;
    }

    /**
     * Constructor.
     * @param pValue - Value of bracket.
     */
    public constructor(pValue: PgslValue) {
        this.mValue = pValue;
    }
}