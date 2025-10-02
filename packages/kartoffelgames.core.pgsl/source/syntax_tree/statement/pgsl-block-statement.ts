import type { BasePgslSyntaxTreeMeta } from '../base-pgsl-syntax-tree.ts';
import { PgslFileMetaInformation } from "../pgsl-build-result.ts";
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
     * @param pTrace - Transpilation trace.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(pTrace: PgslFileMetaInformation): string {
        // Transpile all statements.
        return `{\n${this.mStatementList.map(statement => statement.transpile(pTrace)).join('\n')}\n}`;
    }

    /**
     * Validate data of current structure.
     * 
     * @param pTrace - Validation trace.
     */
    protected override onValidateIntegrity(pTrace: PgslValidationTrace): void {
        // Create new scope and validate all statements.
        pTrace.newScope(this, () => {
            for (const statement of this.mStatementList) {
                statement.validate(pTrace);
            }
        });
    }
}