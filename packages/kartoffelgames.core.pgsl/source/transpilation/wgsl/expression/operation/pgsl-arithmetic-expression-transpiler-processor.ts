import { PgslArithmeticExpression } from '../../../../abstract_syntax_tree/expression/operation/pgsl-arithmetic-expression.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslArithmeticExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslArithmeticExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslArithmeticExpression {
        return PgslArithmeticExpression;
    }

    /**
     * Transpiles a PGSL arithmetic expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    process(pInstance: PgslArithmeticExpression, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pTranspile(pInstance.leftExpression)} ${pInstance.operatorName} ${pTranspile(pInstance.rightExpression)}`;
    }
}
