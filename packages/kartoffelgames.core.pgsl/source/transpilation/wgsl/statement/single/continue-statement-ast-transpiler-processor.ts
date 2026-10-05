import { ContinueStatementAst } from '../../../../abstract_syntax_tree/statement/single/continue-statement-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class ContinueStatementAstTranspilerProcessor extends TranspilerProcessor<ContinueStatementAst> {
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
    protected override onProcess(): string {
        return `continue;`;
    }
}
