import { PgslVariableNameExpression } from "../../../../syntax_tree/expression/storage/pgsl-variable-name-expression.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

export class PgslVariableNameExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PgslVariableNameExpression> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslVariableNameExpression {
        return PgslVariableNameExpression;
    }

    /**
     * Transpiles a PGSL variable name expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    process(pInstance: PgslVariableNameExpression, pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        throw new Error("Method not implemented.");
    }
}
