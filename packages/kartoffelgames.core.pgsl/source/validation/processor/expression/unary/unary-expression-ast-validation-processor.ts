import { UnaryExpressionAst } from '../../../../abstract_syntax_tree/expression/unary/unary-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of UnaryExpressionAst.
 */
export class UnaryExpressionAstValidationProcessor extends PgslValidatorProcessor<UnaryExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof UnaryExpressionAst {
        return UnaryExpressionAst;
    }

    /**
     * Validates the PGSL unary expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: UnaryExpressionAst): void {
        // TODO: Validate the operand expression.
        // TODO: Validate that the operator is one of ~, - and !.
        // TODO: Report "Unary operation <operator> not supported for <operand type>." once when the result type is poison while the operand type is not poison and the operator is valid (~ on an operand that converts to no int, uint or Vector of them, - on an operand that converts to no int, float, float16 or Vector of them, so never on a uint or a Vector of uint, ! on an operand that is no bool or Vector of bool).
    }
}
