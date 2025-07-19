import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree.ts';

/**
 * PGSL structure holding a break statement.
 */
export class PgslBreakStatementSyntaxTree extends BasePgslStatementSyntaxTree {
    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta, false);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Only in Loops and switch.
    }
}