import { TypeDeclarationAst } from '../../../abstract_syntax_tree/general/type-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of TypeDeclarationAst.
 */
export class TypeDeclarationAstValidationProcessor extends PgslValidatorProcessor<TypeDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof TypeDeclarationAst {
        return TypeDeclarationAst;
    }

    /**
     * Validates the PGSL type declaration syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: TypeDeclarationAst): void {
        // TODO: Validate the child type declaration or expression of each template argument.
        // TODO: Validate the inner type declaration of a pointer type.
        // TODO: Report "Typename "<name>" not defined." when the raw type name resolves to no type.
        // TODO: Skip the rules that read the type of a template argument when that type is poison.
        // TODO: Validate that void, bool, string, int, uint, float, float16, Sampler, SamplerComparison, struct, enum and alias types have no template arguments.
        // TODO: Validate that the string type is never written explicitly.
        // TODO: Validate that Array has one or two template arguments.
        // TODO: Validate that the first Array template argument is a type.
        // TODO: Validate that the Array element type is a scalar, a vector, a matrix, an Array with a constant length or a struct with a fixed footprint, so no runtime-sized or param-sized Array, texture, sampler, pointer, void or string (new).
        // TODO: Validate that the second Array template argument is an expression.
        // TODO: Validate that the Array length expression converts to int or uint.
        // TODO: Validate that the Array length expression is constant or pipeline-creation fixed (param).
        // TODO: Validate that a constant Array length is greater than zero (new).
        // TODO: Validate that Vector2, Vector3 and Vector4 have exactly one template argument.
        // TODO: Validate that the Vector template argument is a type.
        // TODO: Validate that the Vector component type is a scalar (int, uint, float, float16 or bool).
        // TODO: Validate that Matrix22 to Matrix44 have exactly one template argument.
        // TODO: Validate that the Matrix template argument is a type.
        // TODO: Validate that the Matrix component type is float or float16.
        // TODO: Validate that the type referenced by a pointer is storable.
        // TODO: Validate that the type referenced by a pointer is no pointer, texture or sampler, which PGSL marks as storable while WGSL has no pointer to a pointer and no pointer type for texture or sampler memory, so *Texture2d<float> and *P with alias P = *float are rejected (new).
        // TODO: Validate that build-in types have at most one template argument.
        // TODO: Validate that the build-in template argument is an expression.
        // TODO: Validate that build-in types other than ClipDistances have no template argument (new).
        // TODO: Validate that ClipDistances has a template value.
        // TODO: Validate that the ClipDistances template value is constant.
        // TODO: Validate that the ClipDistances template value converts to int or uint.
        // TODO: Validate that the ClipDistances template value is between 1 and 8 (new).
        // TODO: Validate that sampled textures (Texture1d, Texture2d, Texture2dArray, Texture3d, TextureCube, TextureCubeArray and TextureMultisampled2d) have exactly one template argument.
        // TODO: Validate that the sampled texture template argument is a type.
        // TODO: Validate that the sampled type of a texture is float, int or uint.
        // TODO: Validate that storage textures (TextureStorage1d, TextureStorage2d, TextureStorage2dArray and TextureStorage3d) have exactly two template arguments.
        // TODO: Validate that both storage texture template arguments are constant string expressions.
        // TODO: Validate that the first storage texture template argument is a known texel format.
        // TODO: Validate that the second storage texture template argument is a known access mode (read, write or read_write).
        // TODO: Validate that depth textures and TextureExternal have no template arguments.
    }
}
