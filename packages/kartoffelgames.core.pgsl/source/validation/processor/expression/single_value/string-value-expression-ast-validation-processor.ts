import { StringValueExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/string-value-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of StringValueExpressionAst.
 */
export class StringValueExpressionAstValidationProcessor extends PgslValidatorProcessor<StringValueExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof StringValueExpressionAst {
        return StringValueExpressionAst;
    }

    /**
     * Validates the PGSL string value expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: StringValueExpressionAst): void {
    }
}
