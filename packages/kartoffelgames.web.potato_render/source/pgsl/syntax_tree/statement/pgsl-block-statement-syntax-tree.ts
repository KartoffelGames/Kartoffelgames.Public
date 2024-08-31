import { Dictionary } from '@kartoffelgames/core';
import { SyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { IPgslVariableDeclarationSyntaxTree } from '../interface/i-pgsl-variable-declaration-syntax-tree.interface';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';
import { PgslVariableDeclarationStatementSyntaxTree } from './pgsl-variable-declaration-statement-syntax-tree';

/**
 * PGSL structure holding a list of statements. Handles scoped values.
 */
export class PgslBlockStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslBlockStatementSyntaxTreeStructureData> {
    private readonly mDeclaredVariables: Set<PgslVariableDeclarationStatementSyntaxTree>;
    private readonly mStatementList: Array<BasePgslStatementSyntaxTree>;

    /**
     * Statements of block.
     */
    public get statements(): Array<BasePgslStatementSyntaxTree> {
        return this.mStatementList;
    }

    /**
     * Get all scoped variables of scope.
     */
    protected override get scopedVariables(): Dictionary<string, IPgslVariableDeclarationSyntaxTree> {
        // Read parent scoped variables
        const lParentVariables: Dictionary<string, IPgslVariableDeclarationSyntaxTree> = super.scopedVariables;

        // Append current scoped variables. Override parent.
        for (const lVariable of this.mDeclaredVariables) {
            lParentVariables.set(lVariable.name, lVariable);
        }

        return lParentVariables;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: PgslBlockStatementSyntaxTreeStructureData, pMeta?: SyntaxTreeMeta, pBuildIn: boolean = false) {
        super(pData, pMeta, pBuildIn);

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
    statements: Array<BasePgslStatementSyntaxTree>;
};