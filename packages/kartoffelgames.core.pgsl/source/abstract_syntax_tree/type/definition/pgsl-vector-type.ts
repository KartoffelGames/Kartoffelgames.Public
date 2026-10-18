import { BasePgslType, BasePgslTypeKind } from './base-pgsl-type.ts';

/**
 * Vector type definition.
 * Represents a vector type with a specific dimension and component type.
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
     * @param pComponentType - The component element type of the vector.
     * 
     * @returns The type identification.
     */
    public static identifierOf(pDimension: number, pComponentType: BasePgslType): string {
        return PgslVectorType.typeNameFromDimension(pDimension) + '[' + pComponentType.meta.typeName + ']';
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
     * Gets the component element type of the vector.
     * 
     * @returns The type of elements stored in the vector.
     */
    public get componentType(): BasePgslType {
        return this.meta.generics![0];
    }

    /**
     * Constructor for vector type.
     * 
     * @param pVectorDimension - The vector dimension (2, 3, or 4).
     * @param pComponentType - The component element type of the vector.
     */
    public constructor(pVectorDimension: number, pComponentType: BasePgslType) {
        // What a vector is.
        let lKindFlags: BasePgslTypeKind = BasePgslTypeKind.Vector | BasePgslTypeKind.Composite | BasePgslTypeKind.Indexable;

        // Copy kind informations from component types.
        lKindFlags |= pComponentType.isKind(BasePgslTypeKind.Plain) ? BasePgslTypeKind.Plain : BasePgslTypeKind.None;
        lKindFlags |= pComponentType.isKind(BasePgslTypeKind.Concrete) ? BasePgslTypeKind.Concrete : BasePgslTypeKind.None;
        lKindFlags |= pComponentType.isKind(BasePgslTypeKind.Storable) ? BasePgslTypeKind.Storable : BasePgslTypeKind.None;
        lKindFlags |= pComponentType.isKind(BasePgslTypeKind.FixedFootprint) ? BasePgslTypeKind.FixedFootprint : BasePgslTypeKind.None;
        lKindFlags |= pComponentType.isKind(BasePgslTypeKind.Constructible) ? BasePgslTypeKind.Constructible : BasePgslTypeKind.None;
        lKindFlags |= pComponentType.isKind(BasePgslTypeKind.HostShareable) ? BasePgslTypeKind.HostShareable : BasePgslTypeKind.None;

        // Create and use meta.
        super(lKindFlags, {
            typeName: PgslVectorType.identifierOf(pVectorDimension, pComponentType),
            generics: [pComponentType]
        });

        this.mVectorDimension = pVectorDimension;
    }

    /**
     * Get this types convertion rank to another type.
     * A vector converts into a vector of the same dimension whenever its component type converts.
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

        // The component types conversion rank is the vector rank.
        return this.componentType.conversionRankTo(pTarget.componentType);
    }

    /**
     * Compare this vector type with a target type for equality.
     * Two vector types are equal if they have the same dimension and component type.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same dimension and component type.
     */
    public override equals(pTarget: BasePgslType): pTarget is this {
        // Must both be a vector of the same dimension.
        if (!this.isSameTypeClass(pTarget) || this.mVectorDimension !== pTarget.dimension) {
            return false;
        }

        return this.componentType.equals(pTarget.componentType);
    }
}
