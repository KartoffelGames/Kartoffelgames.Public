import { PgslParenthesizedExpression } from "../../../../syntax_tree/expression/single_value/pgsl-parenthesized-expression.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

export class PgslParenthesizedExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslParenthesizedExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslParenthesizedExpression {
        return PgslParenthesizedExpression;
    }

    /**
     * Transpiles a PGSL parenthesized expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    process(pInstance: PgslParenthesizedExpression, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        throw new Error("Method not implemented.");
    }
}
