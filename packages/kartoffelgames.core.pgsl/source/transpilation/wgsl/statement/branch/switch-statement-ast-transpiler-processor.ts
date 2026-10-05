import { SwitchStatementAst } from '../../../../abstract_syntax_tree/statement/branch/switch-statement-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class SwitchStatementAstTranspilerProcessor extends TranspilerProcessor<SwitchStatementAst> {
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
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: SwitchStatementAst): string {
        // Open switch.
        let lResult: string = `switch(${this.transpileAst(pInstance.data.expression)}){`;

        // Append each case.
        for(const lCase of pInstance.data.cases) {
            lResult += `case ${lCase.cases.map((pTree)=> {return this.transpileAst(pTree);}).join(',')}:${this.transpileAst(lCase.block)}`;
        }

        // Append default case.
        lResult += `default:${this.transpileAst(pInstance.data.default)}`;

        // Close switch.
        return lResult + '}';
    }
}
