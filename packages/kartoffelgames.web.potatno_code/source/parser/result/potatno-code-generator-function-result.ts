import { Exception } from "@kartoffelgames/core";
import type { PotatnoDocumentFunction } from '../../document/potatno-document-function.ts';
import { PotatnoFunctionDefinition } from "../../project/potatno-function-definition.ts";
import type { PotatnoProject } from '../../project/potatno-project.ts';
import type { PotatnoCodeGeneratorNodeResult } from './potatno-code-generator-node-result.ts';

/**
 * Function code generation results.
 *
 * Owns the list of Graphs produced by a generation pass and exposes a uniform retrieval surface (graphResultOf, imports).
 * The class is declared abstract to block direct instantiation. Callers always receive one of the concrete subclasses.
 */
export abstract class PotatnoCodeGeneratorFunctionResult<TProject extends PotatnoProject> {
    private readonly mFunction: PotatnoDocumentFunction<TProject>;
    private readonly mGraphs: Map<string, PotatnoCodeGeneratorNodeResult<TProject>>;

    /**
     * Calls the underlying function definitions code generator to convert the function graphs into a single string.
     */
    public get code(): string {
        // Get the functions definition.
        const lFunctionDefinition: PotatnoFunctionDefinition<TProject> | undefined = this.mFunction.project.getFunction(this.mFunction.definitionId);
        if(!lFunctionDefinition) {
            throw new Exception('Function result has an invalid function definition id.', this);
        }
        
        // Call the functions body code generator.
        return lFunctionDefinition.codeGenerator.body(this);
    }

    /**
     * The document function the contained graphs belong to.
     */
    public get function(): PotatnoDocumentFunction<TProject> {
        return this.mFunction;
    }

    /**
     * Read-only view of the contained graphs.
     */
    public get graphs(): ReadonlyArray<PotatnoCodeGeneratorNodeResult<TProject>> {
        return Array.from(this.mGraphs.values());
    }

    /**
     * Constructor.
     *
     * @param pFunctionName - Display name of the owning function.
     * @param pFunction - The document function the graphs will belong to.
     */
    protected constructor(pFunction: PotatnoDocumentFunction<TProject>) {
        this.mFunction = pFunction;
        this.mGraphs = new Map<string, PotatnoCodeGeneratorNodeResult<TProject>>();
    }

    /**
     * Append a graph to this result.
     *
     * @param pNodeResult - The graph to add.
     */
    public addGraph(pNodeResult: PotatnoCodeGeneratorNodeResult<TProject>): void {
        this.mGraphs.set(pNodeResult.entryNode.definitionId, pNodeResult);
    }

    /**
     * Look up a graph by the definition id of its entry node.
     *
     * @param pEntryDefinitionId - Entry node definition id to match.
     *
     * @returns The matching graph, or undefined.
     */
    public graphResultOf(pEntryDefinitionId: string): PotatnoCodeGeneratorNodeResult<TProject> | undefined {
        return this.mGraphs.get(pEntryDefinitionId);
    }
}
