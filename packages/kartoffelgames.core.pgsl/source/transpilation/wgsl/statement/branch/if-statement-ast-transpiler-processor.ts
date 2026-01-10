import { IfStatementAst } from '../../../../abstract_syntax_tree/statement/branch/if-statement-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class IfStatementAstTranspilerProcessor implements ITranspilerProcessor<IfStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof IfStatementAst {
        return IfStatementAst;
    }

    /**
     * Transpiles a PGSL if statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: IfStatementAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        if (!pInstance.data.else) {
            return `if(${pTranspile(pInstance.data.expression)})${pTranspile(pInstance.data.block)}`;
        } else {
            // Omit trailing space if else is a block.
            if (pInstance.data.else instanceof IfStatementAst) {
                return `if(${pTranspile(pInstance.data.expression)})${pTranspile(pInstance.data.block)}else ${pTranspile(pInstance.data.else)}`;
            }
            return `if(${pTranspile(pInstance.data.expression)})${pTranspile(pInstance.data.block)}else${pTranspile(pInstance.data.else)}`;
        }
    }
}
