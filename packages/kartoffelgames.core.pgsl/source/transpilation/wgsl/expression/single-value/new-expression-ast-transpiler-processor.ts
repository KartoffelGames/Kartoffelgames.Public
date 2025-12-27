import { NewExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/new-expression-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-transpiler-processor.interface.ts';

export class NewCallExpressionAstTranspilerProcessor implements ITranspilerProcessor<NewExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof NewExpressionAst {
        return NewExpressionAst;
    }

    /**
     * Transpiles a PGSL new call expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: NewExpressionAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        const lTypeNameConversion: string = pTranspile(pInstance.data.resolveType);
        // Simply transpile the type and parameters without the new part.
        return `${lTypeNameConversion}(${pInstance.data.parameterList.map(pParam => pTranspile(pParam)).join(',')})`;
    }
}
