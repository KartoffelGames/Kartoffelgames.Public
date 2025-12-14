import { PgslFunctionCallExpression } from '../../../../abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslFunctionCallExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslFunctionCallExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslFunctionCallExpression {
        return PgslFunctionCallExpression;
    }

    /**
     * Transpiles a PGSL function call expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslFunctionCallExpression, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pInstance.name}(${pInstance.parameter.map(pParam => pTranspile(pParam)).join(', ')})`;
    }
}
