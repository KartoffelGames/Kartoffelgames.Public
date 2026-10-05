import { BlockStatementAst } from '../../../../abstract_syntax_tree/statement/execution/block-statement-ast.ts';
import { PgslValidatorProcessor } from '../../../pgsl-validator-processor.ts';

/**
 * Validation processor of BlockStatementAst.
 */
export class BlockStatementAstValidationProcessor extends PgslValidatorProcessor<BlockStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof BlockStatementAst {
        return BlockStatementAst;
    }

    /**
     * Validates the PGSL block statement syntax tree.
     * 
     * @param _pInstance - The syntax tree instance to validate.
     */
    protected override onValidate(_pInstance: BlockStatementAst): void {
    }
}
