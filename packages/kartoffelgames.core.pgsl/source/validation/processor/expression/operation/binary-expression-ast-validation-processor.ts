import { BinaryExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/binary-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of BinaryExpressionAst.
 */
export class BinaryExpressionAstValidationProcessor extends PgslValidatorProcessor<BinaryExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof BinaryExpressionAst {
        return BinaryExpressionAst;
    }

    /**
     * Validates the PGSL binary expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: BinaryExpressionAst): void {
        // TODO: Validate the left operand expression.
        // TODO: Validate the right operand expression.
        // TODO: Validate that the operator is one of |, &, ^, << and >>.
        // TODO: Validate that an operand that is an unparenthesized arithmetic, bit, comparison or logical expression uses the same operator and that this operator is |, & or ^, as any other mix and any chained << or >> requires parentheses.
        // TODO: Skip the type rules below when the left or right operand type is poison.
        // TODO: Report "Bit operation not supported for <left type> and <right type>." once when the result type is poison while neither operand type is poison and the operator is valid (an operand of |, & or ^ or the left operand of a shift that is no int, uint or Vector of them, operands of |, & and ^ that do not convert into each other, a Vector combined with a scalar or with a Vector of another dimension in |, & or ^).
        // TODO: Validate that a constant abstract operand of |, & or ^ lies within the range of the concrete component type it converts to when the other operand is concrete, so a | -1 with a uint a is rejected (new).
        // TODO: Validate that the right operand of a shift converts to uint when the left operand is a scalar and to a Vector of uint when the left operand is a Vector.
        // TODO: Validate that a vector right operand of a shift has the same dimension as the left operand.
        // TODO: Validate that a constant right operand of a shift is not negative.
        // TODO: Validate that a constant right operand of a shift is less than 32, the bit width of int and uint, when the left operand is an int, uint or a Vector of them (new).
        // TODO: Validate that a left shift of a constant left operand by a constant amount does not overflow, so the amount + 1 most significant bits of an int (32 bit) or AbstractInteger (64 bit) are all equal and the amount most significant bits of a uint are all zero (new).
    }
}
