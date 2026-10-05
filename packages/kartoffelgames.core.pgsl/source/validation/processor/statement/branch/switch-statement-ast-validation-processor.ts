import { SwitchStatementAst } from '../../../../abstract_syntax_tree/statement/branch/switch-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of SwitchStatementAst.
 */
export class SwitchStatementAstValidationProcessor extends PgslValidatorProcessor<SwitchStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof SwitchStatementAst {
        return SwitchStatementAst;
    }

    /**
     * Validates the PGSL switch statement syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: SwitchStatementAst): void {
    }
}
