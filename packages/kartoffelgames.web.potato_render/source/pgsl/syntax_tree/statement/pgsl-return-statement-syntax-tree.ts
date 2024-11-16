import { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a return statement with an optional expression.
 */
export class PgslReturnStatementSyntaxTree extends BasePgslStatementSyntaxTree {
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
     * @param pExpression - Return expression.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pExpression: BasePgslExpressionSyntaxTree | null, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mExpression = pExpression;

        // Add child trees.
        if (this.mExpression) {
            this.appendChild(this.mExpression);
        }
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: parent function return type should match expression type.
    }
}