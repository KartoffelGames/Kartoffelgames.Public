import { IncrementDecrementStatementAst } from '../../../../abstract_syntax_tree/statement/execution/increment-decrement-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of IncrementDecrementStatementAst.
 */
export class IncrementDecrementStatementAstValidationProcessor extends PgslValidatorProcessor<IncrementDecrementStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof IncrementDecrementStatementAst {
        return IncrementDecrementStatementAst;
    }

    /**
     * Validates the PGSL increment decrement statement syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: IncrementDecrementStatementAst): void {
    }
}
