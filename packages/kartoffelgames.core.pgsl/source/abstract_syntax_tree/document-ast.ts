import type { DocumentCst } from '../concrete_syntax_tree/general.type.ts';
import type { AbstractSyntaxTreeContext, AbstractSyntaxTreeIncident } from './abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from './abstract-syntax-tree.ts';
import { DeclarationAstBuilder } from './declaration/declaration-ast-builder.ts';
import type { IDeclarationAst } from './declaration/i-declaration-ast.interface.ts';

export class DocumentAst extends AbstractSyntaxTree<DocumentCst, DocumentAstData> {
    /**
     * Process document data.
     * 
     * @param pContext - The syntax tree context.
     * 
     * @returns Processed document data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext): DocumentAstData {
        // Document is the only ast that create its own context object.
        pContext.setDocument(this);

        // Prepare data containers.
        const lDocumentData = {
            incidents: new Array<AbstractSyntaxTreeIncident>(),
            content: new Array<IDeclarationAst>()
        };

        // Push global scope for document processing.
        return pContext.pushScope('global', () => {
            // Build documents build-ins first.
            for (const lBuildInCst of this.cst.buildInDeclarations) {
                // Try to build content node.
                // Build in content can be ignored as it has no affect on the document structure and only on the validation process.
                DeclarationAstBuilder.build(lBuildInCst, pContext);
            }

            // Build all other child structures.
            for (const lChildCst of this.cst.declarations) {
                // Try to build content node.
                lDocumentData.content.push(DeclarationAstBuilder.build(lChildCst, pContext));
            }

            // Collect all incidents from context.
            lDocumentData.incidents.push(...pContext.incidents);

            return lDocumentData satisfies DocumentAstData;
        }, this);
    }
}

type DocumentAstData = {
    incidents: ReadonlyArray<AbstractSyntaxTreeIncident>;
    content: ReadonlyArray<IDeclarationAst>;
};

