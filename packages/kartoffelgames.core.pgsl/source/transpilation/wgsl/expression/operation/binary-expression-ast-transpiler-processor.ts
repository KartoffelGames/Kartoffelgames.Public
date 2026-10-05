import { BinaryExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/binary-expression-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class BinaryExpressionAstTranspilerProcessor extends TranspilerProcessor<BinaryExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof BinaryExpressionAst {
        return BinaryExpressionAst;
    }

    /**
     * Transpiles a PGSL binary expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: BinaryExpressionAst): string {
        return `${this.transpileAst(pInstance.data.leftExpression)}${pInstance.data.operatorName}${this.transpileAst(pInstance.data.rightExpression)}`;
    }
}
