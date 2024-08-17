import { List } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../base-pgsl-syntax-tree';
import { PgslExpression } from '../expression/pgsl-expression-syntax-tree';
import { PgslTypeDefinition } from '../type/pgsl-type-definition';

/**
 * Template list parameter.
 */
export class PgslTemplateListSyntaxTree extends BasePgslSyntaxTree<'TemplateList', {}> {
    private readonly mItems: List<PgslTypeDefinition | PgslExpression>;

    /**
     * Parameter list.
     */
    public get items(): Array<PgslTypeDefinition | PgslExpression> {
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
        super('TemplateList');

        this.mItems = new List<PgslTypeDefinition | PgslExpression>();
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

export type PgslTemplateListSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'TemplateList', {
    parameter: Array<PgslTypeDefinitionSyntaxTreeStructureData | PgslExpressionSyntaxTreeStructureData>
}>;

export type PgslTemplateListSyntaxTreeData = PgslTemplateListSyntaxTreeStructureData['meta'];