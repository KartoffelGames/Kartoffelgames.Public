import { AddressOfExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/address-of-expression-ast.ts';
import { TranspilerProcessor } from '../../../transpiler-processor.ts';

export class AddressOfExpressionAstTranspilerProcessor extends TranspilerProcessor<AddressOfExpressionAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof AddressOfExpressionAst {
        return AddressOfExpressionAst;
    }

    /**
     * Transpiles a PGSL address-of expression into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * 
     * @returns Transpiled WGSL code.
     */
    protected override onProcess(pInstance: AddressOfExpressionAst): string {
        return `&${this.transpileAst(pInstance.data.variable)}`;
    }
}
