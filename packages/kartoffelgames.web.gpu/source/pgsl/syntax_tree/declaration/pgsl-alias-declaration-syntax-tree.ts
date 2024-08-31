import { SyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslTypeDeclarationSyntaxTree } from '../type/pgsl-type-declaration-syntax-tree';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslAliasDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<PgslAliasDeclarationSyntaxTreeStructureData> {
    private readonly mName: string;
    private readonly mTypeDefinition: PgslTypeDeclarationSyntaxTree;

    /**
     * Alias name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Alias type definition.
     */
    public get type(): BasePgslTypeDefinitionSyntaxTree {
        return this.mTypeDefinition.type;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslAliasDeclarationSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pData, pData.attributes, pMeta, pBuildIn);

        // Set data.
        this.mName = pData.name;
        this.mTypeDefinition = pData.type;
    }

    /**
     * Determinate if declaration is a constant.
     */
    protected determinateIsConstant(): boolean {
        return true;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Not really something to validate.
    }
}

export type PgslAliasDeclarationSyntaxTreeStructureData = {
    attributes: PgslAttributeListSyntaxTree;
    name: string;
    type: PgslTypeDeclarationSyntaxTree;
};