import { PgslBlockStatement } from '../../../../abstract_syntax_tree/statement/execution/pgsl-block-statement.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslBlockStatementTranspilerProcessor implements IPgslTranspilerProcessor<PgslBlockStatement> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslBlockStatement {
        return PgslBlockStatement;
    }

    /**
     * Transpiles a PGSL block statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslBlockStatement, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Transpile all statements.
        return `{\n${pInstance.statements.map(pStatement => pTranspile(pStatement)).join('\n')}\n}`;
    }
}
