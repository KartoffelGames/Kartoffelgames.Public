import type { AbstractSyntaxTree } from '../../../../abstract_syntax_tree/abstract-syntax-tree.ts';
import { FunctionCallExpressionAst, type FunctionCallExpressionAstData } from '../../../../abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts';
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

        // Validate each explicit generic type declaration.
        for (const lGeneric of pData.generics) {
            this.validateAst(lGeneric);
        }

        // Validate that the function name resolves to a function declaration.
        if (!pData.declaration) {
            this.pushIncident(`Function '${pData.name}' is not defined.`);
            return;
        }

        // Validate that an overload of the function matches the parameter count, the explicit generic count and the parameter types.
        if (!pData.overload) {
            this.pushIncident(`No matching function overload found for function '${pData.name}'.`);
            return;
        }

        // Validate the additional rules of the function, which build-in functions can set beyond their overloads.
        if (pData.declaration.data.validator) {
            pData.declaration.data.validator(pInstance, (pMessage: string, pDifferentAst?: AbstractSyntaxTree) => {
                this.pushIncident(pMessage, pDifferentAst);
            });
        }

        // TODO: Validate that an overload that does not match lists the parameter types in its incident.
        // TODO: Validate that the call is not ambiguous, reporting the recorded tie when no matching overload converts every parameter at a rank at least as good as every other matching overload and at least one parameter at a better rank (new).
        // TODO: Validate that each explicit generic satisfies the restrictions of its generic in the selected overload, so bitcast<bool>(v) is rejected (new).
        // TODO: Validate that every generic which occurs in no parameter of the selected overload is written explicitly, so bitcast(v) without a generic is rejected (new).
        // TODO: Validate that a constant abstract parameter lies within the range of the concrete parameter type it converts to, so clamp(5000000000, 0, 1i) is rejected (new).
        // TODO: Validate that the address space of each pointer parameter is one the pointer parameter of the selected overload accepts, so workgroupUniformLoad only takes a pointer to a workgroup value (new).
        // TODO: Validate that each pointer parameter of a call of a user function points to function or private memory, so no storage, uniform or workgroup variable, unless the unrestricted_pointer_parameters language extension is available, as core WGSL only allows those two address spaces for pointer parameters (new).
        // TODO: Validate that each pointer parameter of a call of a user function addresses its whole root variable, so no &a[1] or &s.property, unless the unrestricted_pointer_parameters language extension is available, as core WGSL requires the memory view of a pointer parameter to be its root variable (new).
        // TODO: Validate that the called function is not an entry point with a Compute, Vertex or Fragment attribute, because WGSL forbids calling entry points (new).
        // TODO: Validate that the called function returns a value unless this call is the function expression of a function call statement (new).
    }
}
