import { ComparisonExpressionAst, type ComparisonExpressionAstData } from '../../../../abstract_syntax_tree/expression/operation/comparison-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of ComparisonExpressionAst.
 */
export class ComparisonExpressionAstValidationProcessor extends PgslValidatorProcessor<ComparisonExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ComparisonExpressionAst {
        return ComparisonExpressionAst;
    }

    /**
     * Validates the PGSL comparison expression syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: ComparisonExpressionAstData): void {
        // TODO: Validate the left operand expression.
        // TODO: Validate the right operand expression.
        // TODO: Validate that the operator is one of ==, !=, <, <=, > and >=.
        // TODO: Validate that neither operand is an unparenthesized comparison, as chaining comparisons requires parentheses.
        // TODO: Validate that both operands have the same type or that one converts implicitly into the other.
        // TODO: Validate that the operands are scalars (int, uint, float, float16 or bool) or vectors of scalars.
        // TODO: Validate that bool operands and Vectors of bool are only compared with == and !=.
        // TODO: Validate that a constant abstract operand lies within the range of the concrete component type it converts to when the other operand is concrete, so a == -1 with a uint a is rejected (new).
    }
}
