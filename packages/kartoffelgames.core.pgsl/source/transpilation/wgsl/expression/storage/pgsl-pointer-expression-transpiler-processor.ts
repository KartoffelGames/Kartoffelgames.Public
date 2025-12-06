import { PgslPointerExpression } from '../../../../abstract_syntax_tree/expression/storage/pgsl-pointer-expression.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslPointerExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslPointerExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslPointerExpression {
        return PgslPointerExpression;
    }

    /**
     * Transpiles a PGSL pointer expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslPointerExpression, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `*${pTranspile(pInstance.expression)}`;
    }
}
