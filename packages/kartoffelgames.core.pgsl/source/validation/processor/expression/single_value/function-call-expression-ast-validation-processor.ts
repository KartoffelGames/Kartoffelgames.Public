import { FunctionCallExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of FunctionCallExpressionAst.
 */
export class FunctionCallExpressionAstValidationProcessor extends PgslValidatorProcessor<FunctionCallExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof FunctionCallExpressionAst {
        return FunctionCallExpressionAst;
    }

    /**
     * Validates the PGSL function call expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: FunctionCallExpressionAst): void {
    }
}
