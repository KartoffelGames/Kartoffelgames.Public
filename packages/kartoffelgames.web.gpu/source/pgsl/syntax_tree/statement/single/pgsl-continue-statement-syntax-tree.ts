import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree';

/**
 * PGSL structure holding a continue statement.
 */
export class PgslContinueStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslContinueStatementSyntaxTreeStructureData> {
    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslContinueStatementSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing to validate eighter.
    }
}

export type PgslContinueStatementSyntaxTreeStructureData = {};