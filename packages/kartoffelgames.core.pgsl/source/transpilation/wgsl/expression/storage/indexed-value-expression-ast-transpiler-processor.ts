import { IndexedValueExpressionAst } from '../../../../abstract_syntax_tree/expression/storage/indexed-value-expression-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class IndexedValueExpressionAstTranspilerProcessor extends TranspilerProcessor<IndexedValueExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof IndexedValueExpressionAst {
        return IndexedValueExpressionAst;
    }

    /**
     * Transpiles a PGSL indexed value expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: IndexedValueExpressionAst): string {
        return `${this.transpileAst(pInstance.data.value)}[${this.transpileAst(pInstance.data.index)}]`;
    }
}
