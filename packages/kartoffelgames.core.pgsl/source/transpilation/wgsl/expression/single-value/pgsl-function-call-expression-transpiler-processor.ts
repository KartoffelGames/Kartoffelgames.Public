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
     * @param pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    process(pInstance: PgslFunctionCallExpression, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        throw new Error("Method not implemented.");
    }
}
