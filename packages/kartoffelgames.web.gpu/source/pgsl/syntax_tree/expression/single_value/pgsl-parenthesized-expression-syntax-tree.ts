import { PgslSyntaxTreeInitData } from '../../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../base-pgsl-expression-syntax-tree';
import { BasePgslSingleValueExpressionSyntaxTree } from './base-pgsl-single-value-expression-syntax-tree';

/**
 * PGSL structure holding a expression surrounded with parentheses.
 */
export class PgslParenthesizedExpressionSyntaxTree extends BasePgslSingleValueExpressionSyntaxTree<PgslParenthesizedExpressionSyntaxTreeStructureData> {
    private readonly mExpression: BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> ;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData> {
        return this.mExpression;
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
    public constructor(pData: PgslParenthesizedExpressionSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mExpression = pData.expression;
    }
    
    /**
     * Validate data of current structure.
     */
    protected override onValidate(): void {
        // Nothing to validate 
    }
}

export type PgslParenthesizedExpressionSyntaxTreeStructureData = {
    expression: BasePgslExpressionSyntaxTree<PgslSyntaxTreeInitData>;
};