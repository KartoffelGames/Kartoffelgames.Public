import type { AbstractSyntaxTree } from '../../../../abstract_syntax_tree/abstract-syntax-tree.ts';
import { FunctionCallExpressionAst, type FunctionCallExpressionAstData } from '../../../../abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts';
import { FunctionCallStatementAst } from '../../../../abstract_syntax_tree/statement/execution/function-call-statement-ast.ts';
import { BasePgslTypeKind } from '../../../../abstract_syntax_tree/type/definition/base-pgsl-type.ts';
import { PgslGenericType } from "../../../../abstract_syntax_tree/type/definition/pgsl-generic-type.ts";
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
        for (const lParameter of pData.parameters) {
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
            const lParameterTypes: string = pData.parameters.map((pParameter) => {
                return pParameter.data.resolveType.meta.typeName;
            }).join(', ');

            this.pushIncident(`No matching function overload found for function '${pData.name}' with parameter types (${lParameterTypes}).`);
            return;
        }

        // Validate that every generic is resolved.
        for(const [lGenericType, lResolvedGenericType] of pData.generics.resolved) {
            if(lResolvedGenericType instanceof PgslGenericType){
                this.pushIncident(`Generic '${lGenericType.name}' of function '${pData.name}' must be written explicitly.`);
            }
        }

        // Validate that the function is not an entry point.
        if (pData.overload.data.entryPoint) {
            this.pushIncident(`Entry point function '${pData.name}' can not be called.`);
        }

        // Validate additional rules of the function. Used by build in functions.
        if (pData.declaration.data.validator) {
            pData.declaration.data.validator(pInstance, (pMessage: string, pDifferentAst?: AbstractSyntaxTree) => {
                this.pushIncident(pMessage, pDifferentAst);
            });
        }

        // TODO: Validate that the call is not ambiguous, reporting the recorded tie when no matching overload converts every parameter at a rank at least as good as every other matching overload and at least one parameter at a better rank (new).
        // TODO: Validate that a constant abstract parameter lies within the range of the concrete parameter type it converts to, so clamp(5000000000, 0, 1i) is rejected (new).
        // TODO: Validate that the address space of each pointer parameter is one the pointer parameter of the selected overload accepts, so workgroupUniformLoad only takes a pointer to a workgroup value (new).
        // TODO: Validate that each pointer parameter of a call of a user function points to function or private memory, so no storage, uniform or workgroup variable, unless the unrestricted_pointer_parameters language extension is available, as core WGSL only allows those two address spaces for pointer parameters (new).
        // TODO: Validate that each pointer parameter of a call of a user function addresses its whole root variable, so no &a[1] or &s.property, unless the unrestricted_pointer_parameters language extension is available, as core WGSL requires the memory view of a pointer parameter to be its root variable (new).
    }
}
