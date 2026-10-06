import { AssignmentStatementAst, type AssignmentStatementAstData } from '../../../../abstract_syntax_tree/statement/execution/assignment-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of AssignmentStatementAst.
 */
export class AssignmentStatementAstValidationProcessor extends PgslValidatorProcessor<AssignmentStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof AssignmentStatementAst {
        return AssignmentStatementAst;
    }

    /**
     * Validates the PGSL assignment statement syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: AssignmentStatementAstData): void {
        // TODO: Validate the child variable expression.
        // TODO: Validate the child assigned expression.
        // TODO: Validate that the assignment operator is one of =, +=, -=, *=, /=, %=, &=, |=, ^=, <<= or >>=.
        // TODO: Validate that the variable expression is a storage expression, like a variable name, an indexed value, a struct property or a dereferenced pointer.
        // TODO: Validate that the variable expression is a variable and not a const, param, function parameter or other fixed value.
        // TODO: Validate that the memory behind the variable expression is writable, which rejects uniform variables and storage variables without AccessMode read_write, also when reached through a pointer (new).
        // TODO: Validate that the type of the variable expression is constructible, which rejects assigning whole runtime-sized arrays, textures, samplers and pointers (new).
        // TODO: Report "Arithmetic operation not supported for <variable type> and <assigned type>." for +=, -=, *=, /= and %=, or "Bit operation not supported for <variable type> and <assigned type>." for &=, |=, ^=, <<= and >>=, when the recorded result type of the compound assignment is poison.
        // TODO: Validate that the right side of <<= and >>= is a uint when the variable is a scalar and a Vector of uint with the same component count when the variable is a vector.
        // TODO: Validate that a constant right side of <<= and >>= is not negative.
        // TODO: Validate that a constant right side of <<= and >>= is less than 32, the bit width of int and uint (new).
        // TODO: Validate that a constant right side of /= and %= is not zero when the variable is an int, a uint or a Vector of them (new).
        // TODO: Validate that the type of the assigned expression, or the result type of a compound assignment, converts to the type of the variable.
        // TODO: Validate that a constant assigned value of an operator other than <<= and >>= is representable in the type of the variable or of its components, e.g. no negative value for uint and no value outside the range of int, uint, float or float16 (new).
    }
}
