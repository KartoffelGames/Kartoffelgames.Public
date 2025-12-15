import { ComparisonExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/comparison-expression-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslComparisonExpressionTranspilerProcessor implements IPgslTranspilerProcessor<ComparisonExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ComparisonExpressionAst {
        return ComparisonExpressionAst;
    }

    /**
     * Transpiles a PGSL comparison expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: ComparisonExpressionAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `${pTranspile(pInstance.data.leftExpression)} ${pInstance.data.operatorName} ${pTranspile(pInstance.data.rightExpression)}`;
    }
}
