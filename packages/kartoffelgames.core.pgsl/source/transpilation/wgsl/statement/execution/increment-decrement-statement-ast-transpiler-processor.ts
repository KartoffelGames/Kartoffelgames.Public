import { IncrementDecrementStatementAst } from '../../../../abstract_syntax_tree/statement/execution/increment-decrement-statement-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class IncrementDecrementStatementAstTranspilerProcessor implements ITranspilerProcessor<IncrementDecrementStatementAst> {
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
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: IncrementDecrementStatementAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pTranspile(pInstance.data.expression)}${pInstance.data.operator};`;
    }
}
