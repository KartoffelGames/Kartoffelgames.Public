import { VariableDeclarationStatementAst } from '../../../../abstract_syntax_tree/statement/execution/variable-declaration-statement-ast.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslVariableDeclarationStatementTranspilerProcessor implements IPgslTranspilerProcessor<VariableDeclarationStatementAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof VariableDeclarationStatementAst {
        return VariableDeclarationStatementAst;
    }

    /**
     * Transpiles a PGSL variable declaration statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: VariableDeclarationStatementAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        // TODO: When const declaration and const initial value, this can be a wgsl-const instead of a let. But only when not used as a pointer.

        // Depending on the expression presence, create the declaration with or without an initialization value.
        if(pInstance.data.expression){
            return `${pInstance.data.declarationType} ${pInstance.data.name}:${pTranspile(pInstance.data.typeDeclaration)}=${pTranspile(pInstance.data.expression)};`;
        } else {
            return `${pInstance.data.declarationType} ${pInstance.data.name}:${pTranspile(pInstance.data.typeDeclaration)};`;
        }
    }
}
