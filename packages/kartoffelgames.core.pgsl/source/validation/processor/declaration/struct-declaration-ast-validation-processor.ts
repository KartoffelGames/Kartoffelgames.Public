import { StructDeclarationAst } from '../../../abstract_syntax_tree/declaration/struct-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of StructDeclarationAst.
 */
export class StructDeclarationAstValidationProcessor extends PgslValidatorProcessor<StructDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof StructDeclarationAst {
        return StructDeclarationAst;
    }

    /**
     * Validates the PGSL struct declaration syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: StructDeclarationAst): void {
    }
}
