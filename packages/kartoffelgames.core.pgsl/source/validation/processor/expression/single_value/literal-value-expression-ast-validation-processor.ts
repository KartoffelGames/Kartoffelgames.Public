import { LiteralValueExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of LiteralValueExpressionAst.
 */
export class LiteralValueExpressionAstValidationProcessor extends PgslValidatorProcessor<LiteralValueExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof LiteralValueExpressionAst {
        return LiteralValueExpressionAst;
    }

    /**
     * Validates the PGSL literal value expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: LiteralValueExpressionAst): void {
    }
}
