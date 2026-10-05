import { NewExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/new-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of NewExpressionAst.
 */
export class NewExpressionAstValidationProcessor extends PgslValidatorProcessor<NewExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof NewExpressionAst {
        return NewExpressionAst;
    }

    /**
     * Validates the PGSL new expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: NewExpressionAst): void {
    }
}
