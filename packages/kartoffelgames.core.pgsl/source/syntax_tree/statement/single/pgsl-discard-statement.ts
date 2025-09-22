import type { BasePgslSyntaxTreeMeta } from '../../base-pgsl-syntax-tree.ts';
import { PgslTranspilationTrace } from "../../pgsl-tranpilation-trace.ts";
import { PgslValidationTrace } from "../../pgsl-validation-trace.ts";
import { BasePgslStatement } from '../base-pgsl-statement.ts';

/**
 * PGSL structure holding a discard statement.
 */
export class PgslDiscardStatement extends BasePgslStatement {
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
     * @param pTrace - Transpilation trace.
     * 
     * @returns Transpiled string.
     */
    protected override onTranspile(_pTrace: PgslTranspilationTrace): string {
        return `discard;`;
    }

    /**
     * Validate data of current structure.
     */
    protected override onValidateIntegrity(_pValidationTrace: PgslValidationTrace): void {
        // Nothing really to validate.
    }
}