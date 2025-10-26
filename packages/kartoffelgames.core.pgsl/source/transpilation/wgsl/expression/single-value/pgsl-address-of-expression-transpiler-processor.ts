import { PgslAddressOfExpression } from '../../../../syntax_tree/expression/single_value/pgsl-address-of-expression.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslAddressOfExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslAddressOfExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslAddressOfExpression {
        return PgslAddressOfExpression;
    }

    /**
     * Transpiles a PGSL address-of expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslAddressOfExpression, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `&${pTranspile(pInstance.variable)}`;
    }
}
