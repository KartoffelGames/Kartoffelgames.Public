import { ValueDecompositionExpressionAst } from "../../../../abstract_syntax_tree/expression/storage/value-decomposition-expression-ast.ts";
import { VariableNameExpressionAst, type VariableNameExpressionAstData } from '../../../../abstract_syntax_tree/expression/storage/variable-name-expression-ast.ts';
import { BasePgslTypeKind } from "../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts";
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
     * @param pData - The syntax tree data to validate.
     */
    protected override onValidate(pData: VariableNameExpressionAstData, pInstance: VariableNameExpressionAst): void {
        // Validate that the name was found.
        if (pData.valueDeclaration === null) {
            this.pushIncident(`Variable "${pData.variableName}" not defined.`);
        }

        // If its a enum. Check that its inside a value decomposition.
        if (pData.resolveType.isKind(BasePgslTypeKind.Enum)) {
            // The enum value must be the value part of a decomposition. 
            const lDecompositionAst: ValueDecompositionExpressionAst | null = this.stackContains(ValueDecompositionExpressionAst);
            if (!lDecompositionAst || lDecompositionAst.data.expressionValue !== pInstance) {
                this.pushIncident(`Enum "${pData.variableName}" can only be used as value.`);
            }
        }
    }
}
