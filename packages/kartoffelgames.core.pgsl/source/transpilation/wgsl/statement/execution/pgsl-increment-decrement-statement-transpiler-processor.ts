import { IncrementDecrementStatementAst } from '../../../../abstract_syntax_tree/statement/execution/increment-decrement-statement-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslIncrementDecrementStatementTranspilerProcessor implements IPgslTranspilerProcessor<IncrementDecrementStatementAst> {
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
        // TODO: Maybe the semicolon should be handled differently. Loops like the for loop dont need them.
        return `${pTranspile(pInstance.data.expression)}${pInstance.data.operator};`;
    }
}
