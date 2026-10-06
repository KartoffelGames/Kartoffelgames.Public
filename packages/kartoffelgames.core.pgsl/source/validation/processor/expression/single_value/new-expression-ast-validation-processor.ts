import { NewExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/new-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of NewExpressionAst.
 */
export class NewExpressionAstValidationProcessor extends PgslValidatorProcessor<NewExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof NewExpressionAst {
        return NewExpressionAst;
    }

    /**
     * Validates the PGSL new expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: NewExpressionAst): void {
        // TODO: Validate each argument expression.
        // TODO: Validate the type declaration of each written generic.
        // TODO: Validate that the type name can be constructed with new, reporting "Type 'name' cannot be constructed with 'new'." from the recorded raw name.
        // TODO: Validate that at most one generic is written.
        // TODO: Validate that a generic is only written for a type whose constructor takes one, which excludes Array, bool and the numeric scalar types.
        // TODO: Validate that the written generic is one of the component types the constructed type allows.
        // TODO: Validate that each argument type is constructible.
        // TODO: Validate that each argument type has a fixed footprint.
        // TODO: Validate that a constructor of the type matches the argument count and types, reporting the type name and argument count when none matched.
        // TODO: Validate that the arguments convert to one common type, comparing the component types of Vector arguments for Vector and Matrix constructors and the whole argument types for Array, so new Vector2(1, true) and new Array(1, true) are rejected (new).
        // TODO: Validate that every argument converts to the written generic, taking the component type of Vector arguments, so new Vector2<int>(1.5, 2.5) is rejected while the single argument conversion new Vector2<int>(floatVector) stays valid (new).
        // TODO: Validate that a constant abstract integer argument lies within the range of an int or uint component and that a constant abstract argument lies within the finite range of a float or float16 component, so new uint(-1), new int(5000000000) and new float16(70000.0) are rejected while new int(1e10) is clamped and stays valid (new).
    }
}
