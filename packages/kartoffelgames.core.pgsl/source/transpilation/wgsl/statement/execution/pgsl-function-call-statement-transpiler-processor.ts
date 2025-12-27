import { FunctionCallStatementAst } from '../../../../abstract_syntax_tree/statement/execution/function-call-statement-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class PgslFunctionCallStatementTranspilerProcessor implements ITranspilerProcessor<FunctionCallStatementAst> {
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
