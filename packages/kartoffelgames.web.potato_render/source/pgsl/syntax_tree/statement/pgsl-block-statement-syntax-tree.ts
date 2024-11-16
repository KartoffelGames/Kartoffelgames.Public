import { Dictionary } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { IPgslVariableDeclarationSyntaxTree } from '../interface/i-pgsl-variable-declaration-syntax-tree.interface';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';
import { PgslVariableDeclarationStatementSyntaxTree } from './pgsl-variable-declaration-statement-syntax-tree';

/**
 * PGSL structure holding a list of statements. Handles scoped values.
 */
export class PgslBlockStatementSyntaxTree extends BasePgslStatementSyntaxTree {
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
     * @param pStatements - Block statements.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pStatements: Array<BasePgslStatementSyntaxTree>, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);

        // Set data.
        this.mStatementList = pStatements;

        // Save declared variables.
        this.mDeclaredVariables = new Set<PgslVariableDeclarationStatementSyntaxTree>();
        for (const lStatement of pStatements) {
            // Only save variable declarations.
            if (!(lStatement instanceof PgslVariableDeclarationStatementSyntaxTree)) {
                continue;
            }

            // Save declaration to current scope.
            this.mDeclaredVariables.add(lStatement);
        }
    }
}