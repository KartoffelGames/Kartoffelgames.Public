import { ReturnStatementAst } from '../../../../abstract_syntax_tree/statement/single/return-statement-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class ReturnStatementAstTranspilerProcessor extends TranspilerProcessor<ReturnStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ReturnStatementAst {
        return ReturnStatementAst;
    }

    /**
     * Transpiles a PGSL return statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * 
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: ReturnStatementAst): string {
        if (!pInstance.data.expression) {
            return `return;`;
        }

        return `return ${this.transpileAst(pInstance.data.expression)};`;
    }
}
