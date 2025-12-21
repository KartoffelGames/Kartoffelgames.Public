import { BlockStatementAst } from '../../../../abstract_syntax_tree/statement/execution/block-statement-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslBlockStatementTranspilerProcessor implements IPgslTranspilerProcessor<BlockStatementAst> {
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
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: BlockStatementAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Transpile all statements.
        return `{${pInstance.data.statementList.map(pStatement => pTranspile(pStatement)).join('')}}`;
    }
}
