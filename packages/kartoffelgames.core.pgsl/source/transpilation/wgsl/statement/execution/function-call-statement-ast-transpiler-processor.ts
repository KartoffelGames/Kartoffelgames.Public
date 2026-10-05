import { FunctionCallStatementAst } from '../../../../abstract_syntax_tree/statement/execution/function-call-statement-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class FunctionCallStatementAstTranspilerProcessor extends TranspilerProcessor<FunctionCallStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof FunctionCallStatementAst {
        return FunctionCallStatementAst;
    }

    /**
     * Transpiles a PGSL function call statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: FunctionCallStatementAst): string {
        return this.transpileAst(pInstance.data.functionExpression) + ';';
    }
}
