import { PointerExpressionAst } from '../../../../abstract_syntax_tree/expression/storage/pointer-expression-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class PointerExpressionAstTranspilerProcessor extends TranspilerProcessor<PointerExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PointerExpressionAst {
        return PointerExpressionAst;
    }

    /**
     * Transpiles a PGSL pointer expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: PointerExpressionAst): string {
        return `*${this.transpileAst(pInstance.data.expression)}`;
    }
}
