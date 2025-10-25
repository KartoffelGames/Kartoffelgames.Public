import { PgslForStatement } from "../../../../syntax_tree/statement/branch/pgsl-for-statement.ts";
import { PgslTrace } from "../../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from "../../../i-pgsl-transpiler-processor.interface.ts";

export class PgslForStatementTranspilerProcessor implements IPgslTranspilerProcessor<PgslForStatement> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslForStatement {
        return PgslForStatement;
    }

    /**
     * Transpiles a PGSL for statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslForStatement, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        let lResult: string = '';

        // Transpile init value when set.
        if (pInstance.init) {
            lResult += pTranspile(pInstance.init);
        }

        // Create a loop.
        lResult += 'loop {';

        // When a expression is set define it as exit.
        if (pInstance.expression) {
            lResult += `if !(${pTranspile(pInstance.expression)}) { break; }`;
        }

        // Append the actual body.
        lResult += pTranspile(pInstance.block);

        // Set the update expression when defined.
        if (pInstance.update) {
            lResult += `${pTranspile(pInstance.update)};`;
        }

        // And close the loop.
        return lResult + '}';
    }
}
