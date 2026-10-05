import { AssignmentStatementAst } from '../../../../abstract_syntax_tree/statement/execution/assignment-statement-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class AssignmentStatementAstTranspilerProcessor extends TranspilerProcessor<AssignmentStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof AssignmentStatementAst {
        return AssignmentStatementAst;
    }

    /**
     * Transpiles a PGSL assignment statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: AssignmentStatementAst): string {
        return `${this.transpileAst(pInstance.data.variable)}${pInstance.data.assignment}${this.transpileAst(pInstance.data.expression)};`;
    }
}
