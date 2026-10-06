import { DoWhileStatementAst, type DoWhileStatementAstData } from '../../../../abstract_syntax_tree/statement/branch/do-while-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of DoWhileStatementAst.
 */
export class DoWhileStatementAstValidationProcessor extends PgslValidatorProcessor<DoWhileStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof DoWhileStatementAst {
        return DoWhileStatementAst;
    }

    /**
     * Validates the PGSL do while statement syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: DoWhileStatementAstData): void {
        // TODO: Validate the child block.
        // TODO: Validate the child condition expression.
        // TODO: Validate that the condition expression resolves to bool.
    }
}
