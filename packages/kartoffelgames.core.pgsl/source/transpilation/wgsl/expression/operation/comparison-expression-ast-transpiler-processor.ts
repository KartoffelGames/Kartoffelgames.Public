import { ComparisonExpressionAst } from '../../../../abstract_syntax_tree/expression/operation/comparison-expression-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class ComparisonExpressionAstTranspilerProcessor extends TranspilerProcessor<ComparisonExpressionAst> {
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
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: ComparisonExpressionAst): string {
        return `${this.transpileAst(pInstance.data.leftExpression)}${pInstance.data.operatorName}${this.transpileAst(pInstance.data.rightExpression)}`;
    }
}
