import { TypeDeclarationAst } from '../../../abstract_syntax_tree/general/type-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of TypeDeclarationAst.
 */
export class TypeDeclarationAstValidationProcessor extends PgslValidatorProcessor<TypeDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof TypeDeclarationAst {
        return TypeDeclarationAst;
    }

    /**
     * Validates the PGSL type declaration syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: TypeDeclarationAst): void {
    }
}
