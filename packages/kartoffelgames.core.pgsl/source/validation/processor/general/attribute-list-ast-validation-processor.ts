import { AttributeListAst } from '../../../abstract_syntax_tree/general/attribute-list-ast.ts';
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
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: AttributeListAst): void {
    }
}
