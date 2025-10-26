import { PgslFunctionCallStatement } from '../../../../syntax_tree/statement/execution/pgsl-function-call-statement.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslFunctionCallStatementTranspilerProcessor implements IPgslTranspilerProcessor<PgslFunctionCallStatement> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslFunctionCallStatement {
        return PgslFunctionCallStatement;
    }

    /**
     * Transpiles a PGSL function call statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslFunctionCallStatement, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return pTranspile(pInstance.functionExpression) + ';';
    }
}
