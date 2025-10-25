import { PgslIfStatement } from "../../../syntax_tree/statement/branch/pgsl-if-statement.ts";
import { PgslTrace } from "../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../i-pgsl-transpiler-processor.interface.ts";

export class PgslIfStatementTranspilerProcessor implements IPgslTranspilerProcessor<PgslIfStatement> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslIfStatement {
        return PgslIfStatement;
    }

    /**
     * Transpiles a PGSL if statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslIfStatement, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        if (!pInstance.else) {
            return `if (${pTranspile(pInstance.expression)}) ${pTranspile(pInstance.block)}`;
        } else {
            return `if (${pTranspile(pInstance.expression)}) ${pTranspile(pInstance.block)} else ${pTranspile(pInstance.else)}`;
        }
    }
}
