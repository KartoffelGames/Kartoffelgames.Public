import { AssignmentStatementAst } from '../../../../abstract_syntax_tree/statement/execution/assignment-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of AssignmentStatementAst.
 */
export class AssignmentStatementAstValidationProcessor extends PgslValidatorProcessor<AssignmentStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof AssignmentStatementAst {
        return AssignmentStatementAst;
    }

    /**
     * Validates the PGSL assignment statement syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: AssignmentStatementAst): void {
    }
}
