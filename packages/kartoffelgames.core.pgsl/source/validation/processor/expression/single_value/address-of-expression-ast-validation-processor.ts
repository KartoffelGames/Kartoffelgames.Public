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
    }
}
