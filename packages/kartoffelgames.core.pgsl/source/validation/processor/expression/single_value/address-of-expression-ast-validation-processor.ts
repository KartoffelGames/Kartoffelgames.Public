import { AddressOfExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/address-of-expression-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of AddressOfExpressionAst.
 */
export class AddressOfExpressionAstValidationProcessor extends PgslValidatorProcessor<AddressOfExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof AddressOfExpressionAst {
        return AddressOfExpressionAst;
    }

    /**
     * Validates the PGSL address of expression syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: AddressOfExpressionAst): void {
        // TODO: Validate the child target expression.
        // TODO: Validate that the target of the address is a stored value, so a let or module variable or a value reached through a pointer dereference, but not a const, a param or a function parameter, skipped when the target type is poison.
        // TODO: Validate that the type of the target is storable, skipped when it is poison.
        // TODO: Validate that the target is not a texture or sampler value, because their handle address space can not be addressed.
        // TODO: Validate that the target is not a single Vector component, neither by index like v[0] nor by a swizzle like v.x, because WGSL can not take the address of a vector component (new).
    }
}
