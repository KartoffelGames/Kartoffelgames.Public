import { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a continue statement.
 */
export class PgslContinueStatementSyntaxTree extends BasePgslStatementSyntaxTree {
    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta, false);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Only in Loops
    }
}