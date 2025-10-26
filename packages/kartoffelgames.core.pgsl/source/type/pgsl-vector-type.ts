import type { PgslTrace } from '../trace/pgsl-trace.ts';
import { PgslType, type PgslTypeProperties } from './pgsl-type.ts';

/**
 * Vector type definition.
 * Represents a vector type with a specific dimension and inner type.
 */
export class PgslVectorType extends PgslType {
    /**
     * Type names for vector types.
     * Maps vector type names to their string representations.
     */
    public static get typeName() {
        return {
            vector2: 'Vector2',
            vector3: 'Vector3',
            vector4: 'Vector4'
        } as const;
    }

    private readonly mInnerType: PgslType;
    private readonly mVectorDimension: number;

    /**
     * Gets the inner element type of the vector.
     * 
     * @returns The type of elements stored in the vector.
     */
    public get innerType(): PgslType {
        return this.mInnerType;
    }

    /**
     * Gets the dimension (number of components) of the vector.
     * 
     * @returns The vector dimension (2, 3, or 4).
     */
    public get dimension(): number {
        return this.mVectorDimension;
    }

    /**
     * Constructor for vector type.
     * 
     * @param pTrace - The trace context for validation and error reporting.
     * @param pVectorDimension - The vector dimension (2, 3, or 4).
     * @param pInnerType - The inner element type of the vector.
     */
    public constructor(pTrace: PgslTrace, pVectorDimension: number, pInnerType: PgslType) {
        super(pTrace);

        // Validate vector dimension.
        if (pVectorDimension < 2 || pVectorDimension > 4) {
            pTrace.pushIncident('Invalid vector dimension. Must be 2, 3, or 4.');
        }

        // Set data.
        this.mInnerType = pInnerType;
        this.mVectorDimension = pVectorDimension;
    }

    /**
     * Compare this vector type with a target type for equality.
     * Two vector types are equal if they have the same dimension and inner type.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same dimension and inner type.
     */
    public override equals(pTarget: PgslType): boolean {
        // Must both be a vector.
        if (!(pTarget instanceof PgslVectorType)) {
            return false;
        }

        // Inner type must be equal.
        if (!this.mInnerType.equals(pTarget.mInnerType)) {
            return false;
        }

        // Vector dimensions must be equal.
        return this.mVectorDimension === pTarget.mVectorDimension;
    }

    /**
     * Check if this vector type is explicitly castable into the target type.
     * Vector types can be explicitly cast if they have the same dimension and compatible inner types.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns True when explicit casting is allowed, false otherwise.
     */
    public override isExplicitCastableInto(pTarget: PgslType): boolean {
        // Must both be a vector.
        if (!(pTarget instanceof PgslVectorType)) {
            return false;
        }

        // If vector dimensions are not equal, it is not castable.
        if (this.mVectorDimension !== pTarget.mVectorDimension) {
            return false;
        }

        // It is when inner types are explicit castable.
        return this.mInnerType.isExplicitCastableInto(pTarget.mInnerType);
    }

    /**
     * Check if this vector type is implicitly castable into the target type.
     * Vector types can be implicitly cast if they have the same dimension and compatible inner types.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns True when implicit casting is allowed, false otherwise.
     */
    public override isImplicitCastableInto(pTarget: PgslType): boolean {
        // Must both be a vector.
        if (!(pTarget instanceof PgslVectorType)) {
            return false;
        }

        // If vector dimensions are not equal, it is not castable.
        if (this.mVectorDimension !== pTarget.mVectorDimension) {
            return false;
        }

        // It is when inner types are implicit castable.
        return this.mInnerType.isImplicitCastableInto(pTarget.mInnerType);
    }

    /**
     * Collect type properties for vector types.
     * Validates that the inner type is scalar and copies relevant properties.
     * 
     * @param pTrace - Trace context for validation and error reporting.
     * 
     * @returns Type properties for vector types.
     */
    protected override onTypePropertyCollection(pTrace: PgslTrace): PgslTypeProperties {
        // Must be scalar.
        if (!this.mInnerType.scalar) {
            pTrace.pushIncident('Vector type must have a scalar inner type');
        }

        return {
            // Always accessible as composite (swizzle) or index.
            composite: true,
            indexable: true,
            scalar: false,
            plain: true,
            concrete: true,

            // Copy of inner type properties.
            storable: this.mInnerType.storable,
            hostShareable: this.mInnerType.hostShareable,
            constructible: this.mInnerType.constructible,
            fixedFootprint: this.mInnerType.fixedFootprint
        };
    }
}