import { PgslDiscardStatement } from '../../../../syntax_tree/statement/single/pgsl-discard-statement.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslDiscardStatementTranspilerProcessor implements IPgslTranspilerProcessor<PgslDiscardStatement> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslDiscardStatement {
        return PgslDiscardStatement;
    }

    /**
     * Transpiles a PGSL discard statement into WGSL code.
     * 
     * @param _pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param _pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(_pInstance: PgslDiscardStatement, _pTrace: PgslTrace, _pTranspile: PgslTranspilerProcessorTranspile): string {
        return `discard;`;
    }
}
