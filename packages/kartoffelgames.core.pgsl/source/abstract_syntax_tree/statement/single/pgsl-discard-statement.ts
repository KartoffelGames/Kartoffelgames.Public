import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import type { BasePgslSyntaxTreeMeta } from '../../abstract-syntax-tree.ts';
import { PgslStatement } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure holding a discard statement.
 */
export class PgslDiscardStatement extends PgslStatement {
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
    protected override onTrace(_pTrace: PgslTrace): void {
        // Nothing really to validate.
    }
}