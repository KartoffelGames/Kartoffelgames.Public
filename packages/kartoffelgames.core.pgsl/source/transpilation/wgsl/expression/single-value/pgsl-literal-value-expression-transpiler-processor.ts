import { PgslLiteralValueExpression } from "../../../../syntax_tree/expression/single_value/pgsl-literal-value-expression.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

export class PgslLiteralValueExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslLiteralValueExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslLiteralValueExpression {
        return PgslLiteralValueExpression;
    }

    /**
     * Transpiles a PGSL literal value expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    process(pInstance: PgslLiteralValueExpression, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        throw new Error("Method not implemented.");
    }
}
