import { PgslDoWhileStatement } from '../../../../syntax_tree/statement/branch/pgsl-do-while-statement.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslDoWhileStatementTranspilerProcessor implements IPgslTranspilerProcessor<PgslDoWhileStatement> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslDoWhileStatement {
        return PgslDoWhileStatement;
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
    public process(pInstance: PgslDoWhileStatement, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `loop { ${pTranspile(pInstance.block)} if !(${pTranspile(pInstance.expression)}) { break; } }`;
    }
}
