import { PgslNewCallExpression } from '../../../../syntax_tree/expression/single_value/pgsl-new-expression.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslNewCallExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslNewCallExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslNewCallExpression {
        return PgslNewCallExpression;
    }

    /**
     * Transpiles a PGSL new call expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslNewCallExpression, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Simply transpile the type and parameters without the new part.
        return `${pTranspile(pInstance.type)}(${pInstance.parameter.map(pParam => pTranspile(pParam)).join(', ')})`;
    }
}
