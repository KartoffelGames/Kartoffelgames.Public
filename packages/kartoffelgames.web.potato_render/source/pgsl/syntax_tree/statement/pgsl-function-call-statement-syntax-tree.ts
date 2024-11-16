import { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree';
import { PgslFunctionCallExpressionSyntaxTree } from '../expression/single_value/pgsl-function-call-expression-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';

/**
 * PGSL syntax tree of a function call statement with optional template list.
 */
export class PgslFunctionCallStatementSyntaxTree extends BasePgslStatementSyntaxTree {
    private readonly mFunctionExpression: PgslFunctionCallExpressionSyntaxTree;

    /**
     * Function expression of statement.
     */
    public get functionExpression(): PgslFunctionCallExpressionSyntaxTree {
        return this.mFunctionExpression;
    }

    /**
     * Constructor.
     * 
     * @param pName - Function name.
     * @param pParameterList - Function parameters.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pName: string, pParameterList: Array<BasePgslExpressionSyntaxTree>, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Create and validate expression instead.
        this.mFunctionExpression = new PgslFunctionCallExpressionSyntaxTree(pName, pParameterList, pMeta);
        this.appendChild(this.mFunctionExpression);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        this.mFunctionExpression.validateIntegrity();
    }
}