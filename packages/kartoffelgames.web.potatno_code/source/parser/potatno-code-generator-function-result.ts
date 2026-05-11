import { PotatnoDocumentFunction } from "../document/potatno-document-function.ts";
import { PotatnoProject } from "../project/potatno-project.ts";
import { PotatnoCodeGeneratorGraphResult } from "./potatno-code-generator-graph-result.ts";

/**
 * Code generation result for the generation of a single function, or its subgraph.
 */
export class PotatnoCodeGeneratorFunctionResult<TProject extends PotatnoProject> {
    private readonly mFunction: PotatnoDocumentFunction<TProject>;
    private readonly mFunctionName: string;
    private readonly mNodeResults: Array<PotatnoCodeGeneratorGraphResult<TProject>>;

    /**
     * The name of the function, as defined in the document function.
     */
    public get functionName(): string {
        return this.mFunctionName;
    }

    /**
     * The document function this result represents.
     */
    public get function(): PotatnoDocumentFunction<TProject> {
        return this.mFunction;
    }

    /**
     * The imports required by the function, as defined in the document function.
     */
    public get imports(): ReadonlyArray<string> {
        return this.mFunction.imports;
    }

    /**
     * Per-exit-node generation results. One entry per exit node found in the function graph.
     * Each entry captures the graph code, entry/exit node references, and their port value IDs.
     */
    public get nodes(): ReadonlyArray<PotatnoCodeGeneratorGraphResult<TProject>> {
        return this.mNodeResults;
    }

    /**
     * Create a new function context instance.
     *
     * @param pFunctionName - Display name of the function.
     * @param pFunction - The document function this context represents.
     */
    public constructor(pFunctionName: string, pFunction: PotatnoDocumentFunction<TProject>) {
        this.mFunction = pFunction;
        this.mFunctionName = pFunctionName;
        this.mNodeResults = new Array<PotatnoCodeGeneratorGraphResult<TProject>>();
    }

    /**
     * Add a single node graph result to the function context.
     * 
     * @param pResult - The result of the node graph to add.
     */
    public addNodeResult(pResult: PotatnoCodeGeneratorGraphResult<TProject>): void {
        this.mNodeResults.push(pResult);
    }
}