import { ForStatementAst } from '../../../../abstract_syntax_tree/statement/branch/for-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of ForStatementAst.
 */
export class ForStatementAstValidationProcessor extends PgslValidatorProcessor<ForStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ForStatementAst {
        return ForStatementAst;
    }

    /**
     * Validates the PGSL for statement syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: ForStatementAst): void {
        // TODO: Validate the child init declaration when present.
        // TODO: Validate the child condition expression when present.
        // TODO: Validate the child update statement when present.
        // TODO: Validate the child block.
        // TODO: Validate that the init declaration is a let declaration.
        // TODO: Validate that the condition expression resolves to bool.
        // TODO: Validate that the update statement is an assignment, an increment or decrement or a function call statement.
        // TODO: Validate that the recorded behavior of the block of a for loop without a condition contains Break or Return, where a break that targets a nested switch or loop does not count, as WGSL rejects a loop with an empty behavior (new).
    }
}
