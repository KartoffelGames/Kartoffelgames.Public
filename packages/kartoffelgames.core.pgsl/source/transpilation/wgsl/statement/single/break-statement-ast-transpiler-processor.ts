import { BreakStatementAst } from '../../../../abstract_syntax_tree/statement/single/break-statement-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class BreakStatementAstTranspilerProcessor extends TranspilerProcessor<BreakStatementAst> {
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
    protected override onProcess(): string {
        return `break;`;
    }
}
