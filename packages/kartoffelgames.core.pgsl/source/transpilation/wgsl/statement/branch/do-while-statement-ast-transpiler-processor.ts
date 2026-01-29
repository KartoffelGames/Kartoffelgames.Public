import { DoWhileStatementAst } from '../../../../abstract_syntax_tree/statement/branch/do-while-statement-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class DoWhileStatementAstTranspilerProcessor implements ITranspilerProcessor<DoWhileStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof DoWhileStatementAst {
        return DoWhileStatementAst;
    }

    /**
     * Transpiles a PGSL do-while statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: DoWhileStatementAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `loop{${pTranspile(pInstance.data.block)}if !(${pTranspile(pInstance.data.expression)}){break;}}`;
    }
}
