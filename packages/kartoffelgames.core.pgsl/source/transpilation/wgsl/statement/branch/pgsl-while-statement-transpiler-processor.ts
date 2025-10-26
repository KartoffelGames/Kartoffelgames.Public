import { PgslWhileStatement } from '../../../../syntax_tree/statement/branch/pgsl-while-statement.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslWhileStatementTranspilerProcessor implements IPgslTranspilerProcessor<PgslWhileStatement> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslWhileStatement {
        return PgslWhileStatement;
    }

    /**
     * Transpiles a PGSL while statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslWhileStatement, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `loop { if !(${pTranspile(pInstance.expression)}) { break; } ${pTranspile(pInstance.block)} }`;
    }
}
