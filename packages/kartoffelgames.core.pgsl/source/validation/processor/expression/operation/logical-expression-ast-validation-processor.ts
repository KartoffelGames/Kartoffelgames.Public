import { LogicalExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/logical-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of LogicalExpressionAst.
 */
export class LogicalExpressionAstValidationProcessor extends PgslValidatorProcessor<LogicalExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof LogicalExpressionAst {
        return LogicalExpressionAst;
    }

    /**
     * Validates the PGSL logical expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: LogicalExpressionAst): void {
        // TODO: Validate the left operand expression.
        // TODO: Validate the right operand expression.
        // TODO: Validate that the operator is && or ||.
        // TODO: Validate that an operand that is an unparenthesized logical expression uses the same operator and an operand that is an unparenthesized bit expression is a << or >> shift, as any other mix requires parentheses.
        // TODO: Skip the bool rule of an operand whose type is poison.
        // TODO: Validate that the left operand is a bool.
        // TODO: Validate that the right operand is a bool.
    }
}
