import { PgslComparisonExpression } from "../../../../syntax_tree/expression/operation/pgsl-comparison-expression.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

export class PgslComparisonExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslComparisonExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslComparisonExpression {
        return PgslComparisonExpression;
    }

    /**
     * Transpiles a PGSL comparison expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslComparisonExpression, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pTranspile(pInstance.leftExpression)} ${pInstance.operatorName} ${pTranspile(pInstance.rightExpression)}`;
    }
}
