import type { DocumentCst } from '../concrete_syntax_tree/general.type.ts';
import type { AbstractSyntaxTreeContext, AbstractSyntaxTreeIncident, AbstractSyntaxTreeSymbolUsageName } from './abstract-syntax-tree-context.ts';
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
            content: new Array<IDeclarationAst>(),
            symbolUsages: new Set<AbstractSyntaxTreeSymbolUsageName>()
        };

        // Build documents build-ins first outside any scope.
        pContext.pushScope('build-in', () => {
            for (const lBuildInCst of this.cst.buildInDeclarations) {
                // Try to build content node.
                // Build in content can be ignored as it has no affect on the document structure and only on the validation process.
                // Processing is deferred to later stages, when the function is requested by name.
                DeclarationAstBuilder.build(lBuildInCst).register(pContext);
            }
        }, this);

        // Push global scope for document processing.
        return pContext.pushScope('global', () => {
            // Import all imported documents first.
            for (const lImport of this.cst.imports) {
                for (const lImportDeclaration of lImport.declarations) {
                    lDocumentData.content.push(DeclarationAstBuilder.build(lImportDeclaration).register(pContext).process(pContext));
                }
            }

            // Build all other child structures.
            for (const lChildCst of this.cst.declarations) {
                // Try to build content node.
                lDocumentData.content.push(DeclarationAstBuilder.build(lChildCst).register(pContext).process(pContext));
            }

            // Collect all incidents from context.
            lDocumentData.incidents.push(...pContext.incidents);

            // Collect all used symbol usages from context.
            for (const lUsage of pContext.usages) {
                lDocumentData.symbolUsages.add(lUsage);
            }

            return lDocumentData satisfies DocumentAstData;
        }, this);
    }
}

type DocumentAstData = {
    incidents: ReadonlyArray<AbstractSyntaxTreeIncident>;
    content: ReadonlyArray<IDeclarationAst>;
    symbolUsages: Set<AbstractSyntaxTreeSymbolUsageName>;
};

