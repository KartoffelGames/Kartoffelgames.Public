import { LiteralValueExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class LiteralValueExpressionAstTranspilerProcessor extends TranspilerProcessor<LiteralValueExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof LiteralValueExpressionAst {
        return LiteralValueExpressionAst;
    }

    /**
     * Transpiles a PGSL literal value expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * 
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: LiteralValueExpressionAst): string {
        // Basically does nothing to the value.
        return pInstance.data.textValue;
    }
}
