import { PgslParserResultType } from './pgsl-parser-result-type.ts';

/**
 * Represents a boolean type in PGSL parser results with calculated size and alignment.
 */
export class PgslParserResultBooleanType extends PgslParserResultType {
    /**
     * Creates a new PGSL parser result boolean type.
     */
    public constructor() {
        super('boolean');
    }

    /**
     * Calculate byte alignment for boolean types.
     * bool alignment = 4 (uniform/storage), 1 (packed).
     */
    protected onCalculateByteAlignment(): number {
        if (this.alignmentType === 'packed') {
            return 1;
        }

        return 4;
    }

    /**
     * Calculate byte size for boolean types.
     * bool size = 4.
     */
    protected onCalculateByteSize(): number {
        return 4;
    }

    /**
     * Boolean types have no variable-sized component.
     */
    protected onCalculateVariableByteSize(): number {
        return 0;
    }
}
