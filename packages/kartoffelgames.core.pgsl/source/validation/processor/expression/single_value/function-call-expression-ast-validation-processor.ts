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
        // TODO: Validate each argument expression.
        // TODO: Validate each explicit generic type declaration.
        // TODO: Validate that the function name resolves to a function declaration, reporting "Function 'name' is not defined." from the recorded raw name.
        // TODO: Validate that an overload of the function matches the argument count, the explicit generic count and the argument types, reporting the argument types when none matched and skipping when an argument or explicit generic is poison.
        // TODO: Validate that the call is not ambiguous, reporting the recorded tie when no matching overload converts every argument at a rank at least as good as every other matching overload and at least one argument at a better rank (new).
        // TODO: Validate that each explicit generic satisfies the restrictions of its generic in the selected overload, so bitcast<bool>(v) is rejected (new).
        // TODO: Validate that every generic which occurs in no parameter of the selected overload is written explicitly, so bitcast(v) without a generic is rejected (new).
        // TODO: Validate that a constant abstract argument lies within the range of the concrete parameter type it converts to, so clamp(5000000000, 0, 1i) is rejected (new).
        // TODO: Validate that the address space of each pointer argument is one the pointer parameter of the selected overload accepts, so workgroupUniformLoad only takes a pointer to a workgroup value (new).
        // TODO: Validate that each pointer argument of a call of a user function points to function or private memory, so no storage, uniform or workgroup variable, unless the unrestricted_pointer_parameters language extension is available, as core WGSL only allows those two address spaces for pointer parameters (new).
        // TODO: Validate that each pointer argument of a call of a user function addresses its whole root variable, so no &a[1] or &s.property, unless the unrestricted_pointer_parameters language extension is available, as core WGSL requires the memory view of a pointer argument to be its root variable (new).
        // TODO: Validate that the called function is not an entry point with a Compute, Vertex or Fragment attribute, because WGSL forbids calling entry points (new).
        // TODO: Validate that the called function returns a value unless this call is the function expression of a function call statement (new).
        // TODO: Validate that the argument of arrayLength is a pointer to a runtime-sized Array, because its wildcard generic accepts any argument today (new).
        // TODO: Validate that the component argument of textureGather is a constant between 0 and 3 (new).
        // TODO: Validate that the offset argument of textureSample, textureSampleBias, textureSampleCompare, textureSampleCompareLevel, textureSampleGrad, textureSampleLevel, textureGather and textureGatherCompare is a constant whose components are between -8 and 7 (new).
        // TODO: Validate that low is not greater than high in clamp when both are constant (new).
        // TODO: Validate that edge0 and edge1 of smoothstep are not equal when both are constant (new).
        // TODO: Validate that offset plus count of extractBits and insertBits does not exceed the bit width of e when both are constant (new).
        // TODO: Validate that a constant e2 of ldexp is not greater than the exponent bias plus one of e1, which is 128 for float, 16 for float16 and 1024 for abstract floats (new).
        // TODO: Validate that a constant argument of quantizeToF16 and pack2x16float lies within the finite float16 range (new).
        // TODO: Validate that a call of a constant built-in function with only constant arguments does not evaluate to an infinite or NaN float value, like sqrt(-1.0), log(0.0) or exp(1000.0), because WGSL evaluates it at shader creation (new).
    }
}
