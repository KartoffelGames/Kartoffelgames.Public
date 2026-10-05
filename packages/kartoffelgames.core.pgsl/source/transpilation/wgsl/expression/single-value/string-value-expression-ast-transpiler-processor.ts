import { StringValueExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/string-value-expression-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class StringValueExpressionAstTranspilerProcessor extends TranspilerProcessor<StringValueExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof StringValueExpressionAst {
        return StringValueExpressionAst;
    }

    /**
     * Transpiles a PGSL string value expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * 
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: StringValueExpressionAst): string {
        return pInstance.data.value;
    }
}
