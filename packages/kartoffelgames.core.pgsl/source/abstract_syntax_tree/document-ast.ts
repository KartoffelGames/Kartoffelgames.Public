import type { DocumentCst } from '../concrete_syntax_tree/general.type.ts';
import type { PgslFeatureSet } from '../feature_set/pgsl-feature-set.ts';
import type { AbstractSyntaxTreeContext, AbstractSyntaxTreeSymbolUsageName } from './abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from './abstract-syntax-tree.ts';
import type { BaseDeclarationAst } from './declaration/base-declaration-ast.ts';
import { DeclarationAstBuilder } from './declaration/declaration-ast-builder.ts';

/**
 * Main PGSL document. Containing all Abstract Syntax Data.
 */
export class DocumentAst extends AbstractSyntaxTree<DocumentCst, DocumentAstData> {
    private readonly mFeatureSets: ReadonlyArray<PgslFeatureSet>;

    /**
     * Constructor.
     *
     * @param pConcreteSyntaxTree - Document cst.
     * @param pFeatureSets - Feature sets with build in declarations.
     */
    public constructor(pConcreteSyntaxTree: DocumentCst, pFeatureSets: ReadonlyArray<PgslFeatureSet>) {
        super(pConcreteSyntaxTree);

        this.mFeatureSets = pFeatureSets;
    }

    /**
     * Process document data.
     * 
     * @param pContext - The syntax tree context.
     * @param pCst - Cst data.
     * 
     * @returns Processed document data.
     */
    protected override onProcess(pContext: AbstractSyntaxTreeContext, pCst: DocumentCst): DocumentAstData {
        // Document is the only ast that create its own context object.
        pContext.setDocument(this);

        // Register the declarations of every feature set first outside any scope.
        pContext.pushScope('build-in', () => {
            for (const lFeatureSet of this.mFeatureSets) {
                for (const lDeclaration of lFeatureSet.declarations) {
                    lDeclaration.register(pContext);
                }
            }
        }, this);

        // Prepare data containers.
        const lDocumentData: DocumentAstData = {
            content: new Array<BaseDeclarationAst>(),
            symbolUsages: new Set<AbstractSyntaxTreeSymbolUsageName>(),
            metaValues: new Map<string, string>(pCst.metaValues)
        };

        // Push global scope for document processing.
        return pContext.pushScope('global', () => {
            // Process all declarations in order.
            for (const lDeclarationCst of pCst.declarations) {
                for (const lDeclarationItem of lDeclarationCst.declarations) {
                    // Try to build content node.
                    lDocumentData.content.push(DeclarationAstBuilder.build(lDeclarationItem).process(pContext).register(pContext));
                }
            }

            // Collect all used symbol usages from context.
            for (const lUsage of pContext.usages) {
                lDocumentData.symbolUsages.add(lUsage);
            }

            return lDocumentData satisfies DocumentAstData;
        }, this);
    }
}

export type DocumentAstData = {
    content: Array<BaseDeclarationAst>;
    symbolUsages: Set<AbstractSyntaxTreeSymbolUsageName>;
    metaValues: Map<string, string>;
};

