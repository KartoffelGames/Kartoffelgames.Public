import { ParenthesizedExpressionAst, type ParenthesizedExpressionAstData } from '../../../../abstract_syntax_tree/expression/single_value/parenthesized-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of ParenthesizedExpressionAst.
 */
export class ParenthesizedExpressionAstValidationProcessor extends PgslValidatorProcessor<ParenthesizedExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ParenthesizedExpressionAst {
        return ParenthesizedExpressionAst;
    }

    /**
     * Validates the PGSL parenthesized expression syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: ParenthesizedExpressionAstData): void {
        // TODO: Validate the child expression inside the parentheses.
    }
}
