import { VariableDeclarationAst } from '../../../abstract_syntax_tree/declaration/variable-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of VariableDeclarationAst.
 */
export class VariableDeclarationAstValidationProcessor extends PgslValidatorProcessor<VariableDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof VariableDeclarationAst {
        return VariableDeclarationAst;
    }

    /**
     * Validates the PGSL variable declaration syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: VariableDeclarationAst): void {
    }
}
