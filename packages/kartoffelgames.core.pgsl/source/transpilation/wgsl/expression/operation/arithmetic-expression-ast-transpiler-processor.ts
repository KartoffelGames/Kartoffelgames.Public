import { ArithmeticExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/arithmetic-expression-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class ArithmeticExpressionAstTranspilerProcessor extends TranspilerProcessor<ArithmeticExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ArithmeticExpressionAst {
        return ArithmeticExpressionAst;
    }

    /**
     * Transpiles a PGSL arithmetic expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: ArithmeticExpressionAst): string {
        return `${this.transpileAst(pInstance.data.leftExpression)}${pInstance.data.operator}${this.transpileAst(pInstance.data.rightExpression)}`;
    }
}
