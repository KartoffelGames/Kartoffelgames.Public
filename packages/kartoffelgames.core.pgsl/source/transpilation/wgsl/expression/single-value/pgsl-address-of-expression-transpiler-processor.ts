import { AddressOfExpressionAst } from '../../../../abstract_syntax_tree/expression/single_value/address-of-expression-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslAddressOfExpressionTranspilerProcessor implements IPgslTranspilerProcessor<AddressOfExpressionAst> {
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
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: AddressOfExpressionAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        return `&${pTranspile(pInstance.data.variable)}`;
    }
}
