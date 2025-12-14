import { PgslStringValueExpression } from '../../../../abstract_syntax_tree/expression/single_value/string-value-expression-ast.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslStringValueExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslStringValueExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslStringValueExpression {
        return PgslStringValueExpression;
    }

    /**
     * Transpiles a PGSL string value expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param _pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslStringValueExpression, _pTrace: PgslTrace, _pTranspile: PgslTranspilerProcessorTranspile): string {
        return pInstance.value;
    }
}
