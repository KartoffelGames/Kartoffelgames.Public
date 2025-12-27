import { DiscardStatementAst } from '../../../../abstract_syntax_tree/statement/single/discard-statement-ast.ts';
import type { ITranspilerProcessor } from '../../../i-transpiler-processor.interface.ts';

export class DiscardStatementAstTranspilerProcessor implements ITranspilerProcessor<DiscardStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof DiscardStatementAst {
        return DiscardStatementAst;
    }

    /**
     * Transpiles a PGSL discard statement into WGSL code.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(): string {
        return `discard;`;
    }
}
