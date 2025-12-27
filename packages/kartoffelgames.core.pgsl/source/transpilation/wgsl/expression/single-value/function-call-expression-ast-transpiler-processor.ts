import { FunctionCallExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class FunctionCallExpressionAstTranspilerProcessor implements ITranspilerProcessor<FunctionCallExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof FunctionCallExpressionAst {
        return FunctionCallExpressionAst;
    }

    /**
     * Transpiles a PGSL function call expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: FunctionCallExpressionAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pInstance.data.name}(${pInstance.data.parameters.map(pParam => pTranspile(pParam)).join(',')})`;
    }
}
