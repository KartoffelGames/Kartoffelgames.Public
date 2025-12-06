import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslStatement } from '../pgsl-statement.ts';

/**
 * PGSL structure holding a break statement.
 */
export class PgslBreakStatement extends PgslStatement {
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
        // Only in Loops and switch.
        if (!pTrace.currentScope.hasScope('loop') && !pTrace.currentScope.hasScope('switch')) {
            pTrace.pushIncident('Break statement can only be used within loops or switch statements.', this);
        }
    }
}