import { PotatnoDocumentFunction } from "../document/potatno-document-function.ts";
import { PotatnoCodeGeneratorFunctionResult } from "../parser/result/potatno-code-generator-function-result.ts";
import { PotatnoNodeDefinition, PotatnoNodeDefinitionGeneratorContext } from "./node_definition/potatno-node-definition.ts";
import { PotatnoProjectTypesDefinition } from "./potatno-project-types-definition.ts";
import { PotatnoProject } from "./potatno-project.ts";

/**
 * Definition of a entry point blueprint.
 * Of of these blueprints eighter the main entry point or secondary user created entry points can be instantiated in the editor.
 */
export class PotatnoFunctionDefinition<TProject extends PotatnoProject> {
    /**
     * Create a new PotatnoFunctionDefinition.
     *
     * Prefer {@link PotatnoFunctionDefinition.forTypes} when type inference for
     * `pAddNode` callbacks is required.
     *
     * @param pParameters - Parameters defining the entry point's id, static nodes, dynamic nodes, and static settings.
     */
    public static new<TTypes extends PotatnoProjectTypesDefinition<string>, TProject extends PotatnoProject<TTypes>>(_pTypes: TTypes, pParameters: PotatnoFunctionDefinitionConstructorParameter<TProject>): PotatnoFunctionDefinition<TProject> {
        return new PotatnoFunctionDefinition(pParameters);
    }

    private readonly mId: string;
    private readonly mLabel: string;
    private readonly mStatics: PotatnoFunctionDefinitionStatics;
    private readonly mNodesProvider: PotatnoFunctionDefinitionNodeProvider<TProject>;
    private readonly mCodeGenerator: PotatnoFunctionDefinitionGenerator<TProject>;

    /**
     * Unique id for this entry point definition.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * Display label for this function definition.
     */
    public get label(): string {
        return this.mLabel;
    }

    /**
     * Get the code generator configuration for this function definition.
     * Contains both the function-level code wrapper and the call-site value generator.
     */
    public get codeGenerator(): Readonly<PotatnoFunctionDefinitionGenerator<TProject>> {
        return this.mCodeGenerator;
    }

    /**
     * Static settings for this entry point definition, determining which static nodes are generated.
     */
    public get statics(): PotatnoFunctionDefinitionStatics {
        return this.mStatics;
    }

    /**
     * Constructor for a new entry point definition.
     *
     * @param pParameters - Parameters defining the entry point's id, label, static nodes, dynamic nodes, and static settings.
     */
    protected constructor(pParameters: PotatnoFunctionDefinitionConstructorParameter<TProject>) {
        this.mId = pParameters.id;
        this.mLabel = pParameters.label;

        // Set exclusive nodes defined for this entry point that are preset in the editor.
        this.mNodesProvider = pParameters.nodes;

        // Set static settings, defaulting to false for all if not provided.
        this.mStatics = pParameters.statics as PotatnoFunctionDefinitionStatics;

        // Set the entry point code generator.
        this.mCodeGenerator = pParameters.generator.code;
    }

    /**
     * List of entry-point-exclusive nodes.
     * 
     * @param pDocumentFunction - A document function for this definition.
     * 
     * @return A list of entry-point-exclusive nodes.
     */
    public getNodeDefinitions(pDocumentFunction: PotatnoDocumentFunction<TProject>): PotatnoFunctionDefinitionNodes<TProject> {
        // Universal provider for entry, exit, and dynamic nodes. The provider callbacks will be called when the corresponding properties are accessed, allowing for lazy generation of nodes.
        const lNodeProvider = (pProviderFunction: PotatnoFunctionDefinitionNodeProviderFunction<TProject> | undefined) => {
            // Cant have node definitions if no dynamic node provider is set.
            if (!pProviderFunction) {
                return new Array<PotatnoNodeDefinition<TProject>>();
            }

            // Create a temporary array to collect the dynamic nodes provided by the function definition.
            const lNodes: Array<PotatnoNodeDefinition<TProject>> = new Array<PotatnoNodeDefinition<TProject>>();
            pProviderFunction((node: PotatnoNodeDefinition<TProject>) => {
                lNodes.push(node);
            }, pDocumentFunction);

            return lNodes;
        };

        // Create a object with dynamic accessor properties for entry, exit, and dynamic nodes, which calls the corresponding provider callbacks when accessed.
        const lNodes: PotatnoFunctionDefinitionNodes<TProject> = {} as PotatnoFunctionDefinitionNodes<TProject>;

        Object.defineProperty(lNodes, 'entry', {
            get: () => {
                return lNodeProvider(this.mNodesProvider.entry);
            }
        });

        Object.defineProperty(lNodes, 'exit', {
            get: () => {
                return lNodeProvider(this.mNodesProvider.exit);
            }
        });

        Object.defineProperty(lNodes, 'dynamic', {
            get: () => {
                return lNodeProvider(this.mNodesProvider.dynamic);
            }
        });

        return lNodes;
    }
}

