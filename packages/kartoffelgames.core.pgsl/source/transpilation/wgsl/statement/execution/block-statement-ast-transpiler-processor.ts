import { BlockStatementAst } from '../../../../abstract_syntax_tree/statement/execution/block-statement-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class BlockStatementAstTranspilerProcessor extends TranspilerProcessor<BlockStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof BlockStatementAst {
        return BlockStatementAst;
    }

    /**
     * Transpiles a PGSL block statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: BlockStatementAst): string {
        // Transpile all statements.
        return `{${pInstance.data.statementList.map(pStatement => this.transpileAst(pStatement)).join('')}}`;
    }
}
