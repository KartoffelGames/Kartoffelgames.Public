import { VariableNameExpressionAst, type VariableNameExpressionAstData } from '../../../../abstract_syntax_tree/expression/storage/variable-name-expression-ast.ts';
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
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: VariableNameExpressionAstData): void {
        // TODO: Validate that the name resolves to a value declaration or an enum, reporting "Variable "name" not defined." from the recorded raw name; a resolved value whose type is poison is defined and is not reported as undefined.
        // TODO: Validate that a name resolving to an enum is only used as the value of a value decomposition like EnumName.Value, because the transpiler throws for a bare enum name (new).
    }
}
