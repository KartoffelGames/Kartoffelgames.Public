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
        // TODO: Validate the child return expression when present.
        // TODO: Validate that a return without a value is only used in a function overload whose declared return type is void, reading the nearest enclosing function overload with stackContains.
        // TODO: Validate that a return with a value is only used in a function overload with a non-void declared return type.
        // TODO: Validate that the type of the return value converts to the declared return type of the enclosing function overload.
        // TODO: Validate that a constant return value is representable in the declared return type, e.g. no negative value for uint (new).
    }
}
