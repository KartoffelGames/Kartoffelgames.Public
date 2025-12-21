import { FunctionCallStatementAst } from '../../../../abstract_syntax_tree/statement/execution/function-call-statement-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslFunctionCallStatementTranspilerProcessor implements IPgslTranspilerProcessor<FunctionCallStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof FunctionCallStatementAst {
        return FunctionCallStatementAst;
    }

    /**
     * Transpiles a PGSL function call statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: FunctionCallStatementAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return pTranspile(pInstance.data.functionExpression) + ';';
    }
}
