import { List } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../base-pgsl-syntax-tree';
import { PgslExpressionSyntaxTree, PgslExpressionSyntaxTreeStructureData } from '../expression/pgsl-expression-syntax-tree';
import { PgslTypeDefinition, PgslTypeDefinitionSyntaxTreeStructureData } from './pgsl-type-definition-syntax-tree';

/**
 * Template list parameter.
 */
export class PgslTemplateListSyntaxTree extends BasePgslSyntaxTree<PgslTemplateListSyntaxTreeStructureData['meta']['type'], PgslTemplateListSyntaxTreeStructureData['data']> {
    private readonly mItems: List<PgslTypeDefinition | PgslExpressionSyntaxTree>;

    /**
     * Parameter list.
     */
    public get items(): Array<PgslTypeDefinition | PgslExpressionSyntaxTree> {
        return [...this.mItems];
    }

    /**
     * List size.
     */
    public get size(): number {
        return this.mItems.length;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('General-TemplateList');

        this.mItems = new List<PgslTypeDefinition | PgslExpressionSyntaxTree>();
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(_pData: PgslTemplateListSyntaxTreeStructureData['data']): void {
        throw new Error('Method not implemented.'); // TODO:
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslTemplateListSyntaxTreeStructureData['data'] {
        throw new Error('Method not implemented.'); // TODO:
    }
}

export type PgslTemplateListSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'General-TemplateList', {
    parameter: Array<PgslTypeDefinitionSyntaxTreeStructureData | PgslExpressionSyntaxTreeStructureData>;
}>;

export type PgslTemplateListSyntaxTreeData = PgslTemplateListSyntaxTreeStructureData['meta'];