import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a break statement.
 */
export class PgslBreakStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslBreakStatementSyntaxTreeStructureData> {
    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslBreakStatementSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // TODO: Only in Loops and switch.
    }
}

export type PgslBreakStatementSyntaxTreeStructureData = {};