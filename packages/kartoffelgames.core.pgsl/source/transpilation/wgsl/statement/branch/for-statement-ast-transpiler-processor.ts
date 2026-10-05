import { ForStatementAst } from '../../../../abstract_syntax_tree/statement/branch/for-statement-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class ForStatementAstTranspilerProcessor extends TranspilerProcessor<ForStatementAst> {
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
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: ForStatementAst): string {
        let lResult: string = '';

        // Transpile init value when set.
        if (pInstance.data.init) {
            lResult += this.transpileAst(pInstance.data.init);
        }

        // Create a loop.
        lResult += 'loop{';

        // When a expression is set define it as exit.
        if (pInstance.data.expression) {
            lResult += `if !(${this.transpileAst(pInstance.data.expression)}){break;}`;
        }

        // Append the actual body.
        lResult += this.transpileAst(pInstance.data.block);

        // Set the update expression when defined.
        if (pInstance.data.update) {
            lResult += `continuing{${this.transpileAst(pInstance.data.update)}}`;
        }

        // And close the loop.
        return lResult + '}';
    }
}
