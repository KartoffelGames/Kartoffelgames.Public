import { ContinueStatementAst, type ContinueStatementAstData } from '../../../../abstract_syntax_tree/statement/single/continue-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of ContinueStatementAst.
 */
export class ContinueStatementAstValidationProcessor extends PgslValidatorProcessor<ContinueStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ContinueStatementAst {
        return ContinueStatementAst;
    }

    /**
     * Validates the PGSL continue statement syntax tree.
     * 
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: ContinueStatementAstData): void {
        // TODO: Validate that the continue statement is placed inside a while, do-while or for loop, searched as enclosing ancestor with stackContains, where a switch between the loop and the continue is allowed.
    }
}
