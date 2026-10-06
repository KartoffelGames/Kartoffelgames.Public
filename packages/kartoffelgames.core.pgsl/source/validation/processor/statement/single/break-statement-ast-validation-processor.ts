import { BreakStatementAst, type BreakStatementAstData } from '../../../../abstract_syntax_tree/statement/single/break-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of BreakStatementAst.
 */
export class BreakStatementAstValidationProcessor extends PgslValidatorProcessor<BreakStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof BreakStatementAst {
        return BreakStatementAst;
    }

    /**
     * Validates the PGSL break statement syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: BreakStatementAstData): void {
        // TODO: Validate that the break statement is placed inside a while, do-while or for loop or a switch statement, searched as enclosing ancestor with stackContains.
    }
}
