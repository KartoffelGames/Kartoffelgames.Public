import { BasePgslType, BasePgslTypeKind, type BasePgslTypeMeta } from './base-pgsl-type.ts';

/**
 * Vector type definition.
 * Represents a vector type with a specific dimension and inner type.
 */
export class PgslVectorType extends BasePgslType {
    /**
     * Type names for vector types.
     * Maps vector type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public static get typeName() {
        return {
            vector2: 'Vector2',
            vector3: 'Vector3',
            vector4: 'Vector4'
        } as const;
    }

    /**
     * Get a string identification for the type.
     * 
     * @param pDimension - The vector dimension.
     * @param pInnerType - The inner element type of the vector.
     * 
     * @returns The type identification.
     */
    public static identifierOf(pDimension: number, pInnerType: BasePgslType): string {
        return PgslVectorType.typeNameFromDimension(pDimension) + '[' + pInnerType.meta.typeName + ']';
    }

    /**
     * Get the type name for a given vector dimension.
     * 
     * @param pDimension - Vector dimension.
     * 
     * @returns Type name for the given vector dimension. 
     */
    public static typeNameFromDimension(pDimension: number): string {
        switch (pDimension) {
            case 2: return PgslVectorType.typeName.vector2;
            case 3: return PgslVectorType.typeName.vector3;
            case 4: return PgslVectorType.typeName.vector4;
            default: return 'Vector';
        }
    }

    private readonly mVectorDimension: number;

    /**
     * Gets the dimension (number of components) of the vector.
     * 
     * @returns The vector dimension (2, 3, or 4).
     */
    public get dimension(): number {
        return this.mVectorDimension;
    }

    /**
     * Gets the inner element type of the vector.
     * 
     * @returns The type of elements stored in the vector.
     */
    public get innerType(): BasePgslType {
        return this.meta.generics![0];
    }

    /**
     * Constructor for vector type.
     * 
     * @param pVectorDimension - The vector dimension (2, 3, or 4).
     * @param pInnerType - The inner element type of the vector.
     * @param pShadowedType - Type that is the actual type of this.
     */
    public constructor(pVectorDimension: number, pInnerType: BasePgslType, pShadowedType?: BasePgslType) {
        // What a vector is.
        let lKindFlags: BasePgslTypeKind = BasePgslTypeKind.Vector | BasePgslTypeKind.Composite | BasePgslTypeKind.Indexable;

        // Copy kind informations from inner types.
        lKindFlags |= pInnerType.isKind(BasePgslTypeKind.Plain) ? BasePgslTypeKind.Plain : BasePgslTypeKind.None;
        lKindFlags |= pInnerType.isKind(BasePgslTypeKind.Concrete) ? BasePgslTypeKind.Concrete : BasePgslTypeKind.None;
        lKindFlags |= pInnerType.isKind(BasePgslTypeKind.Storable) ? BasePgslTypeKind.Storable : BasePgslTypeKind.None;
        lKindFlags |= pInnerType.isKind(BasePgslTypeKind.FixedFootprint) ? BasePgslTypeKind.FixedFootprint : BasePgslTypeKind.None;
        lKindFlags |= pInnerType.isKind(BasePgslTypeKind.Constructible) ? BasePgslTypeKind.Constructible : BasePgslTypeKind.None;
        lKindFlags |= pInnerType.isKind(BasePgslTypeKind.HostShareable) ? BasePgslTypeKind.HostShareable : BasePgslTypeKind.None;

        // Create meta.
        const lTypeMeta: BasePgslTypeMeta = {
            typeName: PgslVectorType.identifierOf(pVectorDimension, pInnerType),
            generics: [pInnerType]
        };

        super(lKindFlags, lTypeMeta, pShadowedType);

        this.mVectorDimension = pVectorDimension;
    }

    /**
     * Get this types convertion rank to another type.
     * A vector converts into a vector of the same dimension whenever its inner type converts.
     * 
     * @param pTarget - Conversion target type.
     * 
     * @returns The conversion rank of the component type, infinity when the vectors do not match.
     */
    public override conversionRankTo(pTarget: BasePgslType): number {
        // Must both be a vector of the same dimension.
        if (!this.isSameTypeClass(pTarget) || this.mVectorDimension !== pTarget.dimension) {
            return Number.POSITIVE_INFINITY;
        }

        // The inner types conversion rank is the vector rank.
        return this.innerType.conversionRankTo(pTarget.innerType);
    }

    /**
     * Compare this vector type with a target type for equality.
     * Two vector types are equal if they have the same dimension and inner type.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same dimension and inner type.
     */
    public override equals(pTarget: BasePgslType): pTarget is this {
        // Must both be a vector of the same dimension.
        if (!this.isSameTypeClass(pTarget) || this.mVectorDimension !== pTarget.dimension) {
            return false;
        }

        return this.innerType.equals(pTarget.innerType);
    }
}
