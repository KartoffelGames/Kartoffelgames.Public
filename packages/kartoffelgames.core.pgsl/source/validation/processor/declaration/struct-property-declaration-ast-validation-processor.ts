import { StructPropertyDeclarationAst } from '../../../abstract_syntax_tree/declaration/struct-property-declaration-ast.ts';
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
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: StructPropertyDeclarationAst): void {
    }
}
