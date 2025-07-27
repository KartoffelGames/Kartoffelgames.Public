import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree.ts';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree.ts';

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
        super(pMeta, false);

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