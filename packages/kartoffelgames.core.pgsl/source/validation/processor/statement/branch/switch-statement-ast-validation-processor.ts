import { SwitchStatementAst, type SwitchStatementAstData } from '../../../../abstract_syntax_tree/statement/branch/switch-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of SwitchStatementAst.
 */
export class SwitchStatementAstValidationProcessor extends PgslValidatorProcessor<SwitchStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof SwitchStatementAst {
        return SwitchStatementAst;
    }

    /**
     * Validates the PGSL switch statement syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: SwitchStatementAstData): void {
        // TODO: Validate the child switch expression.
        // TODO: Validate the child value expressions of every case.
        // TODO: Validate the child block of every case.
        // TODO: Validate the child default block.
        // TODO: Validate that every case value is a constant expression.
        // TODO: Validate that no constant case value is used twice across all cases of the switch.
        // TODO: Validate that the switch expression converts to int or uint.
        // TODO: Validate that every case value converts to int or uint.
        // TODO: Validate that the switch expression and all case values convert to one common type int or uint, so a uint switch expression rejects a 1i case value (new).
        // TODO: Validate that every constant case value is representable in that common type, e.g. no negative case value for a uint switch expression (new).
    }
}
