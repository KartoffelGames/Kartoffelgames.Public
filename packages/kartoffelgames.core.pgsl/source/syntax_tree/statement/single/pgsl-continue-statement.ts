import { PgslTrace } from "../../../trace/pgsl-trace.ts";
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { BasePgslStatement } from '../base-pgsl-statement.ts';

/**
 * PGSL structure holding a continue statement.
 */
export class PgslContinueStatement extends BasePgslStatement {
    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);
    }

    /**
     * Validate data of current structure.
     */
    protected override onTrace(pTrace: PgslTrace): void {
        // Only in Loops
        if (!pTrace.currentScope.hasScope('loop')) {
            pTrace.pushIncident('Continue statement can only be used within loops.', this);
        }
    }
}