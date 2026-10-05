import { IfStatementAst } from '../../../../abstract_syntax_tree/statement/branch/if-statement-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class IfStatementAstTranspilerProcessor extends TranspilerProcessor<IfStatementAst> {
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
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: IfStatementAst): string {
        if (!pInstance.data.else) {
            return `if(${this.transpileAst(pInstance.data.expression)})${this.transpileAst(pInstance.data.block)}`;
        } else {
            // Omit trailing space if else is a block.
            if (pInstance.data.else instanceof IfStatementAst) {
                return `if(${this.transpileAst(pInstance.data.expression)})${this.transpileAst(pInstance.data.block)}else ${this.transpileAst(pInstance.data.else)}`;
            }
            return `if(${this.transpileAst(pInstance.data.expression)})${this.transpileAst(pInstance.data.block)}else${this.transpileAst(pInstance.data.else)}`;
        }
    }
}
