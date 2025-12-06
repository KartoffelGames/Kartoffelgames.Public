import { PgslVariableDeclarationStatement } from '../../../../abstract_syntax_tree/statement/execution/pgsl-variable-declaration-statement.ts';
import type { PgslTrace } from '../../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../../i-pgsl-transpiler-processor.interface.ts';

export class PgslVariableDeclarationStatementTranspilerProcessor implements IPgslTranspilerProcessor<PgslVariableDeclarationStatement> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslVariableDeclarationStatement {
        return PgslVariableDeclarationStatement;
    }

    /**
     * Transpiles a PGSL variable declaration statement into WGSL code.
     * 
     * @param pInstance - Processor syntax tree instance.
     * @param _pTrace - Transpilation trace.
     * @param pTranspile - Transpile function.
     * 
     * @returns Transpiled WGSL code.
     */
    public process(pInstance: PgslVariableDeclarationStatement, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        // TODO: When const declaration and const initial value, this can be a wgsl-const instead of a let. But only when not used as a pointer.

        // Depending on the expression presence, create the declaration with or without an initialization value.
        if(pInstance.expression){
            return `${pInstance.declarationType} ${pInstance.name}: ${pTranspile(pInstance.type)} = ${pTranspile(pInstance.expression)};`;
        } else {
            return `${pInstance.declarationType} ${pInstance.name}: ${pTranspile(pInstance.type)};`;
        }
    }
}
