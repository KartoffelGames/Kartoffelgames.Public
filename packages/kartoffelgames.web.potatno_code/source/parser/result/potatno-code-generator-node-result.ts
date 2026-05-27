import { PotatnoDocumentFunction } from "../../document/potatno-document-function.ts";
import type { PotatnoDocumentNode } from '../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../document/potatno-document-port.ts';
import type { PotatnoProject } from '../../project/potatno-project.ts';

/**
 * Per-graph generation output produced by the code generator.
 * Modelled as a class so per-graph helper methods can be added here inthe future without forcing a refactor on callers.
 */
export class PotatnoCodeGeneratorNodeResult<TProject extends PotatnoProject> {
    private readonly mBodyCode: string;
    private readonly mDependencies: ReadonlyArray<PotatnoDocumentFunction<TProject>>;
    private readonly mEntryNode: PotatnoDocumentNode<TProject>;
    private readonly mExitNode: PotatnoDocumentNode<TProject>;
    private readonly mPorts: Map<PotatnoDocumentPort<TProject>, string>;

    /**
     * Generated body code for this subgraph, in execution order.
     */
    public get code(): string {
        return this.mBodyCode;
    }

    /**
     * Dependent functions required for this graph to be runnable.
     * Populated as function-call nodes were encountered during generation.
     */
    public get dependencies(): ReadonlyArray<PotatnoDocumentFunction<TProject>> {
        return this.mDependencies;
    }

    /**
     * The node where this subgraph's flow starts.
     */
    public get entryNode(): PotatnoDocumentNode<TProject> {
        return this.mEntryNode;
    }

    /**
     * The node that was used as anchor for generating this graph, typically the exit node of a function.
     * Stored on the graph so callers receiving an intermediate build know which intermediate exit was targeted.
     */
    public get exitNode(): PotatnoDocumentNode<TProject> {
        return this.mExitNode;
    }

    /**
     * Mapping from each port that participated in this grapths generation.
     * Mapping of port to its internal value id.
     */
    public get ports(): ReadonlyMap<PotatnoDocumentPort<TProject>, string> {
        return this.mPorts;
    }

    /**
     * Constructor.
     *
     * @param pParameter - Construction parameters.
     */
    public constructor(pParameter: PotatnoCodeGeneratorGraphConstructorParameter<TProject>) {
        this.mBodyCode = pParameter.bodyCode;
        this.mDependencies = [...pParameter.dependencies];
        this.mEntryNode = pParameter.entryNode;
        this.mExitNode = pParameter.exitNode;
        this.mPorts = pParameter.portValueIds;
    }
}

/**
 * Construction parameters for PotatnoCodeGeneratorGraph.
 */
export type PotatnoCodeGeneratorGraphConstructorParameter<TProject extends PotatnoProject> = {
    /**
     * The entry node of the subgraph.
     */
    entryNode: PotatnoDocumentNode<TProject>;

    /**
     * The originating node that triggered this graph generation.
     */
    exitNode: PotatnoDocumentNode<TProject>;

    /**
     * Generated body code for the subgraph in execution order.
     */
    bodyCode: string;

    /**
     * Dependent functions required for this graph to be runnable.
     */
    dependencies: ReadonlyArray<PotatnoDocumentFunction<TProject>>;

    /**
     * Mapping from each port emitted in this pass to its allocated valueId.
     */
    portValueIds: Map<PotatnoDocumentPort<TProject>, string>;
};

/**
 * Reference to a port plus the valueId or literal expression resolved for it during a generation pass.
 */
export type PotatnoCodeGeneratorNodeResultPort = {
    /**
     * The port definition id.
     */
    definitionId: string;

    /**
     * The valueId or literal expression resolved for this port in the
     * current generation pass.
     */
    valueId: string;
};