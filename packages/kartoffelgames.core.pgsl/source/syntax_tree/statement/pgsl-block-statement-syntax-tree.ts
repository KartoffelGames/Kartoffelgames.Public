import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../pgsl-syntax-tree-validation-trace.ts";
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
        super(pMeta);

        // Set data.
        this.mStatementList = pStatements;

        // Add statements as child trees.
        this.appendChild(...pStatements);
    }

    /**
     * Transpile current alias declaration into a string.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        // Transpile all statements.
        return `{\n${this.mStatementList.map(statement => statement.transpile()).join('\n')}\n}`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pValidationTrace - Validation trace.
     */
    protected override onValidateIntegrity(pScope: PgslSyntaxTreeValidationTrace): void {
        // Create new scope and validate all statements.
        pScope.newScope(this, () => {
            for (const statement of this.mStatementList) {
                statement.validate(pScope);
            }
        });
    }
}