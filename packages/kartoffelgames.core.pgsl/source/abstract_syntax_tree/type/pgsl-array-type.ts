import { PgslValueFixedState } from '../../enum/pgsl-value-fixed-state.ts';
import type { IExpressionAst } from '../expression/i-expression-ast.interface.ts';
import { BasePgslType, BasePgslTypeKind, type BasePgslTypeMeta } from './base-pgsl-type.ts';

/**
 * Array type definition.
 * Represents both fixed-size and runtime-sized arrays of a specific element type.
 * Arrays are indexable composite types that can contain multiple elements of the same type.
 */
export class PgslArrayType extends BasePgslType {
    /**
     * Type names for array types.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            array: 'Array'
        } as const;
    }

    /**
     * Get a string identification for the type.
     * 
     * @param pType - The inner element type of the array.
     * @param pLengthExpression - Optional length expression for fixed-size arrays.
     * 
     * @returns The type identification.
     */
    public static identifierOf(pType: BasePgslType, pLengthExpression: IExpressionAst | null): string {
        // Is fixed when length expression is set and inner type is fixed.
        const lFixedLength: string = pLengthExpression && typeof pLengthExpression.data.constantValue === 'number' ? pLengthExpression.data.constantValue.toString() : '*';

        // Is constructible when inner type is constructible and array is fixed.
        const lFixedFootprint: string = pLengthExpression && pLengthExpression.data.fixedState >= PgslValueFixedState.PipelineCreationFixed ? 'fixed' : '*';

        return PgslArrayType.typeName.array + '[' + pType.meta.typeName + ',' + lFixedLength + ',' + lFixedFootprint + ']';
    }

    private readonly mStaticLength: number | null;

    /**
     * Gets the inner element type of the array.
     * 
     * @returns The type of elements stored in the array.
     */
    public get innerType(): BasePgslType {
        return this.meta.generics![0];
    }

    /**
     * Gets the length of the array if it's fixed-size.
     * 
     * @returns The array length, or null for runtime-sized arrays.
     */
    public get length(): number | null {
        return this.mStaticLength;
    }

    /**
     * Constructor for array type.
     * 
     * @param pType - The inner element type of the array.
     * @param pLengthExpression - Optional length expression for fixed-size arrays.
     * @param pShadowedType - Type that is the actual type of this.
     */
    public constructor(pType: BasePgslType, pLengthExpression: IExpressionAst | null, pShadowedType?: BasePgslType) {
        // Init static flags for arrays.
        let lKindFlags: BasePgslTypeKind = BasePgslTypeKind.Array | BasePgslTypeKind.Composite | BasePgslTypeKind.Indexable;

        // Copy kind informations from inner types.
        lKindFlags |= pType.isKind(BasePgslTypeKind.Plain) ? BasePgslTypeKind.Plain : BasePgslTypeKind.None;
        lKindFlags |= pType.isKind(BasePgslTypeKind.Concrete) ? BasePgslTypeKind.Concrete : BasePgslTypeKind.None;
        lKindFlags |= pType.isKind(BasePgslTypeKind.Storable) ? BasePgslTypeKind.Storable : BasePgslTypeKind.None;
        lKindFlags |= pType.isKind(BasePgslTypeKind.HostShareable) ? BasePgslTypeKind.HostShareable : BasePgslTypeKind.None;

        // Is fixed when length expression is set and inner type is fixed.
        const lIsFixed: boolean = pLengthExpression && pLengthExpression.data.fixedState >= PgslValueFixedState.PipelineCreationFixed ? pType.isKind(BasePgslTypeKind.FixedFootprint) : false;
        if (lIsFixed) {
            lKindFlags |= BasePgslTypeKind.FixedFootprint;
        }

        // Is constructible when inner type is constructible and array is fixed.
        lKindFlags |= lIsFixed && pType.isKind(BasePgslTypeKind.Constructible) ? BasePgslTypeKind.Constructible : BasePgslTypeKind.None;

        const lMeta: BasePgslTypeMeta = {
            typeName: PgslArrayType.identifierOf(pType, pLengthExpression),
            generics: [pType]
        };

        super(lKindFlags, lMeta, pShadowedType);

        // Set a static length if its length value comes from a static number expression.
        this.mStaticLength = null;
        if (pLengthExpression && typeof pLengthExpression.data.constantValue === 'number') {
            this.mStaticLength = pLengthExpression.data.constantValue;
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
    public equals(pTarget: BasePgslType): pTarget is this {
        // Must both be the same kind.
        if (!this.isSameTypeClass(pTarget)) {
            return false;
        }

        // Must have the same inner type.
        if (!this.innerType.equals(pTarget.innerType)) {
            return false;
        }

        // Must both be the same length or both be null.
        return this.length === pTarget.length;
    }

    /**
     * Get this types convertion rank to another type.
     * 
     * @param pTarget - Conversion target type.
     * 
     * @returns the conversation rank from this type to the specified.
     */
    public conversionRankTo(pTarget: BasePgslType): number {
        // Must both be the same kind.
        if (!this.isSameTypeClass(pTarget)) {
            return Number.POSITIVE_INFINITY;
        }

        // Must both be the same length or both be null.
        if (this.length !== pTarget.length) {
            return Number.POSITIVE_INFINITY;
        }

        // When the type and length match, the conversion rank matches the inner type.      
        return this.innerType.conversionRankTo(pTarget.innerType);
    }
}