import { StructDeclarationAst } from '../../../abstract_syntax_tree/declaration/struct-declaration-ast.ts';
import type { StructPropertyDeclarationAst } from '../../../abstract_syntax_tree/declaration/struct-property-declaration-ast.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../i-pgsl-transpiler-processor.interface.ts';

export class PgslStructDeclarationTranspilerProcessor implements IPgslTranspilerProcessor<StructDeclarationAst> {
    /**
     * Returns the target type for this processor.
     */
    public get target(): typeof StructDeclarationAst {
        return StructDeclarationAst;
    }

    /**
     * Transpile current struct declaration into a string.
     * 
     * @param pInstance - Instance to process.
     * @param _pTrace - Trace information.
     * @param pSendResult - Function to send the result.
     * @param pTranspile - Function to transpile child nodes.
     */
    public process(pInstance: StructDeclarationAst, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Transpile properties.
        const lProperties: string = pInstance.properties.map((pProperty: StructPropertyDeclarationAst) => pTranspile(pProperty)).join(',');

        return `struct ${pInstance.name}{${lProperties}}`;
    }
}