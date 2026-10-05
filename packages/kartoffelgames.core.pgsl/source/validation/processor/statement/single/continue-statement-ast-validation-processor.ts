import { ContinueStatementAst } from '../../../../abstract_syntax_tree/statement/single/continue-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of ContinueStatementAst.
 */
export class ContinueStatementAstValidationProcessor extends PgslValidatorProcessor<ContinueStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ContinueStatementAst {
        return ContinueStatementAst;
    }

    /**
     * Validates the PGSL continue statement syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: ContinueStatementAst): void {
    }
}
