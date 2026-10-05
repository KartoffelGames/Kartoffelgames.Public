import { FunctionCallStatementAst } from '../../../../abstract_syntax_tree/statement/execution/function-call-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of FunctionCallStatementAst.
 */
export class FunctionCallStatementAstValidationProcessor extends PgslValidatorProcessor<FunctionCallStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof FunctionCallStatementAst {
        return FunctionCallStatementAst;
    }

    /**
     * Validates the PGSL function call statement syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: FunctionCallStatementAst): void {
    }
}
