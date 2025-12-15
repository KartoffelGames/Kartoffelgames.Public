import { PointerExpressionAst } from '../../../../abstract_syntax_tree/expression/storage/pointer-expression-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslPointerExpressionTranspilerProcessor implements IPgslTranspilerProcessor<PointerExpressionAst> {
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
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PointerExpressionAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `*${pTranspile(pInstance.data.expression)}`;
    }
}
