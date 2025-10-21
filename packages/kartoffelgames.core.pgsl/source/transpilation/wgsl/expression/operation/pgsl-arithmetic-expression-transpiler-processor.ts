import { PgslArithmeticExpression } from "../../../../syntax_tree/expression/operation/pgsl-arithmetic-expression.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

export class PgslArithmeticExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslArithmeticExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslArithmeticExpression {
        return PgslArithmeticExpression;
    }

    /**
     * Transpiles a PGSL arithmetic expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    process(pInstance: PgslArithmeticExpression, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        throw new Error("Method not implemented.");
    }
}
