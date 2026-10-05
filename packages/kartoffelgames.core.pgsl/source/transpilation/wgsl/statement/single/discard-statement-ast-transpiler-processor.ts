import { DiscardStatementAst } from '../../../../abstract_syntax_tree/statement/single/discard-statement-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class DiscardStatementAstTranspilerProcessor extends TranspilerProcessor<DiscardStatementAst> {
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
    protected override onProcess(): string {
        return `discard;`;
    }
}
