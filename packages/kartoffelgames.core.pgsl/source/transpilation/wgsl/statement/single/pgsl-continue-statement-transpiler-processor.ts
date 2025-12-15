import { ContinueStatementAst } from '../../../../abstract_syntax_tree/statement/single/pgsl-continue-statement.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslContinueStatementTranspilerProcessor implements IPgslTranspilerProcessor<ContinueStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ContinueStatementAst {
        return ContinueStatementAst;
    }

    /**
     * Transpiles a PGSL continue statement into WGSL code.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(): string {
        return `continue;`;
    }
}
