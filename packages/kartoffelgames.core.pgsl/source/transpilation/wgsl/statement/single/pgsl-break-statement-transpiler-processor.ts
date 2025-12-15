import { BreakStatementAst } from '../../../../abstract_syntax_tree/statement/single/pgsl-break-statement.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslBreakStatementTranspilerProcessor implements IPgslTranspilerProcessor<BreakStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof BreakStatementAst {
        return BreakStatementAst;
    }

    /**
     * Transpiles a PGSL break statement into WGSL code.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(): string {
        return `break;`;
    }
}
