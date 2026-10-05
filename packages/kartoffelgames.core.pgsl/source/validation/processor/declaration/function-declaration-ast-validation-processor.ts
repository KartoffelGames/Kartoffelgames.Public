import { FunctionDeclarationAst } from '../../../abstract_syntax_tree/declaration/function-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of FunctionDeclarationAst.
 */
export class FunctionDeclarationAstValidationProcessor extends PgslValidatorProcessor<FunctionDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof FunctionDeclarationAst {
        return FunctionDeclarationAst;
    }

    /**
     * Validates the PGSL function declaration syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: FunctionDeclarationAst): void {
    }
}
