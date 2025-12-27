import { AbstractSyntaxTree, AbstractSyntaxTreeConstructor } from "../../abstract_syntax_tree/abstract-syntax-tree.ts";
import { FunctionDeclarationAst } from "../../abstract_syntax_tree/declaration/function-declaration-ast.ts";
import { StructDeclarationAst } from "../../abstract_syntax_tree/declaration/struct-declaration-ast.ts";
import { VariableDeclarationAst } from "../../abstract_syntax_tree/declaration/variable-declaration-ast.ts";
import { DocumentAst } from '../../abstract_syntax_tree/document-ast.ts';
import type { ITranspilerProcessor, PgslTranspilerProcessorTranspile } from '../i-transpiler-processor.interface.ts';

export class DocumentAstTranspilerProcessor implements ITranspilerProcessor<DocumentAst> {
    /**
     * The target syntax tree constructor that this processor handles.
     */
    public get target(): typeof DocumentAst {
        return DocumentAst;
    }

    /**
     * Processes the PGSL document syntax tree.
     * 
     * @param pInstance - The syntax tree instance to transpile.
     * @param _pTrace - The syntax tree trace for context.
     * @param pSendResult - The function to call with transpilation results.
     */
    public process(pInstance: DocumentAst, pTranspile: PgslTranspilerProcessorTranspile): string {
        // List of transpileable child nodes.
        const lTranspileableChildren: Array<AbstractSyntaxTreeConstructor> = [
            FunctionDeclarationAst, VariableDeclarationAst, StructDeclarationAst
        ];
        const lIsTranspileable = (pChild: AbstractSyntaxTree): boolean => {
            for (const lTranspileableChild of lTranspileableChildren) {
                if (pChild instanceof lTranspileableChild) {
                    return true;
                }
            }
            return false;
        };

        let lResult: string = '';

        // Transpile the document by processing all child nodes.
        for (const lChild of pInstance.data.content) {
            // Ignore some declarations as their values gets inlined.
            if (!lIsTranspileable(lChild)) {
                continue;
            }

            lResult += pTranspile(lChild);
        }

        return lResult;
    }
}