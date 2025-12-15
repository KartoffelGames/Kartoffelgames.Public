import { WhileStatementAst } from '../../../../abstract_syntax_tree/statement/branch/pgsl-while-statement.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslWhileStatementTranspilerProcessor implements IPgslTranspilerProcessor<WhileStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof WhileStatementAst {
        return WhileStatementAst;
    }

    /**
     * Transpiles a PGSL while statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: WhileStatementAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `loop { if !(${pTranspile(pInstance.data.expression)}) { break; } ${pTranspile(pInstance.data.block)} }`;
    }
}
