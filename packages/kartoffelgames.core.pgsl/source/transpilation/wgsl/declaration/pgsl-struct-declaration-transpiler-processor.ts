import { PgslStructDeclaration } from "../../../syntax_tree/declaration/pgsl-struct-declaration.ts";
import { PgslStructPropertyDeclaration } from "../../../syntax_tree/declaration/pgsl-struct-property-declaration.ts";
import { PgslTrace } from "../../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorSendResult, PgslTranspilerProcessorTranspile } from "../../i-pgsl-transpiler-processor.interface.ts";

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
    public process(pInstance: PgslStructDeclaration, _pTrace: PgslTrace, pSendResult: PgslTranspilerProcessorSendResult, pTranspile: PgslTranspilerProcessorTranspile): void {
        // Transpile properties.
        const lProperties: string = pInstance.properties.map((pProperty: PgslStructPropertyDeclaration) => pTranspile(pProperty)).join(',\n');

        pSendResult(`struct ${pInstance.name} {\n${lProperties}\n}\n`);
    }
}