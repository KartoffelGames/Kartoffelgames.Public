import { PgslLiteralValueExpressionSyntaxTree } from './pgsl-literal-value-expression-syntax-tree';

export class PgslExpressionSyntaxTreeFactory {

    public static createFrom(pData: PgslExpressionSyntaxTreeStructureData): PgslExpressionSyntaxTree {
        // Create new syntax tree object for all expression types.
        switch (pData.meta.type) {
            case 'Expression-LiteralValue': return new PgslLiteralValueExpressionSyntaxTree().applyDataStructure(pData);
        }
    }

}

export type PgslExpressionSyntaxTreeStructureData = ReturnType<PgslExpressionSyntaxTree['retrieveDataStructure']>;
export type PgslExpressionSyntaxTree = PgslLiteralValueExpressionSyntaxTree;