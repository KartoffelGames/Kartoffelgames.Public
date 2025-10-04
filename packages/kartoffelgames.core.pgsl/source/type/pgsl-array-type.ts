import { PgslValueFixedState } from "../enum/pgsl-value-fixed-state.ts";
import { BasePgslExpression } from "../syntax_tree/expression/base-pgsl-expression.ts";
import { PgslExpressionTrace } from "../trace/pgsl-expression-trace.ts";
import { PgslTrace } from "../trace/pgsl-trace.ts";
import { PgslNumericType } from "./pgsl-numeric-type.ts";
import { PgslType, PgslTypeProperties } from "./pgsl-type.ts";

/**
 * Array type definition.
 * Represents both fixed-size and runtime-sized arrays of a specific element type.
 * Arrays are indexable composite types that can contain multiple elements of the same type.
 */
export class PgslArrayType extends PgslType {
    /**
     * Type names for array types.
     */
    public static get typeName() {
        return {
            array: 'Array'
        } as const;
    }

    private readonly mInnerType: PgslType;
    private readonly mLength: number | null;
    private readonly mLengthExpression: BasePgslExpression | null;

    /**
     * Gets the inner element type of the array.
     * 
     * @returns The type of elements stored in the array.
     */
    public get innerType(): PgslType {
        return this.mInnerType;
    }

    /**
     * Gets the length of the array if it's fixed-size.
     * 
     * @returns The array length, or null for runtime-sized arrays.
     */
    public get length(): number | null {
        return this.mLength;
    }

    /**
     * Gets the length expression used to define the array size.
     * 
     * @returns The length expression, or null for runtime-sized arrays.
     */
    public get lengthExpression(): BasePgslExpression | null {
        return this.mLengthExpression;
    }

    /**
     * Constructor for array type.
     * 
     * @param pTrace - The trace context for validation and error reporting.
     * @param pType - The inner element type of the array.
     * @param pLengthExpression - Optional length expression for fixed-size arrays.
     */
    public constructor(pTrace: PgslTrace, pType: PgslType, pLengthExpression: BasePgslExpression | null) {
        super(pTrace);

        this.mInnerType = pType;
        this.mLengthExpression = pLengthExpression;

        // Read length expression as number.
        if (pLengthExpression) {
            const lExpressionTrace: PgslExpressionTrace | undefined = pTrace.getExpression(pLengthExpression);
            this.mLength = lExpressionTrace?.constantValue ?? null;
        } else {
            this.mLength = null;
        }
    }

    /**
     * Compare this array type with a target type for equality.
     * Two array types are equal if they have the same inner type and length.
     * Runtime-sized arrays are equal regardless of their actual runtime size.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same inner type and length.
     */
    public override equals(pTarget: PgslType): boolean {
        // Must both be arrays.
        if (!(pTarget instanceof PgslArrayType)) {
            return false;
        }

        // Must have the same inner type.
        if (!this.mInnerType.equals(pTarget.innerType)) {
            return false;
        }

        // Runtime sized arrays are always equal.
        if (this.mLength === null && pTarget.length === null) {
            return true;
        }

        // Must both be the same length.
        return this.mLength === pTarget.length;
    }

    /**
     * Check if this array type is explicitly castable into the target type.
     * Array types are never castable to other types.
     * 
     * @param _pTarget - Target type to check castability to.
     * 
     * @returns Always false - arrays cannot be cast.
     */
    public override isExplicitCastableInto(_pTarget: PgslType): boolean {
        // An array is never explicit castable.
        return false;
    }

    /**
     * Check if this array type is implicitly castable into the target type.
     * Array types are never castable to other types.
     * 
     * @param _pTarget - Target type to check castability to.
     * 
     * @returns Always false - arrays cannot be cast.
     */
    public override isImplicitCastableInto(_pTarget: PgslType): boolean {
        // An array is never implicit castable.
        return false;
    }

    /**
     * Collect type properties for array types.
     * Validates length expressions and aggregates properties from the inner type.
     * Fixed-size arrays with constructible inner types are constructible.
     * 
     * @param pTrace - Trace context for validation and error reporting.
     * 
     * @returns Type properties for array types.
     */
    protected override onTypePropertyCollection(pTrace: PgslTrace): PgslTypeProperties {
        // Validate length expression when set.
        if (this.mLengthExpression) {
            // Read expressions attachments.
            const lLengthExpressionTrace: PgslExpressionTrace | undefined = pTrace.getExpression(this.mLengthExpression);
            if (!lLengthExpressionTrace) {
                throw new Error(`Missing expression trace for array length expression.`);
            }

            // Length expression must be constant.
            if (lLengthExpressionTrace.fixedState < PgslValueFixedState.Constant) {
                pTrace.pushIncident(`Array length expression must be a constant expression.`, this.mLengthExpression);
            }

            // Length expression must be an unsigned integer scalar.
            if (!lLengthExpressionTrace.resolveType.isImplicitCastableInto(new PgslNumericType(pTrace, PgslNumericType.typeName.unsignedInteger))) {
                pTrace.pushIncident(`Array length expression must be of unsigned integer type.`, this.mLengthExpression);
            }
        }

        // Inner type must be plain.
        if (!this.mInnerType.plain) {
            pTrace.pushIncident(`Array inner type must be a plain type.`);
        }

        // Is fixed when length expression is set and inner type is fixed.
        const lIsFixed: boolean = (!this.mLengthExpression) ? false : this.mInnerType.fixedFootprint;

        // Is constructible when inner type is constructible and array is fixed.
        const lIsConstructible: boolean = (!lIsFixed) ? false : this.mInnerType.constructible;

        return {
            composite: false,
            indexable: true,
            plain: true,
            concrete: true,
            scalar: false,

            // Copy of inner type attachment.
            fixedFootprint: lIsFixed,
            constructible: lIsConstructible,
            storable: this.mInnerType.storable,
            hostShareable: this.mInnerType.hostShareable,
        };
    }
}