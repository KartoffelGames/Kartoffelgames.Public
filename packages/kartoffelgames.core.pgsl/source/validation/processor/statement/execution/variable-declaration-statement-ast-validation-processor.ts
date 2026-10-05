import { VariableDeclarationStatementAst } from '../../../../abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of VariableDeclarationStatementAst.
 */
export class VariableDeclarationStatementAstValidationProcessor extends PgslValidatorProcessor<VariableDeclarationStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof VariableDeclarationStatementAst {
        return VariableDeclarationStatementAst;
    }

    /**
     * Validates the PGSL variable declaration statement syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: VariableDeclarationStatementAst): void {
    }
}
