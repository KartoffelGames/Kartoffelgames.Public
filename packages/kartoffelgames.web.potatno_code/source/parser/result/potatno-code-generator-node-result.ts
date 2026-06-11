import { PotatnoDocumentFunction } from "../../document/potatno-document-function.ts";
import type { PotatnoDocumentNode } from '../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../document/potatno-document-port.ts';
import { PotatnoProjectTypesDefinition } from "../../project/potatno-project-types-definition.ts";
import type { PotatnoProject } from '../../project/potatno-project.ts';

/**
 * Per-graph generation output produced by the code generator.
 * Modelled as a class so per-graph helper methods can be added here inthe future without forcing a refactor on callers.
 */
export class PotatnoCodeGeneratorNodeResult<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private readonly mBodyCode: string;
    private readonly mDependencies: ReadonlyArray<PotatnoDocumentFunction<TProjectTypes>>;
    private readonly mEntryNode: PotatnoDocumentNode<TProjectTypes>;
    private readonly mExitNode: PotatnoDocumentNode<TProjectTypes>;
    private readonly mPorts: Map<PotatnoDocumentPort<TProjectTypes>, string>;

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
    public get dependencies(): ReadonlyArray<PotatnoDocumentFunction<TProjectTypes>> {
        return this.mDependencies;
    }

    /**
     * The node where this subgraph's flow starts.
     */
    public get entryNode(): PotatnoDocumentNode<TProjectTypes> {
        return this.mEntryNode;
    }

    /**
     * The node that was used as anchor for generating this graph, typically the exit node of a function.
     * Stored on the graph so callers receiving an intermediate build know which intermediate exit was targeted.
     */
    public get exitNode(): PotatnoDocumentNode<TProjectTypes> {
        return this.mExitNode;
    }

    /**
     * Mapping from each port that participated in this grapths generation.
     * Mapping of port to its internal value id.
     */
    public get ports(): ReadonlyMap<PotatnoDocumentPort<TProjectTypes>, string> {
        return this.mPorts;
    }

    /**
     * Constructor.
     *
     * @param pParameter - Construction parameters.
     */
    public constructor(pParameter: PotatnoCodeGeneratorGraphConstructorParameter<TProjectTypes>) {
        this.mBodyCode = pParameter.bodyCode;
        this.mDependencies = [...pParameter.dependencies];
        this.mEntryNode = pParameter.entryNode;
        this.mExitNode = pParameter.exitNode;
        this.mPorts = pParameter.portValues;
    }
}

/**
 * Construction parameters for PotatnoCodeGeneratorGraph.
 */
export type PotatnoCodeGeneratorGraphConstructorParameter<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    /**
     * The entry node of the subgraph.
     */
    entryNode: PotatnoDocumentNode<TProjectTypes>;

    /**
     * The originating node that triggered this graph generation.
     */
    exitNode: PotatnoDocumentNode<TProjectTypes>;

    /**
     * Generated body code for the subgraph in execution order.
     */
    bodyCode: string;

    /**
     * Dependent functions required for this graph to be runnable.
     */
    dependencies: ReadonlyArray<PotatnoDocumentFunction<TProjectTypes>>;

    /**
     * Mapping from each port emitted in this pass to its allocated valueId.
     */
    portValues: Map<PotatnoDocumentPort<TProjectTypes>, string>;
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
    value: string;
};