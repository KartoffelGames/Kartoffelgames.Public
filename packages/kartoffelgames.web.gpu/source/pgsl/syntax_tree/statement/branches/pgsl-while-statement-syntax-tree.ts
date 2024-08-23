import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslBlockStatementSyntaxTree } from '../pgsl-block-statement-syntax-tree';

/**
 * PGSL structure for a while statement.
 */
export class PgslWhileStatementSyntaxTree extends BasePgslExpressionSyntaxTree<PgslWhileStatementSyntaxTreeStructureData> {
    private readonly mBlock: PgslBlockStatementSyntaxTree;
    private readonly mExpression: BasePgslExpressionSyntaxTree;

    /**
     * If block.
     */
    public get block(): PgslBlockStatementSyntaxTree {
        return this.mBlock;
    }


    /**
     * If boolean expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree {
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
    public constructor(pData: PgslWhileStatementSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mExpression = pData.expression;
        this.mBlock = pData.block;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Expression should resolve into a boolean.
    }
}

type PgslWhileStatementSyntaxTreeStructureData = {
    expression: BasePgslExpressionSyntaxTree,
    block: PgslBlockStatementSyntaxTree;
};