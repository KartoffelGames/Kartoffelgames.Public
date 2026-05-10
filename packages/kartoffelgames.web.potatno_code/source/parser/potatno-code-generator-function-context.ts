import { PotatnoDocumentFunction } from "../document/potatno-document-function.ts";
import { PotatnoDocumentNode } from "../document/potatno-document-node.ts";
import { PotatnoProject } from "../project/potatno-project.ts";

/**
 * The object passed to functionCodeGenerator callbacks.
 * Represents a complete function with its per-exit-node results.
 */
export class PotatnoCodeGeneratorFunctionContext<TProject extends PotatnoProject> {
    private readonly mFunction: PotatnoDocumentFunction<TProject>;
    private readonly mFunctionName: string;

    /**
     * The name of the function, as defined in the document function.
     */
    public get functionName(): string {
        return this.mFunctionName;
    }

    /**
     * The imports required by the function, as defined in the document function.
     */
    public get imports(): ReadonlyArray<string> {
        return this.mFunction.imports;
    }

    /**
     * Per-exit-node generation results. One entry per exit node found in the function graph.
     * Each entry captures the body code, entry/exit node references, and their port value IDs.
     */
    public readonly nodes: Array<PotatnoCodeGeneratorFunctionContextNodeResult<TProject>>;

    /**
     * Create a new function context instance.
     *
     * @param pFunctionName - Display name of the function.
     * @param pFunction - The document function this context represents.
     */
    public constructor(pFunctionName: string, pFunction: PotatnoDocumentFunction<TProject>) {
        this.mFunction = pFunction;
        this.mFunctionName = pFunctionName;
        this.nodes = new Array<PotatnoCodeGeneratorFunctionContextNodeResult<TProject>>();
    }
}

/**
 * Result for a single exit node within a function graph generation pass.
 * Captures which entry node feeds this exit, and the value IDs of entry outputs / exit inputs.
 */
export type PotatnoCodeGeneratorFunctionContextNodeResult<TProject extends PotatnoProject> = {
    /**
     * Generated body code for this entry–exit node pair.
     */
    readonly bodyCode: string;

    /**
     * The entry node that dominates this exit node, or null when no entry node is present.
     */
    readonly entryNode: PotatnoDocumentNode<TProject> | null;

    /**
     * Value output ports of the entry node with their assigned value IDs.
     * These represent the function parameters flowing into the graph.
     */
    readonly entryPorts: ReadonlyArray<{ name: string; type: string; valueId: string }>;

    /**
     * The exit node for this result.
     */
    readonly exitNode: PotatnoDocumentNode<TProject>;

    /**
     * Value input ports of the exit node with their resolved value IDs.
     * These represent the values flowing out of the graph (return values).
     */
    readonly exitPorts: ReadonlyArray<{ name: string; type: string; valueId: string }>;
};
