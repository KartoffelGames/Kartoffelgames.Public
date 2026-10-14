import type { AbstractSyntaxTree } from '../../../../abstract_syntax_tree/abstract-syntax-tree.ts';
import { FunctionOverloadDeclarationAstDataParameter } from "../../../../abstract_syntax_tree/declaration/function-overload-declaration-ast.ts";
import { IExpressionAst } from "../../../../abstract_syntax_tree/expression/i-expression-ast.interface.ts";
import { FunctionCallExpressionAst, type FunctionCallExpressionAstData } from '../../../../abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts';
import { BasePgslType, BasePgslTypeKind } from '../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslGenericType } from "../../../../abstract_syntax_tree/type/definition/pgsl-generic-type.ts";
import { PgslNumericType } from "../../../../abstract_syntax_tree/type/definition/pgsl-numeric-type.ts";
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
     * @param pData - The syntax tree data to validate.
     * @param pInstance - The syntax tree to validate.
     */
    protected override onValidate(pData: FunctionCallExpressionAstData, pInstance: FunctionCallExpressionAst): void {
        // Validate each parameter expression.
        for (const lParameter of pData.parameters.values) {
            this.validateAst(lParameter);
        }

        // Validate each explicit set generic type.
        for (const lGeneric of pData.generics.explicit) {
            this.validateAst(lGeneric);
        }

        // Validate that the function name was resolved.
        if (!pData.declaration) {
            this.pushIncident(`Function '${pData.name}' is not defined.`);
            return;
        }

        // When no overload was found but a declaration, the parameters does not match any overload.
        if (!pData.overload) {
            const lParameterTypes: string = pData.parameters.values.map((pParameter) => {
                return pParameter.data.resolveType.meta.typeName;
            }).join(', ');

            this.pushIncident(`No matching function overload found for function '${pData.name}' with parameter types (${lParameterTypes}).`);
            return;
        }

        // Validate that every generic is resolved.
        for (const [lGenericType, lResolvedGenericType] of pData.generics.resolved) {
            if (lResolvedGenericType instanceof PgslGenericType) {
                this.pushIncident(`Generic '${lGenericType.name}' of function '${pData.name}' must be written explicitly.`);
            }
        }

        // Validate that the function is not an entry point.
        if (pData.overload.data.entryPoint) {
            this.pushIncident(`Entry point function '${pData.name}' can not be called.`);
        }

        // Validate that each abstract parameter fits into its concrete type. 
        for (let lParameterIndex: number = 0; lParameterIndex < pData.overload.data.parameter.length; lParameterIndex++) {
            const lParameterValue: IExpressionAst = pData.parameters.values[lParameterIndex];

            // Only check for abstracts.
            if (!lParameterValue.data.resolveType.isKind(BasePgslTypeKind.Abstract)) {
                continue;
            }

            // Only check if any constant value is set.
            if (typeof lParameterValue.data.constantValue !== 'number') {
                continue;
            }

            // Get the resolved parameter type, as it can be a generic, and check if the parameter values constant fits into the parameter type.
            const lResolvedParameterDeclarationType: BasePgslType = pData.parameters.types[lParameterIndex];
            if (lResolvedParameterDeclarationType instanceof PgslNumericType && !lResolvedParameterDeclarationType.constantFits(lParameterValue.data.resolveType, lParameterValue.data.constantValue)) {
                // Read the actual overloads parameter to read the name.
                const lParameterName: string = pData.overload.data.parameter[lParameterIndex].name;
                this.pushIncident(`Value ${lParameterValue.data.constantValue} does not fit into '${lParameterName}'s '${lResolvedParameterDeclarationType.meta.typeName}'.`, lParameterValue);
            }
        }

        // Validate additional rules of the function. Used by build in functions.
        if (pData.declaration.data.validator) {
            pData.declaration.data.validator(pInstance, (pMessage: string, pDifferentAst?: AbstractSyntaxTree) => {
                this.pushIncident(pMessage, pDifferentAst);
            });
        }
    }
}
