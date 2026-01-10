import { WhileStatementAst } from '../../../../abstract_syntax_tree/statement/branch/while-statement-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class WhileStatementAstTranspilerProcessor implements ITranspilerProcessor<WhileStatementAst> {
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
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: WhileStatementAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `loop{if !(${pTranspile(pInstance.data.expression)}){break;}${pTranspile(pInstance.data.block)}}`;
    }
}
