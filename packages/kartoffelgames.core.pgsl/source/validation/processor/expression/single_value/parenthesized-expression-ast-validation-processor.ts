import { ParenthesizedExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/parenthesized-expression-ast.ts';
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
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: ParenthesizedExpressionAst): void {
    }
}
