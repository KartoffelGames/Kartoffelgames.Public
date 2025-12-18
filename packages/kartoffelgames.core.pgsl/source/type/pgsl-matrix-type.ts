import { AbstractSyntaxTreeContext } from "../abstract_syntax_tree/abstract-syntax-tree-context.ts";
import { PgslNumericType } from './pgsl-numeric-type.ts';
import { PgslType, type PgslTypeProperties } from './pgsl-type.ts';
import { PgslVectorType } from './pgsl-vector-type.ts';

/**
 * Matrix type definition.
 * Represents a matrix type with specific row and column dimensions and inner numeric type.
 * Matrices are composite types used for linear algebra operations in graphics programming.
 * 
 * MATRIXES ARE ALWAYS COLUMN MAJOR ORDERED.
 */
export class PgslMatrixType extends PgslType {
    /**
     * Type names for all available matrix dimensions.
     * Maps matrix type names to their string representations.
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
     * Gets the inner element type of the matrix.
     * 
     * @returns The type of elements stored in the matrix.
     */
    public get innerType(): PgslType {
        return this.mInnerType;
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
     * Gets the number of columns in the matrix.
     * 
     * @returns The column count.
     */
    public get columnCount(): number {
        return this.mColumnCount;
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
     * @param pContext - The context for validation and error reporting.
     * @param pMatrixType - The specific matrix dimension type.
     * @param pInnerType - The inner element type of the matrix.
     */
    public constructor(pContext: AbstractSyntaxTreeContext, pMatrixType: PgslMatrixTypeName, pInnerType: PgslType) {
        super(pContext);

        // Set data.
        this.mInnerType = pInnerType;

        // Get matrix dimensions.
        [this.mColumnCount, this.mRowCount] = this.getMatrixDimensions(pMatrixType);

        // Create underlying vector type based on matrix type.
        this.mVectorTypeDefinition = new PgslVectorType(pContext, this.mColumnCount, pInnerType);
    }

    /**
     * Compare this matrix type with a target type for equality.
     * Two matrix types are equal if they have the same dimensions and inner type.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same dimensions and inner type.
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
     * Check if this matrix type is explicitly castable into the target type.
     * Matrix types can be explicitly cast if they have the same dimensions and compatible inner types.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns True when explicit casting is allowed, false otherwise.
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
     * Check if this matrix type is implicitly castable into the target type.
     * Matrix types can be implicitly cast if they have the same dimensions and compatible inner types.
     * 
     * @param pTarget - Target type to check castability to.
     * 
     * @returns True when implicit casting is allowed, false otherwise.
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
     * Collect type properties for matrix types.
     * Validates that the inner type is appropriate for matrices and copies relevant properties.
     * 
     * @param pContext - Trace context for validation and error reporting.
     * 
     * @returns Type properties for matrix types.
     */
    protected override process(pContext: AbstractSyntaxTreeContext): PgslTypeProperties {
        // Must be Float.
        if (this.isImplicitCastableInto(new PgslNumericType(pContext, PgslNumericType.typeName.float32))) {
            pContext.pushIncident('Matrix type must be a Float32');
        }

        return {
            // Always accessible as composite (swizzle) or index.
            composite: true,
            indexable: true,

            // Copy of inner type properties.
            concrete: this.innerType.concrete,
            scalar: this.innerType.scalar,
            plain: this.innerType.plain,
            storable: this.mInnerType.storable,
            hostShareable: this.mInnerType.hostShareable,
            constructible: this.mInnerType.constructible,
            fixedFootprint: this.mInnerType.fixedFootprint
        };
    }

    /**
     * Gets the matrix dimensions for a given matrix type.
     * 
     * @param pMatrixType - The matrix type to get dimensions for.
     * 
     * @returns The matrix dimensions as [rows, columns].
     */
    private getMatrixDimensions(pMatrixType: PgslMatrixTypeName): [columns: number, rows: number] {
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

/**
 * Type representing all available matrix type names.
 * Derived from the static typeName getter for type safety.
 */
type PgslMatrixTypeName = (typeof PgslMatrixType.typeName)[keyof typeof PgslMatrixType.typeName];