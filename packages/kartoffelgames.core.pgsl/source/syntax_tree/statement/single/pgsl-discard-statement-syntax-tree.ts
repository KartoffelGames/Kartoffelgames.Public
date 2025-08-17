import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslSyntaxTreeValidationTrace } from "../../pgsl-syntax-tree-validation-trace.ts";
import { BasePgslStatementSyntaxTree } from '../base-pgsl-statement-syntax-tree.ts';

/**
 * PGSL structure holding a discard statement.
 */
export class PgslDiscardStatementSyntaxTree extends BasePgslStatementSyntaxTree {
    /**
     * Constructor.
     * 
     * @param pMeta - Syntax tree meta data.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta) {
        super(pMeta);
    }

    /**
     * Transpile the current structure to a string representation.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(): string {
        return `discard;`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(_pValidationTrace: PgslSyntaxTreeValidationTrace): void {
        // Nothing really to validate.
    }
}