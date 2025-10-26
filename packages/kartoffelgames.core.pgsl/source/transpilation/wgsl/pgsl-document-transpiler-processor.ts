import { BasePgslSyntaxTree, PgslSyntaxTreeConstructor } from "../../syntax_tree/base-pgsl-syntax-tree.ts";
import { PgslEnumDeclaration } from "../../syntax_tree/declaration/pgsl-enum-declaration.ts";
import { PgslFunctionDeclaration } from "../../syntax_tree/declaration/pgsl-function-declaration.ts";
import { PgslStructDeclaration } from "../../syntax_tree/declaration/pgsl-struct-declaration.ts";
import { PgslVariableDeclaration } from "../../syntax_tree/declaration/pgsl-variable-declaration.ts";
import { PgslDocument } from '../../syntax_tree/pgsl-document.ts';
import type { PgslTrace } from '../../trace/pgsl-trace.ts';
import type { IPgslTranspilerProcessor, PgslTranspilerProcessorTranspile } from '../i-pgsl-transpiler-processor.interface.ts';

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
    public process(pInstance: PgslDocument, _pTrace: PgslTrace, pTranspile: PgslTranspilerProcessorTranspile): string {
        // List of transpileable child nodes.
        const lTranspileableChildren: Array<PgslSyntaxTreeConstructor> = [
            PgslFunctionDeclaration, PgslVariableDeclaration, PgslStructDeclaration
        ];
        const lIsTranspileable = (pChild: BasePgslSyntaxTree): boolean => {
            for (const lTranspileableChild of lTranspileableChildren) {
                if (pChild instanceof lTranspileableChild) {
                    return true;
                }
            }
            return false;
        };

        let lResult: string = '';

        // Transpile the document by processing all child nodes.
        for (const lChild of pInstance.childNodes) {
            // Ignore some declarations as their values gets inlined.
            if (!lIsTranspileable(lChild)) {
                continue;
            }

            lResult += pTranspile(lChild);
        }

        return lResult;
    }
}