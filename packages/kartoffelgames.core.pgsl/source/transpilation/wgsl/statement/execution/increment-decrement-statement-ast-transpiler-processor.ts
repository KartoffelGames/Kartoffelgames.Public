import { IncrementDecrementStatementAst } from '../../../../abstract_syntax_tree/statement/execution/increment-decrement-statement-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class IncrementDecrementStatementAstTranspilerProcessor extends TranspilerProcessor<IncrementDecrementStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof IncrementDecrementStatementAst {
        return IncrementDecrementStatementAst;
    }

    /**
     * Transpiles a PGSL increment/decrement statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: IncrementDecrementStatementAst): string {
        return `${this.transpileAst(pInstance.data.expression)}${pInstance.data.operator};`;
    }
}
