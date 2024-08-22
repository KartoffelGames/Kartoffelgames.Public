import { BasePgslExpressionSyntaxTree } from '../../expression/base-pgsl-expression-syntax-tree';
import { PgslBlockStatementSyntaxTree } from '../pgsl-block-statement-syntax-tree';

/**
 * PGSL structure for a if statement with optional else block.
 */
export class PgslIfStatementSyntaxTree extends BasePgslExpressionSyntaxTree<PgslIfStatementSyntaxTreeStructureData> {
    private readonly mBlock: PgslBlockStatementSyntaxTree;
    private readonly mElse: PgslIfStatementSyntaxTree | PgslBlockStatementSyntaxTree | null;
    private readonly mExpression: BasePgslExpressionSyntaxTree;

    /**
     * If block.
     */
    public get block(): PgslBlockStatementSyntaxTree {
        return this.mBlock;
    }

    /**
     * Else statement of if..
     */
    public get else(): PgslIfStatementSyntaxTree | PgslBlockStatementSyntaxTree | null {
        return this.mElse;
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
    public constructor(pData: PgslIfStatementSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mExpression = pData.expression;
        this.mBlock = pData.block;
        this.mElse = pData.else ?? null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Expression should resolve into a boolean.
    }
}

type PgslIfStatementSyntaxTreeStructureData = {
    expression: BasePgslExpressionSyntaxTree,
    block: PgslBlockStatementSyntaxTree;
    else?: PgslBlockStatementSyntaxTree | PgslIfStatementSyntaxTree;
};