import { EnumDeclarationAst } from "../../../../abstract_syntax_tree/declaration/enum-declaration-ast.ts";
import { ValueDecompositionExpressionAst } from '../../../../abstract_syntax_tree/expression/storage/value-decomposition-expression-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class ValueDecompositionExpressionAstTranspilerProcessor extends TranspilerProcessor<ValueDecompositionExpressionAst> {
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
     *
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: ValueDecompositionExpressionAst): string {
        // When the value is a enum, transpille its resolved value as constant.
        if (pInstance.data.expressionDeclaration instanceof EnumDeclarationAst) {
            if(!pInstance.data.propertyValue){
                return '<--ERROR-->'
            }
            return this.transpileAst(pInstance.data.propertyValue);
        }

        // Transpile value and property.
        return `${this.transpileAst(pInstance.data.expressionValue)}.${pInstance.data.property}`;
    }
}
