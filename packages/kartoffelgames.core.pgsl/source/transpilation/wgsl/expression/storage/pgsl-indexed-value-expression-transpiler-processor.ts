import { PgslIndexedValueExpression } from "../../../../syntax_tree/expression/storage/pgsl-indexed-value-expression.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

export class PgslIndexedValueExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslIndexedValueExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslIndexedValueExpression {
        return PgslIndexedValueExpression;
    }

    /**
     * Transpiles a PGSL indexed value expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    process(pInstance: PgslIndexedValueExpression, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        throw new Error("Method not implemented.");
    }
}
