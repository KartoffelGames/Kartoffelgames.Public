import { Dictionary } from '@kartoffelgames/core';
import { PgslSyntaxTreeInitData } from '../base-pgsl-syntax-tree';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';
import { PgslVariableDeclarationStatementSyntaxTree } from './pgsl-variable-declaration-statement-syntax-tree';

/**
 * PGSL structure holding a list of statements. Handles scoped values.
 */
export class PgslBlockStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslBlockStatementSyntaxTreeStructureData> {
    private readonly mDeclaredVariables: Set<PgslVariableDeclarationStatementSyntaxTree>;
    private readonly mStatementList: Array<BasePgslStatementSyntaxTree<PgslSyntaxTreeInitData>>;

    /**
     * Get all scoped variables of scope.
     */
    protected override get scopedVariables(): Dictionary<string, boolean> {
        // Read parent scoped variables
        const lParentVariables: Dictionary<string, boolean> = super.scopedVariables;

        // Append current scoped.
        for (const lVariable of this.mDeclaredVariables) {
            lParentVariables.set(lVariable.name, lVariable.constant);
        }

        return lParentVariables;
    }

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
    public constructor(pData: PgslBlockStatementSyntaxTreeStructureData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number) {
        super(pData, pStartColumn, pStartLine, pEndColumn, pEndLine);

        // Set data.
        this.mStatementList = pData.statements;

        // Save declared variables.
        this.mDeclaredVariables = new Set<PgslVariableDeclarationStatementSyntaxTree>();
        for (const lStatement of pData.statements) {
            // Only save variable declarations.
            if (!(lStatement instanceof PgslVariableDeclarationStatementSyntaxTree)) {
                continue;
            }

            // Save declaration to current scope.
            this.mDeclaredVariables.add(lStatement);
        }
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(): void {
        // Nothing to validate eighter.
    }
}

type PgslBlockStatementSyntaxTreeStructureData = {
    statements: Array<BasePgslStatementSyntaxTree<PgslSyntaxTreeInitData>>;
};