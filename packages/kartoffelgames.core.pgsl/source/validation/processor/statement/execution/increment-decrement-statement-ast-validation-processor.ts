import { IncrementDecrementStatementAst, type IncrementDecrementStatementAstData } from '../../../../abstract_syntax_tree/statement/execution/increment-decrement-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of IncrementDecrementStatementAst.
 */
export class IncrementDecrementStatementAstValidationProcessor extends PgslValidatorProcessor<IncrementDecrementStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof IncrementDecrementStatementAst {
        return IncrementDecrementStatementAst;
    }

    /**
     * Validates the PGSL increment decrement statement syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: IncrementDecrementStatementAstData): void {
        // TODO: Validate the child expression.
        // TODO: Validate that the operator is ++ or --.
        // TODO: Validate that the expression is a storage expression, like a variable name, an indexed value, a struct property or a dereferenced pointer.
        // TODO: Validate that the expression is a variable and not a const, param, function parameter or other fixed value.
        // TODO: Validate that the memory behind the expression is writable, which rejects uniform variables and storage variables without AccessMode read_write, also when reached through a pointer (new).
        // TODO: Validate that the type of the expression is int or uint, as WGSL only increments and decrements concrete integer scalars (new).
    }
}
