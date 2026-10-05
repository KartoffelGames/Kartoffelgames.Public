import { ReturnStatementAst } from '../../../../abstract_syntax_tree/statement/single/return-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of ReturnStatementAst.
 */
export class ReturnStatementAstValidationProcessor extends PgslValidatorProcessor<ReturnStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ReturnStatementAst {
        return ReturnStatementAst;
    }

    /**
     * Validates the PGSL return statement syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: ReturnStatementAst): void {
    }
}
