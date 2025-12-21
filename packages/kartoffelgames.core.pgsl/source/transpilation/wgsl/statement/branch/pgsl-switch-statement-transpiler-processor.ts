import { SwitchStatementAst } from '../../../../abstract_syntax_tree/statement/branch/switch-statement-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslSwitchStatementTranspilerProcessor implements IPgslTranspilerProcessor<SwitchStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof SwitchStatementAst {
        return SwitchStatementAst;
    }

    /**
     * Transpiles a PGSL switch statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: SwitchStatementAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Open switch.
        let lResult: string = `switch (${pTranspile(pInstance.data.expression)}) {`;

        // Append each case.
        for(const lCase of pInstance.data.cases) {
            lResult += `case ${lCase.cases.map((pTree)=> {return pTranspile(pTree);}).join(', ')}: ${pTranspile(lCase.block)}`;
        }

        // Append default case.
        lResult += `default: ${pTranspile(pInstance.data.default)}`;

        // Close switch.
        return lResult + '}';
    }
}
