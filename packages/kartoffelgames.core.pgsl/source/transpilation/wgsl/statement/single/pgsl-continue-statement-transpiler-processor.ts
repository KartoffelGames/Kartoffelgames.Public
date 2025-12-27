import { ContinueStatementAst } from '../../../../abstract_syntax_tree/statement/single/continue-statement-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class PgslContinueStatementTranspilerProcessor implements ITranspilerProcessor<ContinueStatementAst> {
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
