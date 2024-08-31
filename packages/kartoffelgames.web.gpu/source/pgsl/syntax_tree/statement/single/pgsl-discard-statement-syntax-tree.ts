import { SyntaxTreeMeta } from '../../base-pgsl-syntax-tree';
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a discard statement.
 */
export class PgslDiscardStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslDiscardStatementSyntaxTreeStructureData> {
    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslDiscardStatementSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing to validate eighter.
    }
}

export type PgslDiscardStatementSyntaxTreeStructureData = {};