import type { AbstractSyntaxTreeContext } from '../abstract-syntax-tree-context.ts';
import { PgslNumericType } from './pgsl-numeric-type.ts';
import type { IType, TypeProperties } from './i-type.interface.ts';
import { PgslVectorType } from './pgsl-vector-type.ts';
import type { TypeCst } from '../../concrete_syntax_tree/general.type.ts';
import { AbstractSyntaxTree } from '../abstract-syntax-tree.ts';

/**
 * Matrix type definition.
 * Represents a matrix type with specific row and column dimensions and inner numeric type.
 * Matrices are composite types used for linear algebra operations in graphics programming.
 * 
 * MATRIXES ARE ALWAYS COLUMN MAJOR ORDERED.
 */
export class PgslMatrixType extends AbstractSyntaxTree<TypeCst, TypeProperties> implements IType {
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
     * @returns The matrix dimensions as [rows, columns].
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
            default:
                return [2, 2]; // Default fallback
        }
    }

    /**
     * Gets the matrix type name for given dimensions.
     * 
     * @param pColumnCount - The number of columns in the matrix.
     * @param pRowCount - The number of rows in the matrix.
     * 
     * @returns The corresponding matrix type name, or null if dimensions are invalid.
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
                throw new Error(`Invalid matrix dimensions: ${pColumnCount}x${pRowCount}`);
        }
    }

    private readonly mColumnCount: number;
    private readonly mInnerType: IType;
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
    public get innerType(): IType {
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
    public constructor(pColumnCount: number, pRowCount: number, pInnerType: IType) {
        super({ type: 'Type', range: [0, 0, 0, 0] });

        // Set data.
        this.mInnerType = pInnerType;
        this.mColumnCount = pColumnCount;
        this.mRowCount = pRowCount;

        // Get matrix dimensions.
        //this.m = this.getMatrixDimensions(pColumnCount, pRowCount);

        // Create underlying vector type based on matrix type.
        this.mVectorTypeDefinition = new PgslVectorType(this.mColumnCount, pInnerType);
    }

    /**
     * Compare this matrix type with a target type for equality.
     * Two matrix types are equal if they have the same dimensions and inner type.
     * 
     * @param pTarget - Target comparison type. 
     * 
     * @returns True when both types have the same dimensions and inner type.
     */
    public equals(pTarget: IType): boolean {
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
    public isExplicitCastableInto(pTarget: IType): boolean {
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
    public isImplicitCastableInto(pTarget: IType): boolean {
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
    protected override onProcess(pContext: AbstractSyntaxTreeContext): TypeProperties {
        // Process vector type definition.
        this.mVectorTypeDefinition.process(pContext);

        // Must be Float.
        const lFloat32Type = new PgslNumericType(PgslNumericType.typeName.float32).process(pContext);
        const lFloat16Type = new PgslNumericType(PgslNumericType.typeName.float16).process(pContext);
        const lAbstractFloatType = new PgslNumericType(PgslNumericType.typeName.abstractFloat).process(pContext);
        if (!this.mInnerType.isImplicitCastableInto(lFloat32Type) && !this.mInnerType.isImplicitCastableInto(lFloat16Type) && !this.mInnerType.isImplicitCastableInto(lAbstractFloatType)) {
            pContext.pushIncident('Matrix type must be a Float');
        }

         // Build meta types.
        const lMetaTypeList: Array<string> = new Array<string>();
        for (const lMetaType of this.mInnerType.data.metaTypes) {
            lMetaTypeList.push(`Matrix<${lMetaType}>`);
            lMetaTypeList.push(`Matrix${this.mColumnCount}${this.mRowCount}<${lMetaType}>`);
        }

        // Add meta type for all vectors.
        lMetaTypeList.push(`Matrix${this.mColumnCount}${this.mRowCount}`);
        lMetaTypeList.push('Matrix');

        return {
            // Meta information.
            metaTypes: lMetaTypeList,

            // Always accessible as composite (swizzle) or index.
            composite: true,
            indexable: true,

            // Copy of inner type properties.
            concrete: this.innerType.data.concrete,
            scalar: this.innerType.data.scalar,
            plain: this.innerType.data.plain,
            storable: this.mInnerType.data.storable,
            hostShareable: this.mInnerType.data.hostShareable,
            constructible: this.mInnerType.data.constructible,
            fixedFootprint: this.mInnerType.data.fixedFootprint
        };
    }
}

/**
 * Type representing all available matrix type names.
 * Derived from the static typeName getter for type safety.
 */
type PgslMatrixTypeName = (typeof PgslMatrixType.typeName)[keyof typeof PgslMatrixType.typeName];