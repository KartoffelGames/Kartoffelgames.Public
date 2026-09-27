import { Exception } from '@kartoffelgames/core';
import { BasePgslType, BasePgslTypeKind, type BasePgslTypeMeta } from './base-pgsl-type.ts';
import { PgslVectorType } from './pgsl-vector-type.ts';

/**
 * Matrix type definition.
 * Represents a matrix type with specific row and column dimensions and inner numeric type.
 * Matrices are composite types used for linear algebra operations in graphics programming.
 * 
 * MATRIXES ARE ALWAYS COLUMN MAJOR ORDERED.
 */
export class PgslMatrixType extends BasePgslType {
    /**
     * Type names for all available matrix dimensions.
     * Maps matrix type names to their string representations.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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

    /**
     * Gets the matrix dimensions for a given matrix type.
     * 
     * @param pMatrixType - The matrix type to get dimensions for.
     * 
     * @returns The matrix dimensions as [columns, rows].
     */
    public static dimensionsOf(pMatrixType: PgslMatrixTypeName): [columns: number, rows: number] {
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
        }
    }

    /**
     * Get a string identification for the type.
     * 
     * @param pColumnCount - The number of columns in the matrix.
     * @param pRowCount - The number of rows in the matrix.
     * @param pInnerType - The inner element type of the matrix.
     * 
     * @returns The type identification.
     */
    public static identifierOf(pColumnCount: number, pRowCount: number, pInnerType: BasePgslType): string {
        return PgslMatrixType.typenameFromDimensions(pColumnCount, pRowCount) + '[' + pInnerType.meta.typeName + ']';
    }

    /**
     * Gets the matrix type name for given dimensions.
     * 
     * @param pColumnCount - The number of columns in the matrix.
     * @param pRowCount - The number of rows in the matrix.
     * 
     * @returns The corresponding matrix type name.
     */
    public static typenameFromDimensions(pColumnCount: number, pRowCount: number): PgslMatrixTypeName {
        switch (`${pColumnCount}x${pRowCount}`) {
            case '2x2': return PgslMatrixType.typeName.matrix22;
            case '3x2': return PgslMatrixType.typeName.matrix32;
            case '4x2': return PgslMatrixType.typeName.matrix42;
            case '2x3': return PgslMatrixType.typeName.matrix23;
            case '3x3': return PgslMatrixType.typeName.matrix33;
            case '4x3': return PgslMatrixType.typeName.matrix43;
            case '2x4': return PgslMatrixType.typeName.matrix24;
            case '3x4': return PgslMatrixType.typeName.matrix34;
            case '4x4': return PgslMatrixType.typeName.matrix44;
            default:
                throw new Exception(`Invalid matrix dimensions: ${pColumnCount}x${pRowCount}`, PgslMatrixType);
        }
    }

    private readonly mColumnCount: number;
    private readonly mRowCount: number;
    private readonly mVectorTypeDefinition: PgslVectorType;

    /**
     * Gets the number of columns in the matrix.
     * 
     * @returns The column count.
     */
    public get columnCount(): number {
        return this.mColumnCount;
    }

    /**
     * Gets the inner element type of the matrix.
     * 
     * @returns The type of elements stored in the matrix.
     */
    public get innerType(): BasePgslType {
        return this.meta.generics![0];
    }

    /**
     * Gets the number of rows in the matrix.
     * 
     * @returns The row count.
     */
    public get rowCount(): number {
        return this.mRowCount;
    }

    /**
     * Gets the underlying vector type used for matrix columns.
     * 
     * @returns The vector type representing matrix columns.
     */
    public get vectorType(): PgslVectorType {
        return this.mVectorTypeDefinition;
    }

    /**
     * Constructor for matrix type.
     * 
     * @param pColumnCount - The number of columns in the matrix.
     * @param pRowCount - The number of rows in the matrix.
     * @param pInnerType - The inner element type of the matrix.
     */
    public constructor(pColumnCount: number, pRowCount: number, pInnerType: BasePgslType) {
        // A matrix is always a composite that can be indexed. It is never a scalar itself.
        let lKindFlags: BasePgslTypeKind = BasePgslTypeKind.Matrix | BasePgslTypeKind.Composite | BasePgslTypeKind.Indexable;

        // Copy kind informations from inner types.
        lKindFlags |= pInnerType.isKind(BasePgslTypeKind.Plain) ? BasePgslTypeKind.Plain : BasePgslTypeKind.None;
        lKindFlags |= pInnerType.isKind(BasePgslTypeKind.Concrete) ? BasePgslTypeKind.Concrete : BasePgslTypeKind.None;
        lKindFlags |= pInnerType.isKind(BasePgslTypeKind.Storable) ? BasePgslTypeKind.Storable : BasePgslTypeKind.None;
        lKindFlags |= pInnerType.isKind(BasePgslTypeKind.FixedFootprint) ? BasePgslTypeKind.FixedFootprint : BasePgslTypeKind.None;
        lKindFlags |= pInnerType.isKind(BasePgslTypeKind.Constructible) ? BasePgslTypeKind.Constructible : BasePgslTypeKind.None;
        lKindFlags |= pInnerType.isKind(BasePgslTypeKind.HostShareable) ? BasePgslTypeKind.HostShareable : BasePgslTypeKind.None;

        // Create meta.
        const lTypeMeta: BasePgslTypeMeta = {
            typeName: PgslMatrixType.identifierOf(pColumnCount, pRowCount, pInnerType),
            generics: [pInnerType]
        };

        super(lKindFlags, lTypeMeta);

        this.mColumnCount = pColumnCount;
        this.mRowCount = pRowCount;

        // Create underlying vector type based on matrix type.
        this.mVectorTypeDefinition = new PgslVectorType(this.mColumnCount, pInnerType);
    }

    /**
     * Get this types convertion rank to another type.
     * A matrix converts into a matrix of the same dimensions whenever its component type converts.
     * 
     * @param pTarget - Conversion target type.
     * 
     * @returns The conversion rank of the component type, infinity when the matrices do not match.
     */
    public override conversionRankTo(pTarget: BasePgslType): number {
        // Must both be a matrix of the same dimensions.
        if (!this.isSameTypeClass(pTarget) || this.mColumnCount !== pTarget.columnCount || this.mRowCount !== pTarget.rowCount) {
            return Number.POSITIVE_INFINITY;
        }

        // The component conversion decides the rank of the whole matrix.
        return this.innerType.conversionRankTo(pTarget.innerType);
    }

    /**
     * Compare this matrix type with a target type for equality.
     * Two matrix types are equal if they have the same dimensions and inner type.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same dimensions and inner type.
     */
    public override equals(pTarget: BasePgslType): pTarget is this {
        // Must both be a matrix.
        if (!this.isSameTypeClass(pTarget)) {
            return false;
        }

        // And the same dimensions.
        if (this.mColumnCount !== pTarget.columnCount || this.mRowCount !== pTarget.rowCount) {
            return false;
        }

        return this.innerType.equals(pTarget.innerType);
    }
}

/**
 * Type representing all available matrix type names.
 * Derived from the static typeName getter for type safety.
 */
export type PgslMatrixTypeName = (typeof PgslMatrixType.typeName)[keyof typeof PgslMatrixType.typeName];
