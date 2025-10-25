import { PgslSwitchStatement } from "../../../syntax_tree/statement/branch/pgsl-switch-statement.ts";
import { PgslTrace } from "../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../i-pgsl-transpiler-processor.interface.ts";

export class PgslSwitchStatementTranspilerProcessor implements IPgslTranspilerProcessor<PgslSwitchStatement> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslSwitchStatement {
        return PgslSwitchStatement;
    }

    /**
     * Transpiles a PGSL switch statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslSwitchStatement, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Open switch.
        let lResult: string = `switch (${pTranspile(pInstance.expression)}) {`

        // Append each case.
        for(const lCase of pInstance.cases) {
            lResult += `case ${lCase.cases.map((lTree)=> {return pTranspile(lTree)}).join(', ')}: ${pTranspile(lCase.block)}`
        }

        // Close switch.
        return lResult + '}';
    }
}
