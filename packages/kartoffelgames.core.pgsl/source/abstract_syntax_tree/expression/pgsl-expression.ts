import type { PgslExpressionTrace } from '../../trace/pgsl-expression-trace.ts';
import type { PgslTrace } from '../../trace/pgsl-trace.ts';
import { BasePgslSyntaxTree, type BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';

/**
 * PGSL base expression.
 */
export abstract class PgslExpression extends BasePgslSyntaxTree {
    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pMeta?: BasePgslSyntaxTreeMeta) {
        super(pMeta);
    }

    /**
     * Trace the expression.
     * 
     * @param pTrace - Transpilation trace.
     */
    public override onTrace(pTrace: PgslTrace): void {
        const lExpressionTrace: PgslExpressionTrace = this.onExpressionTrace(pTrace);
        pTrace.registerExpression(this, lExpressionTrace);
    }

    /**
     * Create expression trace.
     * 
     * @param pTrace - Transpilation trace.
     */
    protected abstract onExpressionTrace(pTrace: PgslTrace): PgslExpressionTrace;
}