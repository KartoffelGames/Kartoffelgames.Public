import { FunctionCallExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class FunctionCallExpressionAstTranspilerProcessor extends TranspilerProcessor<FunctionCallExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof FunctionCallExpressionAst {
        return FunctionCallExpressionAst;
    }

    /**
     * Transpiles a PGSL function call expression into WGSL code.
     *
     * @param pInstance - Processor syntax tree instance.
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: FunctionCallExpressionAst): string {
        // Transpile function call generics.
        let lGenerics: string = '';
        if(pInstance.data.generics.length > 0 && pInstance.data.functionDeclaration.data.explicitGenerics) {
            lGenerics = `<${pInstance.data.generics.map(pGeneric => this.transpileAst(pGeneric)).join(',')}>`;
        }

        return `${pInstance.data.name}${lGenerics}(${pInstance.data.parameters.map(pParam => this.transpileAst(pParam)).join(',')})`;
    }
}
