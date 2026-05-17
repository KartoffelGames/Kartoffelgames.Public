import type { PotatnoDocumentNode } from '../document/potatno-document-node.ts';
import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoCodeGeneratorFunctionResult } from './potatno-code-generator-function-result.ts';

/**
 * Per-graph generation output produced by the code generator.
 * Modelled as a class so per-graph helper methods can be added here inthe future without forcing a refactor on callers.
 */
export class PotatnoCodeGeneratorGraph<TProject extends PotatnoProject> {
    private readonly mBodyCode: string;
    private readonly mDependencies: ReadonlyArray<PotatnoCodeGeneratorFunctionResult<TProject>>;
    private readonly mEntryNode: PotatnoDocumentNode<TProject>;
    private readonly mInputPorts: ReadonlyArray<PotatnoCodeGeneratorGraphPort>;
    private readonly mOutputPorts: ReadonlyArray<PotatnoCodeGeneratorGraphPort>;
    private readonly mGeneratedNode: PotatnoDocumentNode<TProject>;
    private readonly mImports: ReadonlyArray<string>;

    /**
     * Generated body code for this subgraph, in execution order.
     */
    public get code(): string {
        return this.mBodyCode;
    }

    /**
     * Dependent function results required for this graph to be runnable.
     * Populated as function-call nodes were encountered during generation.
     */
    public get dependencies(): ReadonlyArray<PotatnoCodeGeneratorFunctionResult<TProject>> {
        return this.mDependencies;
    }

    /**
     * The node where this subgraph's flow starts.
     */
    public get entryNode(): PotatnoDocumentNode<TProject> {
        return this.mEntryNode;
    }

    /**
     * Value output ports of the entry node, paired with the valueIds allocated for them in this generation pass.
     * Used by function-body wrappers when constructing the parameter list of the generated function.
     */
    public get inputPorts(): ReadonlyArray<PotatnoCodeGeneratorGraphPort> {
        return this.mInputPorts;
    }

    /**
     * Value input ports on the originating (generated) node, paired with the resolved valueIds feeding them.
     * Used by function-body wrappers when constructing the return statement of the generated function.
     */
    public get outputPorts(): ReadonlyArray<PotatnoCodeGeneratorGraphPort> {
        return this.mOutputPorts;
    }

    /**
     * The node that was used as anchor for generating this graph, typically the exit node of a function.
     * Stored on the graph so callers receiving an intermediate build know which intermediate exit was targeted.
     */
    public get generatedNode(): PotatnoDocumentNode<TProject> {
        return this.mGeneratedNode;
    }

    /**
     * Import strings declared by the owning function. 
     * Aggregated by the surrounding Result class with first-occurrence deduplication.
     */
    public get imports(): ReadonlyArray<string> {
        return this.mImports;
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
        this.mInputPorts = [...pParameter.inputPorts];
        this.mOutputPorts = [...pParameter.outputPorts];
        this.mGeneratedNode = pParameter.generatedNode;
        this.mImports = [...pParameter.imports];
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
    generatedNode: PotatnoDocumentNode<TProject>;

    /**
     * Generated body code for the subgraph in execution order.
     */
    bodyCode: string;

    /**
     * Value output ports on the entry node with their allocated valueIds.
     */
    inputPorts: ReadonlyArray<PotatnoCodeGeneratorGraphPort>;

    /**
     * Value input ports on the originating node with their resolved valueIds.
     */
    outputPorts: ReadonlyArray<PotatnoCodeGeneratorGraphPort>;

    /**
     * Import strings declared by the owning function.
     */
    imports: ReadonlyArray<string>;

    /**
     * Dependent function results required for this graph to be runnable.
     */
    dependencies: ReadonlyArray<PotatnoCodeGeneratorFunctionResult<TProject>>;
};

/**
 * Reference to a port plus the valueId or literal expression resolved for it during a generation pass.
 */
export type PotatnoCodeGeneratorGraphPort = {
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