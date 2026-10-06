import { VariableDeclarationAst, type VariableDeclarationAstData } from '../../../abstract_syntax_tree/declaration/variable-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of VariableDeclarationAst.
 */
export class VariableDeclarationAstValidationProcessor extends PgslValidatorProcessor<VariableDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof VariableDeclarationAst {
        return VariableDeclarationAst;
    }

    /**
     * Validates the PGSL variable declaration syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: VariableDeclarationAstData): void {
        // TODO: Validate the child attribute list.
        // TODO: Validate the child type declaration.
        // TODO: Validate the child initializer expression when it is set.
        // TODO: Validate that the declaration keyword is one of the module scope declaration types const, storage, uniform, workgroup, private or param.
        // TODO: Validate that the variable name is a valid WGSL identifier: not a WGSL keyword or reserved word (the lexer lets fn, override, non_coherent and noncoherent through) and not starting with two underscores (new).
        // TODO: Validate that the variable name is not a WGSL predeclared type, enumerant or built-in function name like f32, vec3, read or min, which the variable would shadow in the whole transpiled module (new).
        // TODO: Validate that the variable name does not contain the reserved name part __GENERIC__ (new).
        // TODO: Validate that a storage or uniform declaration has a GroupBinding attribute.
        // TODO: Validate that the declaration only uses the attributes its declaration type allows: GroupBinding and AccessMode for storage and uniform, none for const, workgroup, private and param.
        // TODO: Validate that the initializer type converts to the declared type.
        // TODO: Validate that a constant initializer value is representable in the declared type, e.g. no negative value for uint and no value outside the range of int, uint, float or float16 (new).
        // TODO: Validate that a const declaration has a constructible type.
        // TODO: Validate that a const declaration has an initializer.
        // TODO: Validate that the initializer of a const declaration is a constant expression.
        // TODO: Validate that a storage declaration has no initializer.
        // TODO: Validate that a storage declaration with a texture type uses a storage texture.
        // TODO: Validate that a storage declaration with a type other than a texture has a host shareable type.
        // TODO: Validate that the AccessMode of a storage declaration with a type other than a texture is read or read_write, never write (new).
        // TODO: Validate that a uniform declaration has no initializer.
        // TODO: Validate that a uniform declaration with a texture type does not use a storage texture.
        // TODO: Validate that a uniform declaration with a type other than a texture or sampler has a constructible type.
        // TODO: Validate that a uniform declaration with a type other than a texture or sampler has a host shareable type.
        // TODO: Validate that the type of a uniform declaration other than a texture or sampler satisfies the WGSL uniform address space layout unless the uniform_buffer_standard_layout language extension is available: every Array element stride is a multiple of 16, every struct and Array typed property sits at an offset that is a multiple of 16, and the property after a struct typed property starts at least the struct size rounded up to 16 bytes later (new).
        // TODO: Validate that a workgroup declaration has a type with a fixed footprint.
        // TODO: Validate that a workgroup declaration has a plain type.
        // TODO: Validate that a workgroup declaration has no initializer (new).
        // TODO: Validate that a private declaration has a constructible type.
        // TODO: Validate that the initializer of a private declaration is a constant or param expression (new).
        // TODO: Validate that a param declaration has a constructible type.
        // TODO: Validate that a param declaration has a scalar type.
        // TODO: Validate that a param declaration has an initializer.
        // TODO: Validate that the initializer of a param declaration is a constant or param expression (new).
        // TODO: Validate that the type of a storage declaration is no Array with a param-sized length, which WGSL only allows for workgroup declarations, while the constructible rules above reject it for const, uniform and private and the scalar rule for param (new).
    }
}
