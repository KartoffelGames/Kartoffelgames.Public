import { LiteralValueExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/literal-value-expression-ast.ts';
import type { ITranspilerProcessor } from '../../../i-transpiler-processor.interface.ts';

export class LiteralValueExpressionAstTranspilerProcessor implements ITranspilerProcessor<LiteralValueExpressionAst> {
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
    public process(pInstance: LiteralValueExpressionAst): string {
        // Basically does nothing to the value.
        return pInstance.data.textValue;
    }
}
