import { PgslIndexedValueExpression } from '../../../../abstract_syntax_tree/expression/storage/pgsl-indexed-value-expression.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslIndexedValueExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslIndexedValueExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslIndexedValueExpression {
        return PgslIndexedValueExpression;
    }

    /**
     * Transpiles a PGSL indexed value expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslIndexedValueExpression, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pTranspile(pInstance.value)}[${pTranspile(pInstance.index)}]`;
    }
}
