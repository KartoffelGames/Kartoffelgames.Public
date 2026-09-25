import { ValueDecompositionExpressionAst } from '../../../../abstract_syntax_tree/expression/storage/value-decomposition-expression-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class ValueDecompositionExpressionAstTranspilerProcessor implements ITranspilerProcessor<ValueDecompositionExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof ValueDecompositionExpressionAst {
        return ValueDecompositionExpressionAst;
    }

    /**
     * Transpiles a PGSL value decomposition expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: ValueDecompositionExpressionAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        // When the value is a enum, transpille its resolved value as constant.
        if (pInstance.data.enumValue) {
            return pTranspile(pInstance.data.enumValue);
        }

        // Transpile value and property.
        return `${pTranspile(pInstance.data.value)}.${pInstance.data.property}`;
    }
}
