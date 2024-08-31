import { Exception } from '@kartoffelgames/core';
import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';
import { BasePgslTypeDefinitionSyntaxTree } from '../type/definition/base-pgsl-type-definition-syntax-tree';
import { PgslTypeDeclarationSyntaxTree } from '../type/pgsl-type-declaration-syntax-tree';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree';
import { SyntaxTreeMeta } from '../base-pgsl-syntax-tree';

/**
 * PGSL syntax tree for a struct property declaration.
 */
export class PgslStructPropertyDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<PgslStructPropertyDeclarationSyntaxTreeStructureData> {
    private readonly mName: string;
    private readonly mTypeDefinition: PgslTypeDeclarationSyntaxTree;

    /**
     * Property name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Property type.
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
    public constructor(pData: PgslStructPropertyDeclarationSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
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
        // Supports only plain types.
        if (!this.mTypeDefinition.type.isPlainType) {
            throw new Exception('Structure properties can only store plain types.', this);
        }
    }
}

export type PgslStructPropertyDeclarationSyntaxTreeStructureData = {
    attributes: PgslAttributeListSyntaxTree;
    name: string;
    type: PgslTypeDeclarationSyntaxTree;
};