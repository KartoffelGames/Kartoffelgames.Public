import { BlockStatementAst, type BlockStatementAstData } from '../../../../abstract_syntax_tree/statement/execution/block-statement-ast.ts';
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
     * @param _pData - The syntax tree data to validate.
     */
    protected override onValidate(_pData: BlockStatementAstData): void {
        // TODO: Validate each child statement of the block.
        // TODO: Validate that no two variable declarations directly inside the block share the same name.
    }
}
