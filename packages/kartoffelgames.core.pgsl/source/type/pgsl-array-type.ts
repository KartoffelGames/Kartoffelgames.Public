import { PgslValueFixedState } from '../enum/pgsl-value-fixed-state.ts';
import type { IExpressionAst } from '../abstract_syntax_tree/expression/i-expression-ast.interface.ts';
import { PgslNumericType } from './pgsl-numeric-type.ts';
import { PgslType, type PgslTypeProperties } from './pgsl-type.ts';
import { AbstractSyntaxTreeContext } from "../abstract_syntax_tree/abstract-syntax-tree-context.ts";

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
    private readonly mLengthExpression: IExpressionAst | null;

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
    public get lengthExpression(): IExpressionAst | null {
        return this.mLengthExpression;
    }

    /**
     * Constructor for array type.
     * 
     * @param pContext - The trace context for validation and error reporting.
     * @param pType - The inner element type of the array.
     * @param pLengthExpression - Optional length expression for fixed-size arrays.
     */
    public constructor(pContext: AbstractSyntaxTreeContext, pType: PgslType, pLengthExpression: IExpressionAst | null) {
        super(pContext);

        this.mInnerType = pType;
        this.mLengthExpression = pLengthExpression;

        // Inner type must be storable and have fixed footprint.
        if (!this.mInnerType.storable) {
            pContext.pushIncident(`Array inner type must be storable.`);
        }
        if (!this.mInnerType.fixedFootprint) {
            pContext.pushIncident(`Array inner type must have a fixed footprint.`);
        }

        // Read length expression as number.
        if (pLengthExpression) {
            if (typeof pLengthExpression.data.constantValue === 'number') {
                this.mLength = pLengthExpression.data.constantValue;
            } else {
                pContext.pushIncident(`Array length expression must be a constant integer.`, pLengthExpression);
                this.mLength = null;
            }
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
     * @param pTarget - Target type to check castability to.
     * 
     * @returns Always false - arrays cannot be cast.
     */
    public override isImplicitCastableInto(pTarget: PgslType): boolean {
        // Must be an array.
        if (!(pTarget instanceof PgslArrayType)) {
            return false;
        }

        // An array is never implicit with same length.
        if (this.mLength !== pTarget.length) {
            return false;
        }

        // Inner types must be implicit castable.
        if (!this.mInnerType.isImplicitCastableInto(pTarget.innerType)) {
            return false;
        }

        return true;
    }

    /**
     * Collect type properties for array types.
     * Validates length expressions and aggregates properties from the inner type.
     * Fixed-size arrays with constructible inner types are constructible.
     * 
     * @param pContext - Trace context for validation and error reporting.
     * 
     * @returns Type properties for array types.
     */
    protected override process(pContext: AbstractSyntaxTreeContext): PgslTypeProperties {
        // Validate length expression when set.
        if (this.mLengthExpression) {
            // Length expression must be constant.
            if (this.mLengthExpression.data.fixedState < PgslValueFixedState.Constant) {
                pContext.pushIncident(`Array length expression must be a constant expression.`, this.mLengthExpression);
            }

            // Length expression must be an unsigned integer scalar.
            if (!this.mLengthExpression.data.returnType.isImplicitCastableInto(new PgslNumericType(pContext, PgslNumericType.typeName.unsignedInteger))) {
                pContext.pushIncident(`Array length expression must be of unsigned integer type.`, this.mLengthExpression);
            }
        }

        // Inner type must be plain.
        if (!this.mInnerType.plain) {
            pContext.pushIncident(`Array inner type must be a plain type.`);
        }

        // Inner type must be fixed.
        if (!this.mInnerType.fixedFootprint) {
            pContext.pushIncident(`Array inner type must have a fixed footprint.`);
        }

        // Is fixed when length expression is set and inner type is fixed.
        const lIsFixed: boolean = (!this.mLengthExpression) ? false : this.mInnerType.fixedFootprint;

        // Is constructible when inner type is constructible and array is fixed.
        const lIsConstructible: boolean = (!lIsFixed) ? false : this.mInnerType.constructible;

        return {
            composite: false,
            indexable: true,
            plain: true,
            scalar: false,

            // Copy of inner type attachment.
            concrete: this.mInnerType.concrete,
            fixedFootprint: lIsFixed,
            constructible: lIsConstructible,
            storable: this.mInnerType.storable,
            hostShareable: this.mInnerType.hostShareable,
        };
    }
}