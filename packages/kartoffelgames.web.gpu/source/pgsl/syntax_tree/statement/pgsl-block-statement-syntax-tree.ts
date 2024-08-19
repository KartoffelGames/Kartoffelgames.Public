import { Dictionary } from '@kartoffelgames/core';
import { BasePgslSyntaxTree, PgslSyntaxTreeDataStructure } from '../base-pgsl-syntax-tree';
import { PgslStatementSyntaxTree, PgslStatementSyntaxTreeFactory, PgslStatementSyntaxTreeStructureData } from './pgsl-statement-factory';
import { PgslVariableDeclarationStatementSyntaxTree, PgslVariableDeclarationStatementSyntaxTreeStructureData } from './pgsl-variable-declaration-statement-syntax-tree';

/**
 * Block statement. Handles scoped values.
 */
export class PgslBlockStatementSyntaxTree extends BasePgslSyntaxTree<PgslBlockStatementSyntaxTreeStructureData['meta']['type'], PgslBlockStatementSyntaxTreeStructureData['data']> {
    private readonly mDeclaredVariables: Dictionary<string, boolean>;
    private readonly mStatementList: Array<PgslStatementSyntaxTree>;

    /**
     * Get all scoped variables of scope.
     */
    protected override get scopedVariables(): Dictionary<string, boolean> {
        // Read parent scoped variables
        const lParentVariables: Dictionary<string, boolean> = super.scopedVariables;

        // Append current scoped.
        for (const lVariable of this.mDeclaredVariables) {
            lParentVariables.set(...lVariable);
        }

        return lParentVariables;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super('Statement-Block');

        this.mStatementList = new Array<PgslStatementSyntaxTree>();
        this.mDeclaredVariables = new Dictionary<string, boolean>();
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected override applyData(pData: PgslBlockStatementSyntaxTreeStructureData['data']): void {
        // Save statement list.
        for (const lStatement of pData.statements) {
            // Save any scoped variable as declared variable.
            if (lStatement.meta.type === 'Statement-VariableDeclaration') {
                // Build variable declaration.
                const lVariableDeclaration: PgslVariableDeclarationStatementSyntaxTree = new PgslVariableDeclarationStatementSyntaxTree().applyDataStructure(lStatement as PgslVariableDeclarationStatementSyntaxTreeStructureData, this);

                // Save declaration to current scope.
                this.mDeclaredVariables.set(lVariableDeclaration.name, lVariableDeclaration.constant);

                // Save statement in statement list.
                this.mStatementList.push(lVariableDeclaration);
                continue;
            }

            // Save statement.
            this.mStatementList.push(PgslStatementSyntaxTreeFactory.createFrom(lStatement, this));
        }
    }

    /**
     * Retrieve data of current structure.
     */
    protected override retrieveData(): PgslBlockStatementSyntaxTreeStructureData['data'] {
        // Basic structure data.
        return {
            statements: this.mStatementList.map((pParameter) => { return pParameter.retrieveDataStructure(); })
        };
    }
}

export type PgslBlockStatementSyntaxTreeStructureData = PgslSyntaxTreeDataStructure<'Statement-Block', {
    statements: Array<PgslStatementSyntaxTreeStructureData>;
}>;