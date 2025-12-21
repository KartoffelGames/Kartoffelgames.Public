import { AssignmentStatementAst } from '../../../../abstract_syntax_tree/statement/execution/assignment-statement-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslAssignmentStatementTranspilerProcessor implements IPgslTranspilerProcessor<AssignmentStatementAst> {
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
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: AssignmentStatementAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pTranspile(pInstance.data.variable)} ${pInstance.data.assignment} ${pTranspile(pInstance.data.expression)};`;
    }
}
