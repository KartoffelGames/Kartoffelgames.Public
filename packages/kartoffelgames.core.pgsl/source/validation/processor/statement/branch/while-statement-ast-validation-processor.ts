import { WhileStatementAst, type WhileStatementAstData } from '../../../../abstract_syntax_tree/statement/branch/while-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of WhileStatementAst.
 */
export class WhileStatementAstValidationProcessor extends PgslValidatorProcessor<WhileStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof WhileStatementAst {
        return WhileStatementAst;
    }

    /**
     * Validates the PGSL while statement syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: WhileStatementAstData): void {
        // TODO: Validate the child condition expression.
        // TODO: Validate the child block.
        // TODO: Validate that the condition expression resolves to bool.
    }
}
