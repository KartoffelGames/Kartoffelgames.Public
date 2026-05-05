import { PotatnoCodeFunction } from "../parser/potatno-code-function.ts";
import { PotatnoNodeDefinition, PotatnoNodeDefinitionGeneratorData } from "./node_definition/potatno-node-definition.ts";
import { PotatnoProject } from "./potatno-project.ts";
import { PotatnoProjectTypesDefinition } from "./potatno-project-types-definition.ts";
import { PotatnoDocumentFunction } from "../document/potatno-document-function.ts";

/**
 * Definition of a entry point blueprint.
 * Of of these blueprints eighter the main entry point or secondary user created entry points can be instantiated in the editor.
 */
export class PotatnoFunctionDefinition<TProject extends PotatnoProject<any>> {
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
    private readonly mPreviewGenerator: PotatnoFunctionDefinitionPreview | null;
    private readonly mStatics: PotatnoFunctionDefinitionStatics;
    private readonly mNodesProvider: PotatnoFunctionDefinitionNodeProvider<TProject>;
    private readonly mCodeGenerator: PotatnoFunctionDefinitionGenerator;

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
    public get codeGenerator(): Readonly<PotatnoFunctionDefinitionGenerator> {
        return this.mCodeGenerator;
    }

    /**
     * Get the preview configuration for this entry point, if provided. This can be used to generate and update a live preview element based on the entry point's function and example input data.
     * If no preview configuration is provided, no preview will be available for this entry point.
     */
    public get preview(): PotatnoFunctionDefinitionPreview | null {
        return this.mPreviewGenerator;
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

        // Set the preview element for this entry point, if provided.
        this.mPreviewGenerator = pParameters.generator.preview ?? null;

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
    public getNodeDefinitions(pDocumentFunction: PotatnoDocumentFunction<TProject>): ReadonlyArray<PotatnoNodeDefinition<TProject>> {
        // Cant have node definitions if no dynamic node provider is set.
        if (!this.mNodesProvider.dynamic) {
            return new Array<PotatnoNodeDefinition<TProject>>();
        }

        // Create a temporary array to collect the dynamic nodes provided by the function definition.
        const lDynamicNodes: Array<PotatnoNodeDefinition<TProject>> = new Array<PotatnoNodeDefinition<TProject>>();
        this.mNodesProvider.dynamic((node: PotatnoNodeDefinition<TProject>) => {
            lDynamicNodes.push(node);
        }, pDocumentFunction);

        return lDynamicNodes;
    }

    /**
     * List of prefilled nodes that are generated for this entry point and cannot be deleted by the user.
     * 
     * @param pDocumentFunction - A document function for this definition.
     * 
     * @return A list of prefilled nodes that are generated for this entry point and cannot be deleted by the user.
     */
    public getPrefilledNodes(pDocumentFunction: PotatnoDocumentFunction<TProject>): ReadonlyArray<PotatnoNodeDefinition<TProject>> {
        if (this.mNodesProvider.prefilled) {
            // Create a temporary array to collect the prefilled nodes provided by the function definition.
            const lPrefilledNodes: Array<PotatnoNodeDefinition<TProject>> = new Array<PotatnoNodeDefinition<TProject>>();
            this.mNodesProvider.prefilled((node: PotatnoNodeDefinition<TProject>) => {
                lPrefilledNodes.push(node);
            }, pDocumentFunction);

            return lPrefilledNodes;
        }

        return new Array<PotatnoNodeDefinition<TProject>>();
    }
}

type PotatnoFunctionDefinitionConstructorParameter<TProject extends PotatnoProject<any>> = {
    id: string;
    label: string;
    statics: PotatnoFunctionDefinitionStatics | number;
    nodes: PotatnoFunctionDefinitionNodeProvider<NoInfer<TProject>>;
    generator: {
        code: PotatnoFunctionDefinitionGenerator;
        preview?: PotatnoFunctionDefinitionPreview;
    };
};

/**
 * Generator configuration for a function definition.
 * codeGenerator wraps all node output into a complete function.
 * valueGenerator produces the call-site expression when this function is used as a node.
 */
export type PotatnoFunctionDefinitionGenerator = {
    /**
     * Produces the complete function code from the function body and metadata.
     */
    body: (pFunction: PotatnoCodeFunction) => string;

    /**
     * Produces the call-site code expression when this function is invoked as a node.
     */
    value: (pContext: PotatnoNodeDefinitionGeneratorData) => string;
};

/**
 * Node provider for a function definition, providing a dynamic set of nodes.
 */
export type PotatnoFunctionDefinitionNodeProvider<TProject extends PotatnoProject<any>> = {
    /**
     * Nodes that are fixed for this entry point, meaning they are always generated and cannot be deleted by the user.
     */
    prefilled?: (pAddNode: (node: PotatnoNodeDefinition<TProject>) => void, pFunction: PotatnoDocumentFunction<TProject>) => void;

    /**
     * Nodes that the user can create and delete on its own N times.
     */
    dynamic?: (pAddNode: (node: PotatnoNodeDefinition<TProject>) => void, pFunction: PotatnoDocumentFunction<TProject>) => void;
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

export type PotatnoFunctionDefinitionPreview = {
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
    readonly update: (pElement: Element, pFunction: PotatnoCodeFunction, pPreviewInputData: any, pIntermediateCodeOutput: string) => void;
};
