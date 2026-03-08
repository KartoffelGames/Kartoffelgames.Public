import { PgslParserResultType } from './pgsl-parser-result-type.ts';

/**
 * Represents a numeric type in PGSL parser results with calculated size and alignment.
 * Supports both floating-point and integer types with proper WGSL memory layout.
 */
export class PgslParserResultNumericType extends PgslParserResultType {
    private mNumberType: PgslParserResultNumberTypeType;

    /**
     * Gets the specific numeric type (float, float16, integer, or unsigned-integer).
     *
     * @returns The numeric type category.
     */
    public get numberType(): PgslParserResultNumberTypeType {
        return this.mNumberType;
    } set numberType(pValue: PgslParserResultNumberTypeType) {
        this.mNumberType = pValue;
        this.resetType();
    }

    /**
     * Creates a new PGSL parser result number type.
     */
    public constructor() {
        super('numeric');
        this.mNumberType = 'float';
    }

    /**
     * Calculate byte alignment for numeric types.
     * f16 = 2, f32/i32/u32 = 4. Packed alignment is always 1.
     */
    protected onCalculateByteAlignment(): number {
        if (this.alignmentType === 'packed') {
            return 1;
        }

        // f16 has 2-byte alignment, all others have 4-byte alignment.
        return this.mNumberType === 'float16' ? 2 : 4;
    }

    /**
     * Calculate byte size for numeric types.
     * f16 = 2, f32/i32/u32 = 4.
     */
    protected onCalculateByteSize(): number {
        // f16 has 2-byte size, all others have 4-byte size.
        return this.mNumberType === 'float16' ? 2 : 4;
    }

    /**
     * Numeric types have no variable-sized component.
     */
    protected onCalculateVariableByteSize(): number {
        return 0;
    }
}

/**
 * Union type for distinguishing between floating-point and integer numeric types.
 * - 'float': Floating-point numbers (f32)
 * - 'float16': Half-precision floating-point numbers (f16)
 * - 'integer': Signed integers (i32)
 * - 'unsigned-integer': Unsigned integers (u32)
 */
export type PgslParserResultNumberTypeType = 'float' | 'float16' | 'integer' | 'unsigned-integer';
