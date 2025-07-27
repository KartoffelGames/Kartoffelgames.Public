import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree.ts';
import { PgslFunctionCallExpressionSyntaxTree } from '../expression/single_value/pgsl-function-call-expression-syntax-tree.ts';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree.ts';

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
        super(pMeta, false);

        // Create and validate expression instead.
        this.mFunctionExpression = new PgslFunctionCallExpressionSyntaxTree(pName, pParameterList, pMeta);

        // Add function expression as child.
        this.appendChild(this.mFunctionExpression);
    }
}