import { StructDeclarationAst, type StructDeclarationAstData } from '../../../abstract_syntax_tree/declaration/struct-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of StructDeclarationAst.
 */
export class StructDeclarationAstValidationProcessor extends PgslValidatorProcessor<StructDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof StructDeclarationAst {
        return StructDeclarationAst;
    }

    /**
     * Validates the PGSL struct declaration syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: StructDeclarationAstData): void {
        // TODO: Validate the child attribute list.
        // TODO: Validate the child property declarations.
        // TODO: Validate that the struct name is a valid WGSL identifier: not a WGSL keyword or reserved word (the lexer lets fn, override, non_coherent and noncoherent through) and not starting with two underscores (new).
        // TODO: Validate that the struct name is not a WGSL predeclared type, enumerant or built-in function name like f32, vec3, read or min, which the struct would shadow in the whole transpiled module (new).
        // TODO: Validate that the struct name does not contain the reserved name part __GENERIC__ (new).
        // TODO: Validate that the struct has at least one property.
        // TODO: Validate that no two properties share a name.
        // TODO: Validate that only the last property has a type without a fixed footprint, in practice a runtime-sized Array, because the property processor already rejects a nested struct without a fixed footprint at any position.
        // TODO: Validate that no two properties share a Location name.
        // TODO: Validate that a struct with a BlendSource property has exactly two Location properties, one with BlendSource 0 and one with BlendSource 1 (new).
        // TODO: Validate that both Location properties of a struct with a BlendSource property have the same type (new).
    }
}
