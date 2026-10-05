import { IfStatementAst } from '../../../../abstract_syntax_tree/statement/branch/if-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of IfStatementAst.
 */
export class IfStatementAstValidationProcessor extends PgslValidatorProcessor<IfStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof IfStatementAst {
        return IfStatementAst;
    }

    /**
     * Validates the PGSL if statement syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: IfStatementAst): void {
    }
}
