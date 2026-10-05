import { ComparisonExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/comparison-expression-ast.ts';
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
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: ComparisonExpressionAst): void {
    }
}
