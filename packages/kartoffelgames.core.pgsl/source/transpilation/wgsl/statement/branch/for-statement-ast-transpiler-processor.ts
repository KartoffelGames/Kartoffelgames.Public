import { ForStatementAst } from '../../../../abstract_syntax_tree/statement/branch/for-statement-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class ForStatementAstTranspilerProcessor implements ITranspilerProcessor<ForStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ForStatementAst {
        return ForStatementAst;
    }

    /**
     * Transpiles a PGSL for statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: ForStatementAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        let lResult: string = '';

        // Transpile init value when set.
        if (pInstance.data.init) {
            lResult += pTranspile(pInstance.data.init);
        }

        // Create a loop.
        lResult += 'loop{';

        // When a expression is set define it as exit.
        if (pInstance.data.expression) {
            lResult += `if !(${pTranspile(pInstance.data.expression)}){break;}`;
        }

        // Append the actual body.
        lResult += pTranspile(pInstance.data.block);

        // Set the update expression when defined.
        if (pInstance.data.update) {
            lResult += `continuing{${pTranspile(pInstance.data.update)}}`;
        }

        // And close the loop.
        return lResult + '}';
    }
}