type PotatnoFunctionDefinitionConstructorParameter<TProject extends PotatnoProject> = {
    id: string;
    label: string;
    statics: PotatnoFunctionDefinitionStatics | number;
    nodes: PotatnoFunctionDefinitionNodeProvider<NoInfer<TProject>>;
    generator: {
        code: PotatnoFunctionDefinitionGenerator<TProject>;
    };
};

/**
 * Generator configuration for a function definition.
 * codeGenerator wraps all node output into a complete function.
 * valueGenerator produces the call-site expression when this function is used as a node.
 */
export type PotatnoFunctionDefinitionGenerator<TProject extends PotatnoProject> = {
    /**
     * Produces the complete function code from one or more generated graphs.
     * Accepts the abstract result type so both full-function and intermediate builds can flow through the same callback.
     * Callers use pResult.graphResultOf(...) to look up specific graphs and stub out missing ones for intermediate builds.
     */
    body: (pResult: PotatnoCodeGeneratorFunctionResult<TProject>) => string;

    /**
     * Produces the call-site code expression when this function is invoked as a node.
     */
    value: (pContext: PotatnoFunctionDefinitionNodeValueGeneratorContext<TProject>) => string;
};

/**
 * Generator context for nodes values of a function definition.
 * Extends the default PotatnoNodeDefinitionGeneratorContext by the current document function of the node.
 */
export type PotatnoFunctionDefinitionNodeValueGeneratorContext<TProject extends PotatnoProject> = PotatnoNodeDefinitionGeneratorContext & {
    function: PotatnoDocumentFunction<TProject>
} 

/**
 * Node provider for a function definition, providing a dynamic set of nodes.
 */
export type PotatnoFunctionDefinitionNodeProvider<TProject extends PotatnoProject> = {
    /**
     * These nodes are used as an entry point for function subgraphs.
     * Nodes that are fixed on the function graph and cannot be deleted by the user.
     */
    entry?: PotatnoFunctionDefinitionNodeProviderFunction<TProject>;

    /**
     * These nodes are used as exit points for function subgraphs.
     * Nodes that are fixed on the function graph but can be deleted by the user.
     */
    exit?: PotatnoFunctionDefinitionNodeProviderFunction<TProject>;

    /**
     * Nodes that the user can create and delete on its own N times.
     */
    dynamic?: PotatnoFunctionDefinitionNodeProviderFunction<TProject>;
};

type PotatnoFunctionDefinitionNodeProviderFunction<TProject extends PotatnoProject> = (pAddNode: (node: PotatnoNodeDefinition<TProject>) => void, pFunction: PotatnoDocumentFunction<TProject>) => void;

export type PotatnoFunctionDefinitionNodes<TProject extends PotatnoProject> = {
    /**
     * These nodes are used as an entry point for function subgraphs.
     * Nodes that are fixed on the function graph and cannot be deleted by the user.
     */
    entry: ReadonlyArray<PotatnoNodeDefinition<TProject>>;

    /**
     * These nodes are used as exit points for function subgraphs.
     * Nodes that are fixed on the function graph but can be deleted by the user.
     */
    exit: ReadonlyArray<PotatnoNodeDefinition<TProject>>;

    /**
     * Nodes that the user can create and delete on its own N times.
     */
    dynamic: ReadonlyArray<PotatnoNodeDefinition<TProject>>;
};

/**
 * Settings to set global configuration static, so it cant be changed by the user.
 */
export const PotatnoFunctionDefinitionStatics = {
    none: 0,
    imports: 1,
    inputs: 2,
    outputs: 4,
} as const;
export type PotatnoFunctionDefinitionStatics = typeof PotatnoFunctionDefinitionStatics[keyof typeof PotatnoFunctionDefinitionStatics];

export type PotatnoFunctionDefinitionPreview<TProject extends PotatnoProject> = {
    /**
     * Generator function that produces an HTMLElement to be used as a live preview for a node instance.
     *
     * @returns an element that the node gets append as preview.
     */
    readonly generate: () => Element;

    /**
     * Update function that updates the preview element based on the current input values and output values of the node instance.
     * This can be used to create live, data-driven previews that react to changes in the node's inputs and outputs.
     *
     * @param pElement - The preview element to be updated.
     * @param pFunction - The complete function object containing the function body code, inputs, and outputs, which can be used to update the preview element accordingly.
     * @param pPreviewInputData - The example preview input data for the entry point, which can be used to run the intermediate code and update the preview element accordingly.
     * @param pIntermediateCodeOutput - The output of the intermediate code execution, which can be used to update the preview element accordingly.
     */
    readonly update: (pElement: Element, pFunction: PotatnoCodeGeneratorFunctionResult<TProject>, pPreviewInputData: any, pIntermediateCodeOutput: string) => void;
};
