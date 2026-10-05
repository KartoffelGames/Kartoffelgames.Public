import { DoWhileStatementAst } from '../../../../abstract_syntax_tree/statement/branch/do-while-statement-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class DoWhileStatementAstTranspilerProcessor extends TranspilerProcessor<DoWhileStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof DoWhileStatementAst {
        return DoWhileStatementAst;
    }

    /**
     * Transpiles a PGSL do-while statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: DoWhileStatementAst): string {
        return `loop{${this.transpileAst(pInstance.data.block)}if !(${this.transpileAst(pInstance.data.expression)}){break;}}`;
    }
}
