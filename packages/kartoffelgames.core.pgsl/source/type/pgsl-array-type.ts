import { PgslValueFixedState } from "../enum/pgsl-value-fixed-state.ts";
import { BasePgslExpression } from "../syntax_tree/expression/base-pgsl-expression.ts";
import { PgslExpressionTrace } from "../trace/pgsl-expression-trace.ts";
import { PgslTrace } from "../trace/pgsl-trace.ts";
import { PgslNumericType } from "./pgsl-numeric-type.ts";
import { PgslType, PgslTypeProperties } from "./pgsl-type.ts";

/**
 * Array type definition.
 */
export class PgslArrayType extends PgslType {
    /**
     * Type names.
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
     * Inner type of array.
     */
    public get innerType(): PgslType {
        return this.mInnerType;
    }

    /**
     * Length expression of array.
     */
    public get length(): number | null {
        return this.mLength;
    }

    /**
     * Constructor.
     * 
     * @param pType - Inner array type.
     * @param pLengthExpression - Length expression.
     * @param pMeta - Syntax tree meta data.
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
     * Compare this type with a target type for equality.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both share the same comparison type.
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
     * Check if type is explicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    public override isExplicitCastableInto(_pTarget: PgslType): boolean {
        // A array is never explicit castable.
        return false;
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param _pValidationTrace - Validation trace.
     * @param _pTarget - Target type.
     */
    public override isImplicitCastableInto(_pTarget: PgslType): boolean {
        // A array is never implicit castable.
        return false;
    }

    /**
     * Collect type properties for array type.
     * 
     * @param pTrace - Trace context.
     * 
     * @returns Type properties for array type.
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
            pTrace.pushIncident(`Array type must be a plain type.`);
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