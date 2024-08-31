import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a continue statement.
 */
export class PgslContinueStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslContinueStatementSyntaxTreeStructureData> {
    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslContinueStatementSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        // Create and check if structure was loaded from cache. Skip additional processing by returning early.
        super(pData, pMeta, pBuildIn);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Only in Loops
    }
}

export type PgslContinueStatementSyntaxTreeStructureData = {};