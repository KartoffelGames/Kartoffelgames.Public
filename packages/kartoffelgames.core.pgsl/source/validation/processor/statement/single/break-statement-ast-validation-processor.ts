import { BreakStatementAst } from '../../../../abstract_syntax_tree/statement/single/break-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of BreakStatementAst.
 */
export class BreakStatementAstValidationProcessor extends PgslValidatorProcessor<BreakStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof BreakStatementAst {
        return BreakStatementAst;
    }

    /**
     * Validates the PGSL break statement syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: BreakStatementAst): void {
    }
}
