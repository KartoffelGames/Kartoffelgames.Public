import { PgslContinueStatement } from "../../../../syntax_tree/statement/single/pgsl-continue-statement.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

export class PgslContinueStatementTranspilerProcessor implements IPgslTranspilerProcessor<PgslContinueStatement> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslContinueStatement {
        return PgslContinueStatement;
    }

    /**
     * Transpiles a PGSL continue statement into WGSL code.
     * 
     * @param _pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param _pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(_pInstance: PgslContinueStatement, _pTrace: PgslTrace, _pTranspile: PgslTranspilerProcessorTranspile): string {
        return `continue;`;
    }
}
