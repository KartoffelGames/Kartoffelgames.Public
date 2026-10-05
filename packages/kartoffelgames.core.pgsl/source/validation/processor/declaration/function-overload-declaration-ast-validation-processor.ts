import { FunctionOverloadDeclarationAst } from '../../../abstract_syntax_tree/declaration/function-overload-declaration-ast.ts';
import { PgslValidatorProcessor } from '../../pgsl-validator-processor.ts';

/**
 * Validation processor of FunctionOverloadDeclarationAst.
 */
export class FunctionOverloadDeclarationAstValidationProcessor extends PgslValidatorProcessor<FunctionOverloadDeclarationAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof FunctionOverloadDeclarationAst {
        return FunctionOverloadDeclarationAst;
    }

    /**
     * Validates the PGSL function overload declaration syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: FunctionOverloadDeclarationAst): void {
    }
}
