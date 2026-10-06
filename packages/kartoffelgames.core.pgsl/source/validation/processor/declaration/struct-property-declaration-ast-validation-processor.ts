import { StructPropertyDeclarationAst, type StructPropertyDeclarationAstData } from '../../../abstract_syntax_tree/declaration/struct-property-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of StructPropertyDeclarationAst.
 */
export class StructPropertyDeclarationAstValidationProcessor extends PgslValidatorProcessor<StructPropertyDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof StructPropertyDeclarationAst {
        return StructPropertyDeclarationAst;
    }

    /**
     * Validates the PGSL struct property declaration syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: StructPropertyDeclarationAstData): void {
        // TODO: Validate the child attribute list.
        // TODO: Validate the child type declaration.
        // TODO: Validate that the property name is a valid WGSL identifier: not a WGSL keyword or reserved word (the lexer lets fn, override, non_coherent and noncoherent through) and not starting with two underscores (new).
        // TODO: Validate that the property name does not contain the reserved name part __GENERIC__ (new).
        // TODO: Validate that the property type is concrete.
        // TODO: Validate that the property type is plain.
        // TODO: Validate that the property type is no Array with a param-sized length (new).
        // TODO: Validate that the property type is no struct without a fixed footprint, so a struct that ends in a runtime-sized Array is never nested into another struct (new).
        // TODO: Validate that a property with a Location attribute has a numeric scalar or numeric vector type, so int, uint, float, float16 or a Vector of them.
        // TODO: Validate that the Size parameter is a positive integer.
        // TODO: Validate that the Size parameter is at least the byte size of the property type (new).
        // TODO: Validate that a property with a Size attribute has no runtime-sized Array type, as WGSL only allows Size on a creation-fixed footprint while param-sized Arrays and structs without a fixed footprint are already rejected as property types above (new).
        // TODO: Validate that the Align parameter is a positive integer.
        // TODO: Validate that the Align parameter is a power of two.
        // TODO: Validate that the Align parameter is a multiple of the alignment of the property type (new).
        // TODO: Validate that a property with a BlendSource attribute also has a Location attribute.
        // TODO: Validate that the BlendSource parameter is either 0 or 1.
        // TODO: Validate that a property with an Interpolate attribute also has a Location attribute.
        // TODO: Validate that the Interpolate sampling fits the interpolate type: first or either for flat, center, centroid or sample for perspective and linear (new).
    }
}
