import { PgslParenthesizedExpression } from '../../../../abstract_syntax_tree/expression/single_value/pgsl-parenthesized-expression.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslParenthesizedExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslParenthesizedExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslParenthesizedExpression {
        return PgslParenthesizedExpression;
    }

    /**
     * Transpiles a PGSL parenthesized expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslParenthesizedExpression, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `(${pTranspile(pInstance.expression)})`;
    }
}
