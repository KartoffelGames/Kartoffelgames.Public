import { PgslStringValueExpression } from "../../../../syntax_tree/expression/single_value/pgsl-string-value-expression.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

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
     * @param pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    process(pInstance: PgslStringValueExpression, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        throw new Error("Method not implemented.");
    }
}
