import { UnknownPgslSyntaxTree } from '../base-pgsl-syntax-tree';
import { PgslBlockStatementSyntaxTree, PgslBlockStatementSyntaxTreeStructureData } from './pgsl-block-statement-syntax-tree';
import { PgslVariableDeclarationStatementSyntaxTree, PgslVariableDeclarationStatementSyntaxTreeStructureData } from './pgsl-variable-declaration-statement-syntax-tree';

/**
 * Expression factory.
 */
export class PgslStatementSyntaxTreeFactory {
    /**
     * Create a new instance of a pgsl expression syntax tree from its structure data.
     * 
     * @param pData - Syntax tree structure data for a pgsl expression.
     * 
     * @returns  a new instance of a pgsl expression syntax tree.
     */
    public static createFrom(pData: PgslStatementSyntaxTreeStructureData, pParent: UnknownPgslSyntaxTree | null): PgslStatementSyntaxTree {
        // Create new syntax tree object for all expression types.
        switch (pData.meta.type) {
            // Statement
            case 'Statement-Block': return new PgslBlockStatementSyntaxTree().applyDataStructure(pData as PgslBlockStatementSyntaxTreeStructureData, pParent);

            // Linear statement
            case 'Statement-VariableDeclaration': return new PgslVariableDeclarationStatementSyntaxTree().applyDataStructure(pData as PgslVariableDeclarationStatementSyntaxTreeStructureData, pParent);
        }
    }
}


export type PgslStatementSyntaxTree = PgslBlockStatementSyntaxTree | PgslVariableDeclarationStatementSyntaxTree;

export type PgslStatementSyntaxTreeStructureData = ReturnType<PgslStatementSyntaxTree['retrieveDataStructure']>;