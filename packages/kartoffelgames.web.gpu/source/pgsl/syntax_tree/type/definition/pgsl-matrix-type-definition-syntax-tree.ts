import { Dictionary, Exception } from '@kartoffelgames/core';
import { PgslMatrixTypeName } from '../enum/pgsl-matrix-type-name.enum';
import { PgslTypeName } from '../enum/pgsl-type-name.enum';
import { PgslVectorTypeName } from '../enum/pgsl-vector-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from './pgsl-numeric-type-definition-syntax-tree';
import { PgslVectorTypeDefinitionSyntaxTree } from './pgsl-vector-type-definition-syntax-tree';

export class PgslMatrixTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslMatrixTypeDefinitionSyntaxTreeStructureData> {
    private readonly mInnerType!: BasePgslTypeDefinitionSyntaxTree;
    private mVectorType!: PgslVectorTypeDefinitionSyntaxTree | null;

    /**
     * Inner type of matrix.
     */
    public get innerType(): BasePgslTypeDefinitionSyntaxTree {
        return this.mInnerType;
    }

    /**
     * Inner vector type.
     */
    public get vectorType(): PgslVectorTypeDefinitionSyntaxTree {
        this.ensureValidity();

        // Init value.
        if (this.mVectorType === null) {
            this.mVectorType = this.determinateVectorType();
        }

        return this.mVectorType;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslMatrixTypeDefinitionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        const lIdentifier: string = `ID:MATRIX->${pData.typeName.toUpperCase()}->${pData.innerType.identifier}`;

        // Return cached when available.
        if (BasePgslTypeDefinitionSyntaxTree.mTypeCache.has(lIdentifier)) {
            return BasePgslTypeDefinitionSyntaxTree.mTypeCache.get(lIdentifier)! as PgslMatrixTypeDefinitionSyntaxTree;
        }

        // Create. Matrix typename is convertable to general typename. 
        super(pData.typeName as unknown as PgslTypeName, lIdentifier, pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set cache.
        BasePgslTypeDefinitionSyntaxTree.mTypeCache.set(lIdentifier, this);

        // Set data.
        this.mInnerType = pData.innerType;

        // Set empty data.
        this.mVectorType = null;
    }

    /**
     * Determinate if declaration is a composite type.
     */
    protected override determinateIsComposite(): boolean {
        return true;
    }

    /**
     * Determinate if declaration is a constructable.
     */
    protected override determinateIsConstructable(): boolean {
        return this.mInnerType.isConstructable;
    }

    /**
     * Determinate if declaration has a fixed byte length.
     */
    protected override determinateIsFixed(): boolean {
        return this.mInnerType.isFixed;
    }

    /**
     * Determinate if composite value with properties that can be access by index.
     */
    protected override determinateIsIndexable(): boolean {
        return true;
    }

    /**
     * Determinate if declaration is a plain type.
     */
    protected override determinateIsPlain(): boolean {
        return this.mInnerType.isPlainType;
    }

    /**
     * Determinate if is sharable with the host.
     */
    protected override determinateIsShareable(): boolean {
        return this.mInnerType.isShareable;
    }

    /**
     * Determinate if value is storable in a variable.
     */
    protected override determinateIsStorable(): boolean {
        return this.mInnerType.isStorable;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Must be scalar.
        if (!(this.mInnerType instanceof PgslNumericTypeDefinitionSyntaxTree)) {
            throw new Exception('Matrix type must be a numeric value', this);
        }
    }

    /**
     * Determinate if value is storable in a variable.
     */
    private determinateVectorType(): PgslVectorTypeDefinitionSyntaxTree {
        // Create mapping for matrix type to vector type.
        const lMatrixToVectorMapping: Dictionary<PgslMatrixTypeName, PgslVectorTypeName> = new Dictionary<PgslMatrixTypeName, PgslVectorTypeName>();
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix22, PgslVectorTypeName.Vector2);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix23, PgslVectorTypeName.Vector3);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix24, PgslVectorTypeName.Vector4);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix32, PgslVectorTypeName.Vector2);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix33, PgslVectorTypeName.Vector3);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix34, PgslVectorTypeName.Vector4);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix42, PgslVectorTypeName.Vector2);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix43, PgslVectorTypeName.Vector3);
        lMatrixToVectorMapping.set(PgslMatrixTypeName.Matrix44, PgslVectorTypeName.Vector4);

        // Create vector type.
        return new PgslVectorTypeDefinitionSyntaxTree({
            typeName: lMatrixToVectorMapping.get(this.typeName as unknown as PgslMatrixTypeName)!,
            innerType: this.mInnerType,
        }, 0, 0, 0, 0).setParent(this).validateIntegrity();
    }
}

export type PgslMatrixTypeDefinitionSyntaxTreeStructureData = {
    typeName: PgslMatrixTypeName;
    innerType: BasePgslTypeDefinitionSyntaxTree;
};