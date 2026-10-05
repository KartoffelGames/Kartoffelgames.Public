import { WhileStatementAst } from '../../../../abstract_syntax_tree/statement/branch/while-statement-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class WhileStatementAstTranspilerProcessor extends TranspilerProcessor<WhileStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof WhileStatementAst {
        return WhileStatementAst;
    }

    /**
     * Transpiles a PGSL while statement into WGSL code.
     *
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: WhileStatementAst): string {
        return `loop{if !(${this.transpileAst(pInstance.data.expression)}){break;}${this.transpileAst(pInstance.data.block)}}`;
    }
}
