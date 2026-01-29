import { ArithmeticExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/arithmetic-expression-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class ArithmeticExpressionAstTranspilerProcessor implements ITranspilerProcessor<ArithmeticExpressionAst> {
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
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    process(pInstance: ArithmeticExpressionAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pTranspile(pInstance.data.leftExpression)}${pInstance.data.operator}${pTranspile(pInstance.data.rightExpression)}`;
    }
}
