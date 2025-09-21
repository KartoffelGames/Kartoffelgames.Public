import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { PgslValidationTrace } from "../pgsl-validation-trace.ts";
import { BasePgslStatement } from './base-pgsl-statement.ts';

/**
 * PGSL structure holding a list of statements. Handles scoped values.
 */
export class PgslBlockStatement extends BasePgslStatement {
    private readonly mStatementList: Array<BasePgslStatement>;

    /**
     * Statements of block.
     */
    public get statements(): Array<BasePgslStatement> {
        return this.mStatementList;
    }

    /**
     * Constructor.
     * 
     * @param pStatements - Block statements.
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pStatements: Array<BasePgslStatement>, pMeta: BasePgslSyntaxTreeMeta) {
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
    protected override onValidateIntegrity(pScope: PgslValidationTrace): void {
        // Create new scope and validate all statements.
        pScope.newScope(this, () => {
            for (const statement of this.mStatementList) {
                statement.validate(pScope);
            }
        });
    }
}