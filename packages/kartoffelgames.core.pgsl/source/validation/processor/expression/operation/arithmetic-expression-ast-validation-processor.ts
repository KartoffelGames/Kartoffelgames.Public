import { ArithmeticExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/arithmetic-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of ArithmeticExpressionAst.
 */
export class ArithmeticExpressionAstValidationProcessor extends PgslValidatorProcessor<ArithmeticExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ArithmeticExpressionAst {
        return ArithmeticExpressionAst;
    }

    /**
     * Validates the PGSL arithmetic expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: ArithmeticExpressionAst): void {
    }
}
