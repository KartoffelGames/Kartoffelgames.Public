import { AliasDeclarationAst } from '../../../abstract_syntax_tree/declaration/alias-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of AliasDeclarationAst.
 */
export class AliasDeclarationAstValidationProcessor extends PgslValidatorProcessor<AliasDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof AliasDeclarationAst {
        return AliasDeclarationAst;
    }

    /**
     * Validates the PGSL alias declaration syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: AliasDeclarationAst): void {
    }
}
