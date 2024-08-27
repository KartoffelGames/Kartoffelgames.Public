import { Exception } from '@kartoffelgames/core';
import { PgslVectorTypeName } from '../enum/pgsl-vector-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';
import { PgslBooleanTypeDefinitionSyntaxTree } from './pgsl-boolean-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from './pgsl-numeric-type-definition-syntax-tree';

export class PgslVectorTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslVectorTypeDefinitionSyntaxTreeStructureData> {
    private readonly mInnerType: BasePgslTypeDefinitionSyntaxTree;
    private readonly mTypeName: PgslVectorTypeName;

    /**
     * Inner type of vector.
     */
    public get innerType(): BasePgslTypeDefinitionSyntaxTree {
        return this.mInnerType;
    }

    /**
     * Typename of vector type.
     */
    public get typeName(): PgslVectorTypeName {
        return this.mTypeName;
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
    public constructor(pData: PgslVectorTypeDefinitionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mTypeName = pData.typeName;
        this.mInnerType = pData.innerType;
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
     * On equal check of type definitions.
     * 
     * @param pTarget - Target type definition.
     */
    protected override onEqual(pTarget: this): boolean {
        return this.mInnerType === pTarget.innerType && this.mInnerType.equals(pTarget.innerType);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Must be scalar.
        if(!(this.mInnerType instanceof PgslNumericTypeDefinitionSyntaxTree) && !(this.mInnerType instanceof PgslBooleanTypeDefinitionSyntaxTree)) {
            throw new Exception('Vector type must be a scalar value', this);
        }
    }
}

export type PgslVectorTypeDefinitionSyntaxTreeStructureData = {
    typeName: PgslVectorTypeName;
    innerType: BasePgslTypeDefinitionSyntaxTree;
};