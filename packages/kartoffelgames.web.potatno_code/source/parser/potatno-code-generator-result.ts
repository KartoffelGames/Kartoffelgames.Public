import type { PotatnoDocumentFunction } from '../document/potatno-document-function.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoCodeGeneratorGraph } from './potatno-code-generator-graph.ts';

/**
 * Abstract base for code generation results.
 *
 * Owns the list of Graphs produced by a generation pass and exposes a uniform retrieval surface (graphResultOf, imports).
 * The class is declared abstract to block direct instantiation. Callers always receive one of the concrete subclasses.
 */
export abstract class PotatnoCodeGeneratorResult<TProject extends PotatnoProject> {
    private readonly mFunction: PotatnoDocumentFunction<TProject>;
    private readonly mGraphs: Map<string, PotatnoCodeGeneratorGraph<TProject>>;

    /**
     * The document function the contained graphs belong to.
     */
    public get function(): PotatnoDocumentFunction<TProject> {
        return this.mFunction;
    }

    /**
     * Read-only view of the contained graphs.
     */
    public get graphs(): ReadonlyArray<PotatnoCodeGeneratorGraph<TProject>> {
        return Array.from(this.mGraphs.values());
    }

    /**
     * Imports aggregated across every contained graph.
     * Order is preserved by first occurrence; duplicates are removed.
     */
    public get imports(): ReadonlyArray<string> {
        // Flatten graphs' imports preserving order; dedupe via a Set.
        const lImports: Array<string> = new Array<string>();
        const lSeen: Set<string> = new Set<string>();

        // Concat each import from each graph, skipping duplicates.
        for (const lGraph of this.mGraphs.values()) {
            // Iterate over the graph's imports in order.
            for (const lImport of lGraph.imports) {
                if (!lSeen.has(lImport)) {
                    lSeen.add(lImport);
                    lImports.push(lImport);
                }
            }
        }

        return lImports;
    }

    /**
     * Constructor.
     *
     * @param pFunctionName - Display name of the owning function.
     * @param pFunction - The document function the graphs will belong to.
     */
    protected constructor(pFunction: PotatnoDocumentFunction<TProject>) {
        this.mFunction = pFunction;
        this.mGraphs = new Map<string, PotatnoCodeGeneratorGraph<TProject>>();
    }

    /**
     * Append a graph to this result.
     *
     * @param pGraph - The graph to add.
     */
    public addGraph(pGraph: PotatnoCodeGeneratorGraph<TProject>): void {
        this.mGraphs.set(pGraph.entryNode.definitionId, pGraph);
    }

    /**
     * Look up a graph by the definition id of its entry node.
     *
     * @param pEntryDefinitionId - Entry node definition id to match.
     *
     * @returns The matching graph, or undefined.
     */
    public graphResultOf(pEntryDefinitionId: string): PotatnoCodeGeneratorGraph<TProject> | undefined {
        return this.mGraphs.get(pEntryDefinitionId);
    }
}
