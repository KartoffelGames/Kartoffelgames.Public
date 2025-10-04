import { PgslTrace } from "../trace/pgsl-trace.ts";
import { PgslType, PgslTypeProperties } from "./pgsl-type.ts";

/**
 * Vector type definition.
 * Represents a vector type with a specific dimension and inner type.
 */
export class PgslVectorType extends PgslType {
    /**
     * Type names.
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
     * Inner type of vector.
     */
    public get innerType(): PgslType {
        return this.mInnerType;
    }

    /**
     * Vector dimension.
     */
    public get dimension(): number {
        return this.mVectorDimension;
    }

    /**
     * Constructor.
     * 
     * @param pTrace - The trace context.
     * @param pVectorDimension - Concrete vector dimension.
     * @param pInnerType - Inner type of vector.
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
     * Compare this type with a target type for equality.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both types describes the same type.
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
     * Check if type is explicit castable into target type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns true when type is explicit castable into target type.
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
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns true when type is implicit castable into target type.
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
     * Collect type properties for vector type.
     * 
     * @param pTrace - Trace context.
     * 
     * @returns Type properties for vector type.
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