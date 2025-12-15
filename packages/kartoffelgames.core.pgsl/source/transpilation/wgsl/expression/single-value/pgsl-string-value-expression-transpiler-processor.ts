import { StringValueExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/string-value-expression-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslStringValueExpressionTranspilerProcessor implements IPgslTranspilerProcessor<StringValueExpressionAst> {
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
    public process(pInstance: StringValueExpressionAst): string {
        return pInstance.data.value;
    }
}
