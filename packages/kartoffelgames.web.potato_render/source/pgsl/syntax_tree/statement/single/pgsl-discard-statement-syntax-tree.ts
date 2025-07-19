import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree.ts';

/**
 * PGSL structure holding a discard statement.
 */
export class PgslDiscardStatementSyntaxTree extends BasePgslStatementSyntaxTree {
    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     */
    public constructor( pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta, false);
    }
}