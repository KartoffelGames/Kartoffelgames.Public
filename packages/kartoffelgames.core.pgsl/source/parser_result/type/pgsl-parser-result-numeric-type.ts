import { PgslParserResultType, type PgslParserResultTypeAlignmentType } from './pgsl-parser-result-type.ts';

/**
 * Represents a numeric type in PGSL parser results with calculated size and alignment.
 * Supports both floating-point and integer types with proper WGSL memory layout.
 */
export class PgslParserResultNumericType extends PgslParserResultType {
    private readonly mNumberType: PgslParserResultNumberTypeType;

    /**
     * Gets the specific numeric type (float or integer).
     *
     * @returns The numeric type category.
     */
    public get numberType(): PgslParserResultNumberTypeType {
        return this.mNumberType;
    }

    /**
     * Creates a new PGSL parser result number type.
     *
     * @param pNumberType - The specific numeric type (float or integer).
     * @param pAlignmentType - The alignment type (uniform, storage, or packed).
     */
    public constructor(pNumberType: PgslParserResultNumberTypeType, pAlignmentType: PgslParserResultTypeAlignmentType) {
        super('numeric', pAlignmentType);
        this.mNumberType = pNumberType;
    }
}

/**
 * Union type for distinguishing between floating-point and integer numeric types.
 * - 'float': Floating-point numbers (f32)
 * - 'integer': Signed integers (i32)
 * - 'unsigned-integer': Unsigned integers (u32)
 */
export type PgslParserResultNumberTypeType = 'float' | 'integer' | 'unsigned-integer';