import { PgslLogicalExpression } from '../../../../abstract_syntax_tree/expression/operation/logical-expression-ast.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslLogicalExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslLogicalExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslLogicalExpression {
        return PgslLogicalExpression;
    }

    /**
     * Transpiles a PGSL logical expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslLogicalExpression, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pTranspile(pInstance.leftExpression)} ${pInstance.operatorName} ${pTranspile(pInstance.rightExpression)}`;
    }
}
