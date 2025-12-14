import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import type { BasePgslSyntaxTreeMeta } from '../../abstract-syntax-tree.ts';
import type { ExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { PgslFunctionCallExpression } from '../../expression/single_value/pgsl-function-call-expression.ts';
import { PgslStatement } from '../i-statement-ast.interface.ts';

/**
 * PGSL syntax tree of a function call statement with optional template list.
 */
export class PgslFunctionCallStatement extends PgslStatement {
    private readonly mFunctionExpression: PgslFunctionCallExpression;

    /**
     * Function expression of statement.
     */
    public get functionExpression(): PgslFunctionCallExpression {
        return this.mFunctionExpression;
    }

    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     * @param pName - Function name.
     * @param pParameterList - Function parameters.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pName: string, pParameterList: Array<ExpressionAst>) {
        super(pMeta);

        // Create and validate expression instead.
        this.mFunctionExpression = new PgslFunctionCallExpression(pName, pParameterList, pMeta);

        // Add function expression as child.
        this.appendChild(this.mFunctionExpression);
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        this.mFunctionExpression.trace(pTrace);
    }
}