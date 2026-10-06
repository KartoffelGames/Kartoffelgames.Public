import { IfStatementAst } from '../../../../abstract_syntax_tree/statement/branch/if-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of IfStatementAst.
 */
export class IfStatementAstValidationProcessor extends PgslValidatorProcessor<IfStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof IfStatementAst {
        return IfStatementAst;
    }

    /**
     * Validates the PGSL if statement syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: IfStatementAst): void {
        // TODO: Validate the child condition expression.
        // TODO: Validate the child block.
        // TODO: Validate the child else block or else-if statement when present.
        // TODO: Validate that the condition expression resolves to bool, skipped when its type is poison.
    }
}
