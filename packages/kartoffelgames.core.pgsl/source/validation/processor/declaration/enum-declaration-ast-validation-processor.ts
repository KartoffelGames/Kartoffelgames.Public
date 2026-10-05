import { EnumDeclarationAst } from '../../../abstract_syntax_tree/declaration/enum-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of EnumDeclarationAst.
 */
export class EnumDeclarationAstValidationProcessor extends PgslValidatorProcessor<EnumDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof EnumDeclarationAst {
        return EnumDeclarationAst;
    }

    /**
     * Validates the PGSL enum declaration syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: EnumDeclarationAst): void {
    }
}
