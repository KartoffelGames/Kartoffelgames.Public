import { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { BasePgslStatementSyntaxTree } from './base-pgsl-statement-syntax-tree.ts';

/**
 * PGSL structure holding a list of statements. Handles scoped values.
 */
export class PgslBlockStatementSyntaxTree extends BasePgslStatementSyntaxTree {
    private readonly mStatementList: Array<BasePgslStatementSyntaxTree>;

    /**
     * Statements of block.
     */
    public get statements(): Array<BasePgslStatementSyntaxTree> {
        return this.mStatementList;
    }

    /**
     * Constructor.
     * 
     * @param pStatements - Block statements.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pStatements: Array<BasePgslStatementSyntaxTree>, pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta, true);

        // Set data.
        this.mStatementList = pStatements;

        // Add statements as child trees.
        this.appendChild(...pStatements);
    }
}