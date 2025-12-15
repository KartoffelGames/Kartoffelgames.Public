import { UnaryExpressionAst } from '../../../../abstract_syntax_tree/expression/unary/unary-expression-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslUnaryExpressionTranspilerProcessor implements IPgslTranspilerProcessor<UnaryExpressionAst> {
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
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: UnaryExpressionAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Transpile expression.
        const lExpression: string = pTranspile(pInstance.data.expression);
        return `${pInstance.data.operator}${lExpression}`;
    }
}