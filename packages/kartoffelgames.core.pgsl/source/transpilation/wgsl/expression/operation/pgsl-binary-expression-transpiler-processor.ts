import { PgslBinaryExpression } from "../../../../syntax_tree/expression/operation/pgsl-binary-expression.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

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
     * @param pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    process(pInstance: PgslBinaryExpression, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        throw new Error("Method not implemented.");
    }
}
