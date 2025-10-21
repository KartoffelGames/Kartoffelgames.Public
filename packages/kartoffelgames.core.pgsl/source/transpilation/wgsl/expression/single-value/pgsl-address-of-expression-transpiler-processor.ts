import { PgslAddressOfExpression } from "../../../../syntax_tree/expression/single_value/pgsl-address-of-expression.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

export class PgslAddressOfExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslAddressOfExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslAddressOfExpression {
        return PgslAddressOfExpression;
    }

    /**
     * Transpiles a PGSL address-of expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    process(pInstance: PgslAddressOfExpression, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        throw new Error("Method not implemented.");
    }
}
