import { BreakStatementAst } from '../../../../abstract_syntax_tree/statement/single/break-statement-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class BreakStatementAstTranspilerProcessor implements ITranspilerProcessor<BreakStatementAst> {
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
