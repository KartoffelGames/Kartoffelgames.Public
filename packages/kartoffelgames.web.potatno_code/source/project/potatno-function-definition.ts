import { PotatnoDocumentFunction } from "../document/potatno-document-function.ts";
import { PotatnoCodeGeneratorFunctionResult } from "../parser/result/potatno-code-generator-function-result.ts";
import { PotatnoNodeDefinition, PotatnoNodeDefinitionGeneratorContext } from "./node_definition/potatno-node-definition.ts";
import { PotatnoProjectTypesDefinition } from "./potatno-project-types-definition.ts";
import { PotatnoProject } from "./potatno-project.ts";

/**
 * Definition of a entry point blueprint.
 * Of of these blueprints eighter the main entry point or secondary user created entry points can be instantiated in the editor.
 */
export class PotatnoFunctionDefinition<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private readonly mId: string;
    private readonly mLabel: string;
    private readonly mStatics: PotatnoFunctionDefinitionStatics;
    private readonly mNodesProvider: PotatnoFunctionDefinitionNodeProvider<TProjectTypes>;
    private readonly mCodeGenerator: PotatnoFunctionDefinitionGenerator<TProjectTypes>;

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
    public get codeGenerator(): Readonly<PotatnoFunctionDefinitionGenerator<TProjectTypes>> {
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
    public constructor(pParameters: PotatnoFunctionDefinitionConstructorParameter<TProjectTypes>) {
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
    public getNodeDefinitions(pDocumentFunction: PotatnoDocumentFunction<TProjectTypes>): PotatnoFunctionDefinitionNodes<TProjectTypes> {
        // Universal provider for entry, exit, and dynamic nodes. The provider callbacks will be called when the corresponding properties are accessed, allowing for lazy generation of nodes.
        const lNodeProvider = (pProviderFunction: PotatnoFunctionDefinitionNodeProviderFunction<TProjectTypes> | undefined) => {
            // Cant have node definitions if no dynamic node provider is set.
            if (!pProviderFunction) {
                return new Array<PotatnoNodeDefinition<TProjectTypes>>();
            }

            // Create a temporary array to collect the dynamic nodes provided by the function definition.
            const lNodes: Array<PotatnoNodeDefinition<TProjectTypes>> = new Array<PotatnoNodeDefinition<TProjectTypes>>();
            pProviderFunction((node: PotatnoNodeDefinition<TProjectTypes>) => {
                lNodes.push(node);
            }, pDocumentFunction);

            return lNodes;
        };

        // Create a object with dynamic accessor properties for entry, exit, and dynamic nodes, which calls the corresponding provider callbacks when accessed.
        const lNodes: PotatnoFunctionDefinitionNodes<TProjectTypes> = {} as PotatnoFunctionDefinitionNodes<TProjectTypes>;

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

type PotatnoFunctionDefinitionConstructorParameter<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    id: string;
    label: string;
    statics: PotatnoFunctionDefinitionStatics | number;
    nodes: PotatnoFunctionDefinitionNodeProvider<NoInfer<TProjectTypes>>;
    generator: {
        code: PotatnoFunctionDefinitionGenerator<TProjectTypes>;
    };
};

/**
 * Generator configuration for a function definition.
 * codeGenerator wraps all node output into a complete function.
 * valueGenerator produces the call-site expression when this function is used as a node.
 */
export type PotatnoFunctionDefinitionGenerator<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    /**
     * Produces the complete function code from one or more generated graphs.
     * Accepts the abstract result type so both full-function and intermediate builds can flow through the same callback.
     * Callers use pResult.graphResultOf(...) to look up specific graphs and stub out missing ones for intermediate builds.
     */
    body: (pResult: PotatnoCodeGeneratorFunctionResult<TProjectTypes>) => string;

    /**
     * Produces the call-site code expression when this function is invoked as a node.
     */
    value: (pContext: PotatnoFunctionDefinitionNodeValueGeneratorContext<TProjectTypes>) => string;
};

/**
 * Generator context for nodes values of a function definition.
 * Extends the default PotatnoNodeDefinitionGeneratorContext by the current document function of the node.
 */
export type PotatnoFunctionDefinitionNodeValueGeneratorContext<TProjectTypes extends PotatnoProjectTypesDefinition> = PotatnoNodeDefinitionGeneratorContext & {
    function: PotatnoDocumentFunction<TProjectTypes>
} 

/**
 * Node provider for a function definition, providing a dynamic set of nodes.
 */
export type PotatnoFunctionDefinitionNodeProvider<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    /**
     * These nodes are used as an entry point for function subgraphs.
     * Nodes that are fixed on the function graph and cannot be deleted by the user.
     */
    entry?: PotatnoFunctionDefinitionNodeProviderFunction<TProjectTypes>;

    /**
     * These nodes are used as exit points for function subgraphs.
     * Nodes that are fixed on the function graph but can be deleted by the user.
     */
    exit?: PotatnoFunctionDefinitionNodeProviderFunction<TProjectTypes>;

    /**
     * Nodes that the user can create and delete on its own N times.
     */
    dynamic?: PotatnoFunctionDefinitionNodeProviderFunction<TProjectTypes>;
};

type PotatnoFunctionDefinitionNodeProviderFunction<TProjectTypes extends PotatnoProjectTypesDefinition> = (pAddNode: (node: PotatnoNodeDefinition<TProjectTypes>) => void, pFunction: PotatnoDocumentFunction<TProjectTypes>) => void;

export type PotatnoFunctionDefinitionNodes<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    /**
     * These nodes are used as an entry point for function subgraphs.
     * Nodes that are fixed on the function graph and cannot be deleted by the user.
     */
    entry: ReadonlyArray<PotatnoNodeDefinition<TProjectTypes>>;

    /**
     * These nodes are used as exit points for function subgraphs.
     * Nodes that are fixed on the function graph but can be deleted by the user.
     */
    exit: ReadonlyArray<PotatnoNodeDefinition<TProjectTypes>>;

    /**
     * Nodes that the user can create and delete on its own N times.
     */
    dynamic: ReadonlyArray<PotatnoNodeDefinition<TProjectTypes>>;
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

export type PotatnoFunctionDefinitionPreview<TProjectTypes extends PotatnoProjectTypesDefinition> = {
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
    readonly update: (pElement: Element, pFunction: PotatnoCodeGeneratorFunctionResult<TProjectTypes>, pPreviewInputData: any, pIntermediateCodeOutput: string) => void;
};
