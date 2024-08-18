import { List } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../base-pgsl-syntax-tree';
import { PgslExpressionSyntaxTree, PgslExpressionSyntaxTreeFactory, PgslExpressionSyntaxTreeStructureData } from '../expression/pgsl-expression-syntax-tree-factory';
import { PgslTypeDefinitionSyntaxTree, PgslTypeDefinitionSyntaxTreeStructureData } from './pgsl-type-definition-syntax-tree';

/**
 * Template list parameter.
 */
export class PgslTemplateListSyntaxTree extends BasePgslSyntaxTree<PgslTemplateListSyntaxTreeStructureData['meta']['type'], PgslTemplateListSyntaxTreeStructureData['data']> {
    private readonly mItems: List<PgslTypeDefinitionSyntaxTree | PgslExpressionSyntaxTree>;

    /**
     * Parameter list.
     */
    public get items(): Array<PgslTypeDefinitionSyntaxTree | PgslExpressionSyntaxTree> {
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

        this.mItems = new List<PgslTypeDefinitionSyntaxTree | PgslExpressionSyntaxTree>();
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslTemplateListSyntaxTreeStructureData['data']): void {
        for (const lParameter of pData.parameterList) {
            // Set type definition parameter.
            if (lParameter.meta.type === 'General-TypeDefinition') {
                this.mItems.push(new PgslTypeDefinitionSyntaxTree().applyDataStructure(lParameter as PgslTypeDefinitionSyntaxTreeStructureData, this));
                continue;
            }

            // Otherwise it is a expression.
            this.mItems.push(PgslExpressionSyntaxTreeFactory.createFrom(lParameter as PgslExpressionSyntaxTreeStructureData, this));
        }
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslTemplateListSyntaxTreeStructureData['data'] {
        return {
            parameterList: this.mItems.map((pParameter) => { return pParameter.retrieveDataStructure(); })
        };
    }
}

export type PgslTemplateListSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'General-TemplateList', {
    parameterList: Array<PgslTypeDefinitionSyntaxTreeStructureData | PgslExpressionSyntaxTreeStructureData>;
}>;