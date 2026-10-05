import { DiscardStatementAst } from '../../../../abstract_syntax_tree/statement/single/discard-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of DiscardStatementAst.
 */
export class DiscardStatementAstValidationProcessor extends PgslValidatorProcessor<DiscardStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof DiscardStatementAst {
        return DiscardStatementAst;
    }

    /**
     * Validates the PGSL discard statement syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: DiscardStatementAst): void {
    }
}
