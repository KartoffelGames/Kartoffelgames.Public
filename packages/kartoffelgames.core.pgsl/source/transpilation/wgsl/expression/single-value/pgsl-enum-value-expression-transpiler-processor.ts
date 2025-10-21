import { PgslEnumValueExpression___ } from "../../../../syntax_tree/expression/single_value/pgsl-enum-value-expression.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

export class PgslEnumValueExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslEnumValueExpression___> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslEnumValueExpression___ {
        return PgslEnumValueExpression___;
    }

    /**
     * Transpiles a PGSL enum value expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    process(pInstance: PgslEnumValueExpression___, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        throw new Error("Method not implemented.");
    }
}
