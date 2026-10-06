import { ArithmeticExpressionAst, type ArithmeticExpressionAstData } from '../../../../abstract_syntax_tree/expression/operation/arithmetic-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of ArithmeticExpressionAst.
 */
export class ArithmeticExpressionAstValidationProcessor extends PgslValidatorProcessor<ArithmeticExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ArithmeticExpressionAst {
        return ArithmeticExpressionAst;
    }

    /**
     * Validates the PGSL arithmetic expression syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: ArithmeticExpressionAstData): void {
        // TODO: Validate the left operand expression.
        // TODO: Validate the right operand expression.
        // TODO: Validate that the operator is one of +, -, *, / and %.
        // TODO: Report "Arithmetic operation not supported for <left type> and <right type>." when the result type is poison and the operator is valid (component types that do not convert into each other, an operand that is no numeric scalar, numeric Vector or Matrix, Vectors of different dimensions, Matrices of different dimensions for + and -, left columns not equal to right rows for Matrix * Matrix, Matrix columns or rows not equal to the Vector dimension for Matrix * Vector and Vector * Matrix, an operator other than * between a Matrix and a scalar or Vector, or / and % between two Matrices).
        // TODO: Validate that a constant abstract operand lies within the range of the concrete component type it converts to when the other operand is concrete, so a + -1 with a uint a and b * 1e40 with a float b are rejected (new).
        // TODO: Validate that the right operand of / and % is not a constant zero when the operands are integers (int, uint or AbstractInteger) (new).
        // TODO: Validate that / and % do not divide a constant int of the lowest value -2147483648 by a constant -1 (new).
        // TODO: Validate that +, -, *, / and % on two constant AbstractInteger operands do not overflow the 64-bit signed range, where the lowest value divided by or modulo -1 counts as an overflow (new).
        // TODO: Validate that an operation on two constant float, float16 or AbstractFloat operands gives a finite result, so neither an overflow like 3e38f * 10.0f nor a / or % by a constant zero gives infinity or NaN (new).
    }
}
