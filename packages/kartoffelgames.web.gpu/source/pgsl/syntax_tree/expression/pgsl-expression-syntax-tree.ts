import { UnknownPgslSyntaxTree } from '../base-pgsl-syntax-tree';
import { PgslLiteralValueExpressionSyntaxTree, PgslLiteralValueExpressionSyntaxTreeStructureData } from './pgsl-literal-value-expression-syntax-tree';
import { PgslVariableNameExpressionSyntaxTree, PgslVariableNameExpressionSyntaxTreeStructureData } from './variable/pgsl-variable-name-expression-syntax-tree';

/**
 * Expression factory.
 */
export class PgslExpressionSyntaxTreeFactory {
    /**
     * Create a new instance of a pgsl expression syntax tree from its structure data.
     * 
     * @param pData - Syntax tree structure data for a pgsl expression.
     * 
     * @returns  a new instance of a pgsl expression syntax tree.
     */
    public static createFrom(pData: PgslExpressionSyntaxTreeStructureData, pParent: UnknownPgslSyntaxTree | null): PgslExpressionSyntaxTree {
        // Create new syntax tree object for all expression types.
        switch (pData.meta.type) {
            case 'Expression-LiteralValue': return new PgslLiteralValueExpressionSyntaxTree().applyDataStructure(pData as PgslLiteralValueExpressionSyntaxTreeStructureData, pParent);
            case 'Expression-VariableName': return new PgslVariableNameExpressionSyntaxTree().applyDataStructure(pData as PgslVariableNameExpressionSyntaxTreeStructureData, pParent);
        }
    }
}

export type PgslExpressionSyntaxTreeStructureData = ReturnType<PgslExpressionSyntaxTree['retrieveDataStructure']>;
export type PgslExpressionSyntaxTree = PgslLiteralValueExpressionSyntaxTree | PgslVariableNameExpressionSyntaxTree;