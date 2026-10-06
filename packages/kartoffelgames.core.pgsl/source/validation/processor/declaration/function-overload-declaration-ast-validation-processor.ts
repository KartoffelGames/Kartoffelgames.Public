import { FunctionOverloadDeclarationAst, type FunctionOverloadDeclarationAstData } from '../../../abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of FunctionOverloadDeclarationAst.
 */
export class FunctionOverloadDeclarationAstValidationProcessor extends PgslValidatorProcessor<FunctionOverloadDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof FunctionOverloadDeclarationAst {
        return FunctionOverloadDeclarationAst;
    }

    /**
     * Validates the PGSL function overload declaration syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: FunctionOverloadDeclarationAstData): void {
        // TODO: Validate the child attribute list.
        // TODO: Validate the child restriction type declarations of every generic.
        // TODO: Validate the child type declaration of every parameter.
        // TODO: Validate the child return type declaration.
        // TODO: Validate the child block.
        // TODO: Validate that no two generics of the overload share a name.
        // TODO: Validate that a generic restriction only references generics declared before it (new).
        // TODO: Validate that no generic name shadows a module scope type (new).
        // TODO: Validate that every generic name used as a parameter type is a generic declared by the overload.
        // TODO: Validate that no two parameters share a name (new).
        // TODO: Validate that every parameter name is a valid WGSL identifier: not a WGSL keyword or reserved word (the lexer lets fn, override, non_coherent and noncoherent through) and not starting with two underscores (new).
        // TODO: Validate that no parameter name is a WGSL predeclared type, enumerant or built-in function name like f32, vec3, read or min, which the parameter would shadow in the transpiled function body (new).
        // TODO: Validate that no parameter name is the name of a function or struct declaration, which the parameter would shadow in the transpiled function body while PGSL still resolves calls and type names in the body to that declaration (new).
        // TODO: Validate that no parameter name contains the reserved name part __GENERIC__ (new).
        // TODO: Validate that no variable declared directly in the function block shares a name with a parameter, because WGSL gives both the same end scope (new).
        // TODO: Validate that every parameter type is constructible, a pointer, a texture or a sampler (new).
        // TODO: Validate that the declared return type is void or constructible (new).
        // TODO: Validate that every control flow path of an overload with a non-void return type ends in a return statement, counting returns nested in if/else and switch branches, in place of today's comparison of the block return type with the declared return type.
        // TODO: Validate that at most one of the Vertex, Fragment and Compute attributes is set (new).
        // TODO: Validate that an entry point overload has no generics.
        // TODO: Validate that a Vertex or Fragment entry point has exactly one parameter.
        // TODO: Validate that the parameter type of a Vertex or Fragment entry point is a struct.
        // TODO: Validate that the return type of a Vertex or Fragment entry point is a struct.
        // TODO: Validate that every property of the input and output struct of a Vertex or Fragment entry point has either a built-in type or a Location attribute, never both (new).
        // TODO: Validate that every built-in property of the input and output struct fits the stage and direction: VertexIndex and InstanceIndex as Vertex input, Position and ClipDistances as Vertex output, Position, FrontFacing, SampleIndex, SampleMask and PrimitiveIndex as Fragment input, FragDepth and SampleMask as Fragment output (new).
        // TODO: Validate that no built-in type occurs more than once in the input struct or in the output struct of an entry point (new).
        // TODO: Validate that the output struct of a Vertex entry point has a Position property (new).
        // TODO: Validate that every Location property with an integer scalar or vector type in the output struct of a Vertex entry point or the input struct of a Fragment entry point has a flat Interpolate attribute (new).
        // TODO: Validate that BlendSource properties only appear in the output struct of a Fragment entry point (new).
        // TODO: Validate that all Compute attribute parameters are greater than zero (new).
        // TODO: Validate that a Compute entry point has no parameters.
        // TODO: Validate that a Compute entry point has a void return type.
    }
}
