import { PgslAssignmentStatement } from '../../../../abstract_syntax_tree/statement/execution/pgsl-assignment-statement.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslAssignmentStatementTranspilerProcessor implements IPgslTranspilerProcessor<PgslAssignmentStatement> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslAssignmentStatement {
        return PgslAssignmentStatement;
    }

    /**
     * Transpiles a PGSL assignment statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslAssignmentStatement, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pTranspile(pInstance.variable)} ${pInstance.assignmentName} ${pTranspile(pInstance.expression)};`;
    }
}
