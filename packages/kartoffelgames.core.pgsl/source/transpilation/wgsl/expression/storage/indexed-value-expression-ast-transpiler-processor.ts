import { IndexedValueExpressionAst } from '../../../../abstract_syntax_tree/expression/storage/indexed-value-expression-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class IndexedValueExpressionAstTranspilerProcessor implements ITranspilerProcessor<IndexedValueExpressionAst> {
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
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: IndexedValueExpressionAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pTranspile(pInstance.data.value)}[${pTranspile(pInstance.data.index)}]`;
    }
}
