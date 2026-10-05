import { ParenthesizedExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/parenthesized-expression-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class ParenthesizedExpressionAstTranspilerProcessor extends TranspilerProcessor<ParenthesizedExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ParenthesizedExpressionAst {
        return ParenthesizedExpressionAst;
    }

    /**
     * Transpiles a PGSL parenthesized expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * 
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: ParenthesizedExpressionAst): string {
        return `(${this.transpileAst(pInstance.data.expression)})`;
    }
}
