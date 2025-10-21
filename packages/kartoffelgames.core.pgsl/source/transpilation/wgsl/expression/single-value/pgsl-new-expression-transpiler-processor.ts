import { PgslNewCallExpression } from "../../../../syntax_tree/expression/single_value/pgsl-new-expression.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

export class PgslNewCallExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslNewCallExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslNewCallExpression {
        return PgslNewCallExpression;
    }

    /**
     * Transpiles a PGSL new call expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    process(pInstance: PgslNewCallExpression, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        throw new Error("Method not implemented.");
    }
}
