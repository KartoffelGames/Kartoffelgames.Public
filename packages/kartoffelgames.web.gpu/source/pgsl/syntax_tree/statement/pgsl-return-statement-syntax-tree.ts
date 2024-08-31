import { SyntaxTreeMeta } from '../base-pgsl-syntax-tree';
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
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslReturnStatementSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

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