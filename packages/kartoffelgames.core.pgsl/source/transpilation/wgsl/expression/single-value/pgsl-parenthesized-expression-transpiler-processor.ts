import { ParenthesizedExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/parenthesized-expression-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class PgslParenthesizedExpressionTranspilerProcessor implements ITranspilerProcessor<ParenthesizedExpressionAst> {
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
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: ParenthesizedExpressionAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `(${pTranspile(pInstance.data.expression)})`;
    }
}
