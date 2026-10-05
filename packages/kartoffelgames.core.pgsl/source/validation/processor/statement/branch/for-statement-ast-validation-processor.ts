import { ForStatementAst } from '../../../../abstract_syntax_tree/statement/branch/for-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of ForStatementAst.
 */
export class ForStatementAstValidationProcessor extends PgslValidatorProcessor<ForStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ForStatementAst {
        return ForStatementAst;
    }

    /**
     * Validates the PGSL for statement syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: ForStatementAst): void {
    }
}
