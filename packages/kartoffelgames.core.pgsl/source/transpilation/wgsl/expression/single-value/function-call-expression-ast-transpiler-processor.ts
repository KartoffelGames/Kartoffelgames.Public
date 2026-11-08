import { FunctionCallExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/function-call-expression-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';
import { WgslTranspiler } from '../../wgsl-transpiler.ts';

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
        if (pInstance.data.generics.explicit.length > 0 && pInstance.data.declaration?.data.explicitGenerics) {
            lGenerics = `<${pInstance.data.generics.explicit.map(pGeneric => this.transpileAst(pGeneric)).join(',')}>`;
        }

        // Escape names that use wgsl reserved words and transpile parameters.
        const lEscapedFunctionName: string = WgslTranspiler.escapeName(pInstance.data.name);
        const lParameters: Array<string> = pInstance.data.parameters.values.map(pParam => {
            return this.transpileAst(pParam);
        });

        return `${lEscapedFunctionName}${lGenerics}(${lParameters.join(',')})`;
    }
}
