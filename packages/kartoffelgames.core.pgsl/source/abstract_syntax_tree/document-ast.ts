import { DocumentCst } from "../concrete_syntax_tree/general.type.ts";
import { AbstractSyntaxTreeContext, AbstractSyntaxTreeIncident } from "./abstract-syntax-tree-context.ts";
import { AbstractSyntaxTree } from './abstract-syntax-tree.ts';
import { DeclarationAst } from "./declaration/declaration-ast.ts";

export class DocumentAst extends AbstractSyntaxTree<DocumentCst, DocumentAstData> {
    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pCst: DocumentCst) {
        // The document AST creates its own context.
        super(pCst, new AbstractSyntaxTreeContext());
    }

    protected override process(pContext: AbstractSyntaxTreeContext): DocumentAstData {
        // Document is the only ast that create its own context object.
        pContext.setDocument(this);

        // Prepare data containers.
        const lDocumentData: DocumentAstData = {
            incidents: new Array<AbstractSyntaxTreeIncident>(),
            content: new Array<DeclarationAst>()
        };

        // Push global scope for document processing.
        return pContext.pushScope('global', () => {
            // Build documents build-ins first.
            for (const lBuildInCst of this.cst.buildInDeclarations) {
                // Try to build content node.
                const lBuildInContent = DeclarationAst.build(lBuildInCst, pContext);
                if (!lBuildInContent) {
                    pContext.pushIncident(`Invalid build-in structure in document. Expected declaration but found '${lBuildInCst.type}'.`, this);
                    continue;
                }

                // Build in content can be ignored as it has no affect on the document structure and only on the validation process.
                // lDocumentData.content.push(lBuildInContent);
            }

            // Build all other child structures.
            for (const lChildCst of this.cst.declarations) {
                // Try to build content node.
                const lBuildInContent = DeclarationAst.build(lChildCst, pContext);
                if (!lBuildInContent) {
                    pContext.pushIncident(`Invalid child structure in document. Expected declaration but found '${lChildCst.type}'.`, this);
                    continue;
                }

                lDocumentData.content.push(lBuildInContent);
            }

            return lDocumentData;
        }, this);
    }
}

type DocumentAstData = {
    // TODO: seperate alias, enum, function, struct, variable declarations.

    incidents: Array<AbstractSyntaxTreeIncident>;
    content: Array<DeclarationAst>;
};

