import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import type { BasePgslExpressionSyntaxTree } from '../expression/base-pgsl-expression-syntax-tree.ts';
import { PgslFunctionCallExpressionSyntaxTree } from '../expression/single_value/pgsl-function-call-expression-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
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
     * @param pMeta - Syntax tree meta data.
     * @param pName - Function name.
     * @param pParameterList - Function parameters.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pName: string, pParameterList: Array<BasePgslExpressionSyntaxTree>) {
        super(pMeta);

        // Create and validate expression instead.
        this.mFunctionExpression = new PgslFunctionCallExpressionSyntaxTree(pName, pParameterList, pMeta);

        // Add function expression as child.
        this.appendChild(this.mFunctionExpression);
    }

    /**
     * Transpiles the statement to a string representation.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        return this.mFunctionExpression.transpile() + ';';
    }

    /**
     * Validate data of current structure.
     * 
     * @param pValidationTrace - Validation trace.
     */
    protected override onValidateIntegrity(pValidationTrace: PgslSyntaxTreeValidationTrace): void {
        this.mFunctionExpression.validate(pValidationTrace);
    }
}