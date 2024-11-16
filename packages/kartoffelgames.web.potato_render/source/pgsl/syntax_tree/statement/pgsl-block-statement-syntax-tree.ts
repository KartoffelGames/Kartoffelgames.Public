import { Dictionary } from '@kartoffelgames/core';
import { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree';
import { IPgslVariableDeclarationSyntaxTree } from '../interface/i-pgsl-variable-declaration-syntax-tree.interface';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree';
import { PgslVariableDeclarationStatementSyntaxTree } from './pgsl-variable-declaration-statement-syntax-tree';

/**
 * PGSL structure holding a list of statements. Handles scoped values.
 */
export class PgslBlockStatementSyntaxTree extends BasePgslStatementSyntaxTree<PgslBlockStatementSyntaxTreeSetupData> {
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
        this.ensureSetup();

        // Read parent scoped variables
        const lParentVariables: Dictionary<string, IPgslVariableDeclarationSyntaxTree> = super.scopedVariables;

        // Append current scoped variables. Override parent.
        for (const lVariable of this.setupData.declaredVariables) {
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

        // Add statements as child trees.
        this.appendChild(...pStatements);
    }

    /**
     * Retrieve data of current structure.
     * 
     * @returns setuped data. 
     */
    protected override onSetup(): PgslBlockStatementSyntaxTreeSetupData {
        // Save declared variables.
        const lDeclaredVariables: Set<PgslVariableDeclarationStatementSyntaxTree> = new Set<PgslVariableDeclarationStatementSyntaxTree>();
        for (const lStatement of this.mStatementList) {
            // Only save variable declarations.
            if (!(lStatement instanceof PgslVariableDeclarationStatementSyntaxTree)) {
                continue;
            }

            // Save declaration to current scope.
            lDeclaredVariables.add(lStatement);
        }

        return {
            declaredVariables: lDeclaredVariables
        };
    }
}

type PgslBlockStatementSyntaxTreeSetupData = {
    declaredVariables: Set<PgslVariableDeclarationStatementSyntaxTree>;
};