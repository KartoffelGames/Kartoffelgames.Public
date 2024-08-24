import { PgslAttributeListSyntaxTree } from '../general/pgsl-attribute-list-syntax-tree';
import { PgslTypeDefinitionSyntaxTree } from '../general/pgsl-type-definition-syntax-tree';
import { BasePgslDeclarationSyntaxTree } from './base-pgsl-declaration-syntax-tree';

/**
 * PGSL syntax tree for a struct property declaration.
 */
export class PgslStructPropertyDeclarationSyntaxTree extends BasePgslDeclarationSyntaxTree<PgslStructPropertyDeclarationSyntaxTreeStructureData> {
    private readonly mName: string;
    private readonly mTypeDefinition: PgslTypeDefinitionSyntaxTree;

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
        return this.mTypeDefinition;
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
    public constructor(pData: PgslStructPropertyDeclarationSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pData.attributes, true, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mName = pData.name;
        this.mTypeDefinition = pData.type;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Only valid types.
    }
}

export type PgslStructPropertyDeclarationSyntaxTreeStructureData = {
    attributes: PgslAttributeListSyntaxTree;
    name: string;
    type: PgslTypeDefinitionSyntaxTree;
};