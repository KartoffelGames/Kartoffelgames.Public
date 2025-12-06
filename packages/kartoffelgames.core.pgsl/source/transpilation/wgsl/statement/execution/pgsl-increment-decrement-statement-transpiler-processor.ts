import { PgslIncrementDecrementStatement } from '../../../../abstract_syntax_tree/statement/execution/pgsl-increment-decrement-statement.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslIncrementDecrementStatementTranspilerProcessor implements IPgslTranspilerProcessor<PgslIncrementDecrementStatement> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslIncrementDecrementStatement {
        return PgslIncrementDecrementStatement;
    }

    /**
     * Transpiles a PGSL increment/decrement statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslIncrementDecrementStatement, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        // TODO: Maybe the semicolon should be handled differently. Loops like the for loop dont need them.
        return `${pTranspile(pInstance.expression)}${pInstance.operatorName};`;
    }
}
