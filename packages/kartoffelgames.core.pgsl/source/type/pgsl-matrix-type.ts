import { PgslTrace } from "../trace/pgsl-trace.ts";
import { PgslType, PgslTypeProperties } from "./pgsl-type.ts";
import { PgslVectorType } from './pgsl-vector-type.ts';
import { PgslNumericType } from "./pgsl-numeric-type.ts";

/**
 * Matrix type definition.
 * Represents a matrix type with a specific dimension and inner type.
 */
export class PgslMatrixType extends PgslType {
    /**
     * Type names.
     */
    public static get typeName() {
        return {
            matrix22: 'Matrix22',
            matrix23: 'Matrix23',
            matrix24: 'Matrix24',
            matrix32: 'Matrix32',
            matrix33: 'Matrix33',
            matrix34: 'Matrix34',
            matrix42: 'Matrix42',
            matrix43: 'Matrix43',
            matrix44: 'Matrix44'
        } as const;
    }

    private readonly mInnerType: PgslType;
    private readonly mVectorTypeDefinition: PgslVectorType;
    private readonly mRowCount: number;
    private readonly mColumnCount: number;

    /**
     * Inner type of matrix.
     */
    public get innerType(): PgslType {
        return this.mInnerType;
    }

    /**
     * Matrix row count.
     */
    public get rowCount(): number {
        return this.mRowCount;
    }

    /**
     * Matrix column count.
     */
    public get columnCount(): number {
        return this.mColumnCount;
    }

    /**
     * Inner vector type.
     */
    public get vectorType(): PgslVectorType {
        return this.mVectorTypeDefinition;
    }

    /**
     * Constructor.
     * 
     * @param pTrace - The trace context.
     * @param pMatrixType - Matrix dimension type.
     * @param pInnerType - Inner type of matrix.
     */
    public constructor(pTrace: PgslTrace, pMatrixType: PgslMatrixTypeName, pInnerType: PgslType) {
        super(pTrace);

        // Set data.
        this.mInnerType = pInnerType;

        // Get matrix dimensions.
        [this.mRowCount, this.mColumnCount] = this.getMatrixDimensions(pMatrixType);

        // Create underlying vector type based on matrix type.
        this.mVectorTypeDefinition = new PgslVectorType(pTrace, this.mColumnCount, pInnerType);
    }

    /**
     * Compare this type with a target type for equality.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns true when both types describes the same type.
     */
    public override equals(pTarget: PgslType): boolean {
        // Must both be a matrix.
        if (!(pTarget instanceof PgslMatrixType)) {
            return false;
        }

        // Inner type must be equal.
        if (!this.mInnerType.equals(pTarget.innerType)) {
            return false;
        }

        // Matrix dimensions must be equal.
        return this.mRowCount === pTarget.rowCount && this.mColumnCount === pTarget.columnCount;
    }

    /**
     * Check if type is explicit castable into target type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns true when type is explicit castable into target type.
     */
    public override isExplicitCastableInto(pTarget: PgslType): boolean {
        // Must both be a matrix.
        if (!(pTarget instanceof PgslMatrixType)) {
            return false;
        }

        // If matrix dimensions are not equal, it is not castable.
        if (this.mRowCount !== pTarget.rowCount || this.mColumnCount !== pTarget.columnCount) {
            return false;
        }

        // It is when inner types are explicit castable.
        return this.mInnerType.isExplicitCastableInto(pTarget.innerType);
    }

    /**
     * Check if type is implicit castable into target type.
     * 
     * @param pTarget - Target type.
     * 
     * @returns true when type is implicit castable into target type.
     */
    public override isImplicitCastableInto(pTarget: PgslType): boolean {
        // Must both be a matrix.
        if (!(pTarget instanceof PgslMatrixType)) {
            return false;
        }

        // If matrix dimensions are not equal, it is not castable.
        if (this.mRowCount !== pTarget.rowCount || this.mColumnCount !== pTarget.columnCount) {
            return false;
        }

        // It is when inner types are implicit castable.
        return this.mInnerType.isImplicitCastableInto(pTarget.innerType);
    }

    /**
     * Collect type properties for matrix type.
     * 
     * @param pTrace - Trace context.
     * 
     * @returns Type properties for matrix type.
     */
    protected override onTypePropertyCollection(pTrace: PgslTrace): PgslTypeProperties {
        // Must be Float.
        if (this.isImplicitCastableInto(new PgslNumericType(pTrace, PgslNumericType.typeName.float32))) {
            pTrace.pushIncident('Matrix type must be a Float32');
        }

        return {
            concrete: true,
            scalar: false,
            plain: true,

            // Always accessible as composite (swizzle) or index.
            composite: true,
            indexable: true,

            // Copy of inner type properties.
            storable: this.mInnerType.storable,
            hostShareable: this.mInnerType.hostShareable,
            constructible: this.mInnerType.constructible,
            fixedFootprint: this.mInnerType.fixedFootprint
        };
    }

    /**
     * Gets the matrix dimensions for a given matrix type.
     * 
     * @param pMatrixType - The matrix type to get matrix dimensions for.
     * 
     * @returns The matrix dimensions (rows, columns).
     */
    private getMatrixDimensions(pMatrixType: PgslMatrixTypeName): [rows: number, columns: number] {
        switch (pMatrixType) {
            case PgslMatrixType.typeName.matrix22: return [2, 2];
            case PgslMatrixType.typeName.matrix32: return [3, 2];
            case PgslMatrixType.typeName.matrix42: return [4, 2];
            case PgslMatrixType.typeName.matrix23: return [2, 3];
            case PgslMatrixType.typeName.matrix33: return [3, 3];
            case PgslMatrixType.typeName.matrix43: return [4, 3];
            case PgslMatrixType.typeName.matrix24: return [2, 4];
            case PgslMatrixType.typeName.matrix34: return [3, 4];
            case PgslMatrixType.typeName.matrix44: return [4, 4];
            default:
                return [2, 2]; // Default fallback
        }
    }
}

type PgslMatrixTypeName = (typeof PgslMatrixType.typeName)[keyof typeof PgslMatrixType.typeName];