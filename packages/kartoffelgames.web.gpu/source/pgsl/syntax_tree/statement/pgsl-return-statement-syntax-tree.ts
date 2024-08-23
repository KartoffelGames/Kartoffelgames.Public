import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a return statement with an optional expression.
 */
export class PgslReturnStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslReturnStatementSyntaxTreeStructureData> {
    private readonly mExpression: BasePgslExpressionSyntaxTree | null;

    /**
     * Expression reference.
     */
    public get expression(): BasePgslExpressionSyntaxTree | null {
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
    public constructor(pData: PgslReturnStatementSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        this.mExpression = pData.expression ?? null;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: parent function return type should match expression type.
    }
}

export type PgslReturnStatementSyntaxTreeStructureData = {
    expression?: BasePgslExpressionSyntaxTree;
};