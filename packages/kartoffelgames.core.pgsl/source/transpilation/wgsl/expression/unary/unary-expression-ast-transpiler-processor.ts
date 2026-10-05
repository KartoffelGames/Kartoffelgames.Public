import { UnaryExpressionAst } from '../../../../abstract_syntax_tree/expression/unary/unary-expression-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class UnaryExpressionAstTranspilerProcessor extends TranspilerProcessor<UnaryExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof UnaryExpressionAst {
        return UnaryExpressionAst;
    }

    /**
     * Transpiles a PGSL expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: UnaryExpressionAst): string {
        // Transpile expression.
        const lExpression: string = this.transpileAst(pInstance.data.expression);
        return `${pInstance.data.operator}${lExpression}`;
    }
}