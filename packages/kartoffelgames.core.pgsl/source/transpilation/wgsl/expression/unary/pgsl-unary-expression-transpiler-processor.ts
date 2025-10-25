import { PgslUnaryExpression } from "../../../../syntax_tree/expression/unary/pgsl-unary-expression.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

export class PgslUnaryExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslUnaryExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslUnaryExpression {
        return PgslUnaryExpression;
    }

    /**
     * Transpiles a PGSL expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslUnaryExpression, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Transpile expression.
        const lExpression: string = pTranspile(pInstance.expression);
        return `${pInstance.operator}${lExpression}`;
    }
}