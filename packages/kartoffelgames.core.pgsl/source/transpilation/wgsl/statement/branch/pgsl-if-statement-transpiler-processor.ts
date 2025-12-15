import { IfStatementAst } from '../../../../abstract_syntax_tree/statement/branch/pgsl-if-statement.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslIfStatementTranspilerProcessor implements IPgslTranspilerProcessor<IfStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof IfStatementAst {
        return IfStatementAst;
    }

    /**
     * Transpiles a PGSL if statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: IfStatementAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        if (!pInstance.data.else) {
            return `if (${pTranspile(pInstance.data.expression)}) ${pTranspile(pInstance.data.block)}`;
        } else {
            return `if (${pTranspile(pInstance.data.expression)}) ${pTranspile(pInstance.data.block)} else ${pTranspile(pInstance.data.else)}`;
        }
    }
}
