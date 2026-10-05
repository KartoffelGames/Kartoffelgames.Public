import { LogicalExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/logical-expression-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class LogicalExpressionAstTranspilerProcessor extends TranspilerProcessor<LogicalExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof LogicalExpressionAst {
        return LogicalExpressionAst;
    }

    /**
     * Transpiles a PGSL logical expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: LogicalExpressionAst): string {
        return `${this.transpileAst(pInstance.data.leftExpression)}${pInstance.data.operatorName}${this.transpileAst(pInstance.data.rightExpression)}`;
    }
}
