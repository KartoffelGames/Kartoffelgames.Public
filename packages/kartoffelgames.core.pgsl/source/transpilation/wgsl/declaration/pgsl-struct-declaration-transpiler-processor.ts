import { PgslStructDeclaration } from '../../../syntax_tree/declaration/pgsl-struct-declaration.ts';
import type { PgslStructPropertyDeclaration } from '../../../syntax_tree/declaration/pgsl-struct-property-declaration.ts';
import type { PgslTrace } from '../../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../../i-pgsl-transpiler-processor.interface.ts';

export class PgslStructDeclarationTranspilerProcessor implements IPgslTranspilerProcessor<PgslStructDeclaration> {
    /**
     * Returns the target type for this processor.
     */
    public get target(): typeof PgslStructDeclaration {
        return PgslStructDeclaration;
    }

    /**
     * Transpile current struct declaration into a string.
     * 
     * @param pInstance - Instance to process.
     * @param _pTrace - Trace information.
     * @param pSendResult - Function to send the result.
     * @param pTranspile - Function to transpile child nodes.
     */
    public process(pInstance: PgslStructDeclaration, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        // Transpile properties.
        const lProperties: string = pInstance.properties.map((pProperty: PgslStructPropertyDeclaration) => pTranspile(pProperty)).join(',\n');

        return `struct ${pInstance.name} {\n${lProperties}\n}\n`;
    }
}