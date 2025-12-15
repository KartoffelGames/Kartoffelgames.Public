import { ReturnStatementAst } from '../../../../abstract_syntax_tree/statement/single/return-statement-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslReturnStatementTranspilerProcessor implements IPgslTranspilerProcessor<ReturnStatementAst> {
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
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: ReturnStatementAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        if (!pInstance.data.expression) {
            return `return;`;
        }

        return `return ${pTranspile(pInstance.data.expression)};`;
    }
}
