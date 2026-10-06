import { FunctionCallStatementAst, type FunctionCallStatementAstData } from '../../../../abstract_syntax_tree/statement/execution/function-call-statement-ast.ts';
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
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: FunctionCallStatementAstData): void {
        // TODO: Validate the child function call expression.
        // TODO: Validate that the called function is no built-in function with a non-void return type, because WGSL declares those built-ins must_use and rejects them as a whole statement, skipped when the call resolved no function (new).
    }
}
