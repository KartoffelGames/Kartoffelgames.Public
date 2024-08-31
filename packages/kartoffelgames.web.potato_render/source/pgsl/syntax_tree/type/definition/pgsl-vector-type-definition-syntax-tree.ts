import { Exception } from '@kartoffelgames/core';
import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { PgslTypeName } from '../enum/pgsl-type-name.enum';
import { PgslVectorTypeName } from '../enum/pgsl-vector-type-name.enum';
import { BasePgslTypeDefinitionSyntaxTree } from './base-pgsl-type-definition-syntax-tree';
import { PgslNumericTypeDefinitionSyntaxTree } from './pgsl-numeric-type-definition-syntax-tree';

export class PgslVectorTypeDefinitionSyntaxTree extends BasePgslTypeDefinitionSyntaxTree<PgslVectorTypeDefinitionSyntaxTreeStructureData> {
    private readonly mInnerType!: BasePgslTypeDefinitionSyntaxTree;

    /**
     * Inner type of vector.
     */
    public get innerType(): BasePgslTypeDefinitionSyntaxTree {
        return this.mInnerType;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslVectorTypeDefinitionSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pData, pData.typeName as unknown as PgslTypeName, pMeta, pBuildIn);
        if (this.loadedFromCache) {
            return this;
        }

        // Set data.
        this.mInnerType = pData.innerType;
    }

    /**
     * Determinate structures identifier.
     */
    protected determinateIdentifier(this: null, pData: PgslVectorTypeDefinitionSyntaxTreeStructureData): string {
        return `ID:TYPE-DEF_VECTOR->${pData.typeName.toUpperCase()}->${pData.innerType.identifier}`;
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
        if (!(this.mInnerType instanceof PgslNumericTypeDefinitionSyntaxTree) && this.mInnerType.typeName !== PgslTypeName.Boolean) {
            throw new Exception('Vector type must be a scalar value', this);
        }
    }
}

export type PgslVectorTypeDefinitionSyntaxTreeStructureData = {
    typeName: PgslVectorTypeName;
    innerType: BasePgslTypeDefinitionSyntaxTree;
};