import { PgslBinaryExpression } from '../../../../syntax_tree/expression/operation/pgsl-binary-expression.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslBinaryExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslBinaryExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslBinaryExpression {
        return PgslBinaryExpression;
    }

    /**
     * Transpiles a PGSL binary expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslBinaryExpression, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pTranspile(pInstance.leftExpression)} ${pInstance.operatorName} ${pTranspile(pInstance.rightExpression)}`;
    }
}
