import { Exception } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../../base-pgsl-syntax-tree';
import { PgslExpressionSyntaxTree, PgslExpressionSyntaxTreeFactory, PgslExpressionSyntaxTreeStructureData } from '../pgsl-expression-syntax-tree-factory';


export class PgslParenthesizedExpressionSyntaxTree extends BasePgslSyntaxTree<PgslParenthesizedExpressionSyntaxTreeStructureData['meta']['type'], PgslParenthesizedExpressionSyntaxTreeStructureData['data']> {
    private mExpression: PgslExpressionSyntaxTree | null;

    /**
     * Expression reference.
     */
    public get expression(): PgslExpressionSyntaxTree {
        if (this.mExpression === null) {
            throw new Exception('Expression not set.', this);
        }

        return this.mExpression;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Expression-Parenthesized');

        this.mExpression = null;
    }
    
    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslParenthesizedExpressionSyntaxTreeStructureData['data']): void {
        this.mExpression = PgslExpressionSyntaxTreeFactory.createFrom(pData.expression, this);
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslParenthesizedExpressionSyntaxTreeStructureData['data'] {
        // Value validation.
        if (this.mExpression === null) {
            throw new Exception('Expression not set.', this);
        }

        return {
            expression: this.mExpression.retrieveDataStructure()
        };
    }
}

export type PgslParenthesizedExpressionSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Expression-Parenthesized', {
    expression: PgslExpressionSyntaxTreeStructureData;
}>;