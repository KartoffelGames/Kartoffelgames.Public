import { PgslParserResultType, PgslParserResultTypeAlignmentType } from './pgsl-parser-result-type.ts';

/**
 * Represents a boolean type in PGSL parser results with calculated size and alignment.
 */
export class PgslParserResultBooleanType extends PgslParserResultType {
    /**
     * Creates a new PGSL parser result boolean type.
     * 
     * @param pAlignmentType - The alignment type (uniform, storage, or packed).
     */
    public constructor(pAlignmentType: PgslParserResultTypeAlignmentType) {
        super('boolean', pAlignmentType);
    }
}