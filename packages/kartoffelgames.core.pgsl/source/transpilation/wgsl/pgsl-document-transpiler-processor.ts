import { PgslDocument } from "../../syntax_tree/pgsl-document.ts";
import { PgslTrace } from "../../trace/pgsl-trace.ts";
import { IPgslTranspilerProcessor, PgslTranspilerProcessorSendResult, PgslTranspilerProcessorTranspile } from "../i-pgsl-transpiler-processor.interface.ts";

export class PgslDocumentTranspilerProcessor implements IPgslTranspilerProcessor<PgslDocument> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof PgslDocument {
        return PgslDocument;
    }

    /**
     * Processes the PGSL document syntax tree.
     * 
     * @param pInstance - The syntax tree instance to transpile.
     * @param _pTrace - The syntax tree trace for context.
     * @param pSendResult - The function to call with transpilation results.
     */
    public process(pInstance: PgslDocument, _pTrace: PgslTrace, pSendResult: PgslTranspilerProcessorSendResult, pTranspile: PgslTranspilerProcessorTranspile): void {
        // Transpile the document by processing all child nodes.
        for (const lChild of pInstance.childNodes) {
            pSendResult(pTranspile(lChild));
        }
    }
}