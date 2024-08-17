import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../base-pgsl-syntax-tree';
import { PgslTypeDefinitionSyntaxTree, PgslTypeDefinitionSyntaxTreeStructureData } from '../general/pgsl-type-definition-syntax-tree';

/**
 * PGSL syntax tree for a alias declaration.
 */
export class PgslAliasDeclarationSyntaxTree extends BasePgslSyntaxTree<PgslAliasDeclarationSyntaxTreeStructureData['meta']['type'], PgslAliasDeclarationSyntaxTreeStructureData['data']> {
    private mName: string;
    private mTypeDefinition: PgslTypeDefinitionSyntaxTree | null;

    /**
     * Variable name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Variable name.
     */
    public get type(): PgslTypeDefinitionSyntaxTree {
        if (!this.mTypeDefinition) {
            throw new Exception('Alias declaration not initialized', this);
        }

        return this.mTypeDefinition;
    }

    /**
     * Constructor.
     */
    public constructor(pBuildIn: boolean = false) {
        super('Declaration-AliasDeclaration', pBuildIn);

        this.mName = '';
        this.mTypeDefinition = null;
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslAliasDeclarationSyntaxTreeStructureData['data']): void {
        this.mName = pData.name;
        this.mTypeDefinition = new PgslTypeDefinitionSyntaxTree().applyDataStructure(pData.type, this);
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslAliasDeclarationSyntaxTreeStructureData['data'] {
        if (!this.mTypeDefinition) {
            throw new Exception('Alias declaration not initialized', this);
        }

        return {
            name: this.mName,
            type: this.mTypeDefinition?.retrieveDataStructure()
        };
    }
}

export type PgslAliasDeclarationSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Declaration-AliasDeclaration', {
    name: string;
    type: PgslTypeDefinitionSyntaxTreeStructureData;
}>;

export type PgslAliasDeclarationSyntaxTreeData = PgslAliasDeclarationSyntaxTreeStructureData['meta'];