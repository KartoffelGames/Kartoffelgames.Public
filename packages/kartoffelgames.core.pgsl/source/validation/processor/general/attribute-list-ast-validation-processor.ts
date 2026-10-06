import { AttributeListAst, type AttributeListAstData } from '../../../abstract_syntax_tree/general/attribute-list-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of AttributeListAst.
 */
export class AttributeListAstValidationProcessor extends PgslValidatorProcessor<AttributeListAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof AttributeListAst {
        return AttributeListAst;
    }

    /**
     * Validates the PGSL attribute list syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: AttributeListAstData): void {
        // TODO: Validate each parameter expression of each attribute, including attributes that are unknown or have a wrong parameter count.
        // TODO: Validate that the attribute list belongs to a declaration, found as the nearest enclosing declaration on the parent stack.
        // TODO: Validate that each attribute name is a known attribute (GroupBinding, AccessMode, Align, BlendSource, Interpolate, Invariant, Location, Size, Vertex, Fragment, Compute or Meta).
        // TODO: Validate that each attribute with an enforced parent type is attached to a declaration of that type (GroupBinding and AccessMode on variable declarations, Align, BlendSource, Interpolate, Invariant, Location and Size on struct properties, Vertex, Fragment and Compute on function overloads).
        // TODO: Validate that the parameter count of each attribute matches one of the parameter definitions of that attribute.
        // TODO: Validate that attributes without a parameter definition (Invariant, Vertex and Fragment) have no parameters (new).
        // TODO: Validate that each string parameter is a constant expression.
        // TODO: Validate that each string parameter is of type string.
        // TODO: Validate that each string parameter has a constant string value.
        // TODO: Validate that each string parameter with a value list uses one of the listed values (read, write or read_write for AccessMode, the interpolate types and samplings for Interpolate).
        // TODO: Validate that each number parameter is a numeric scalar.
        // TODO: Validate that each number parameter converts to its defined type (uint for Align, BlendSource and Size, int for Compute).
        // TODO: Validate that each number parameter has at least its defined fixed state (constant for Align, BlendSource, Size and Compute).
        // TODO: Validate that no attribute except Meta occurs more than once in the list (new).
    }
}
