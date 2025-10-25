import { PgslFunctionCallExpression } from "../../../../syntax_tree/expression/single_value/pgsl-function-call-expression.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

export class PgslFunctionCallExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslFunctionCallExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslFunctionCallExpression {
        return PgslFunctionCallExpression;
    }

    /**
     * Transpiles a PGSL function call expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslFunctionCallExpression, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pInstance.name}(${pInstance.parameter.map(param => pTranspile(param)).join(', ')})`;
    }
}
