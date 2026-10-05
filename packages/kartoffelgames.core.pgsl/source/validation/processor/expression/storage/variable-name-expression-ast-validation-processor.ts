import { VariableNameExpressionAst } from '../../../../abstract_syntax_tree/expression/storage/variable-name-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of VariableNameExpressionAst.
 */
export class VariableNameExpressionAstValidationProcessor extends PgslValidatorProcessor<VariableNameExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof VariableNameExpressionAst {
        return VariableNameExpressionAst;
    }

    /**
     * Validates the PGSL variable name expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: VariableNameExpressionAst): void {
    }
}
