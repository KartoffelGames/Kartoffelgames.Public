import { PotatnoCodeFunction } from "../parser/potatno-code-function.ts";
import { PotatnoNodeDefinitionGeneratorData } from "./node_definition/potatno-node-definition.ts";
import { PotatnoStaticNodeDefinition } from "./node_definition/potatno-static-node-definition.ts";
import { PotatnoProjectType } from "./potatno-project-types-definition.ts";

/**
 * Definition of a entry point blueprint.
 * Of of these blueprints eighter the main entry point or secondary user created entry points can be instantiated in the editor.
 */
export class PotatnoFunctionDefinition<TTypes extends PotatnoProjectType> {
    private readonly mId: string;
    private readonly mPreviewGenerator: PotatnoFunctionDefinitionPreview | null;
    private readonly mStatics: PotatnoFunctionDefinitionStaticSettings;
    private readonly mNodes: PotatnoFunctionDefinitionNodes<TTypes>;
    private readonly mCodeGenerator: PotatnoFunctionDefinitionGenerator;

    /**
     * Unique id for this entry point definition.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * Get the code generator configuration for this function definition.
     * Contains both the function-level code wrapper and the call-site value generator.
     */
    public get codeGenerator(): Readonly<PotatnoFunctionDefinitionGenerator> {
        return this.mCodeGenerator;
    }

    /**
     * List of entry-point-exclusive nodes.
     */
    public get nodes(): Readonly<PotatnoFunctionDefinitionNodes<TTypes>> {
        return this.mNodes;
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
    public get statics(): Readonly<PotatnoFunctionDefinitionStaticSettings> {
        return this.mStatics;
    }

    /**
     * Constructor for a new entry point definition.
     * 
     * @param pParameters - Parameters defining the entry point's id, label, static nodes, dynamic nodes, and static settings.
     */
    public constructor(pParameters: PotatnoFunctionDefinitionConstructorParameter<TTypes>) {
        this.mId = pParameters.id;

        // Set exclusive nodes defined for this entry point that are preset in the editor.
        this.mNodes = {
            static: pParameters.nodes?.static ?? [],
            dynamic: pParameters.nodes?.dynamic ?? [],
        };

        // Set the preview element for this entry point, if provided.
        this.mPreviewGenerator = pParameters.generator.preview ?? null;

        // Set static settings, defaulting to false for all if not provided.
        this.mStatics = {
            imports: pParameters.statics.imports ?? false,
            inputs: pParameters.statics.inputs ?? false,
            outputs: pParameters.statics.outputs ?? false,
        };

        // Set the entry point code generator.
        this.mCodeGenerator = pParameters.generator.code;
    }
}

type PotatnoFunctionDefinitionConstructorParameter<TTypes extends PotatnoProjectType> = {
    id: string;
    statics: Partial<PotatnoFunctionDefinitionStaticSettings>;
    nodes?: Partial<PotatnoFunctionDefinitionNodes<TTypes>>;
    generator: {
        code: PotatnoFunctionDefinitionGenerator;
        preview?: PotatnoFunctionDefinitionPreview;
    }
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

type PotatnoFunctionDefinitionNodes<TTypes extends PotatnoProjectType> = {
    static: Array<PotatnoStaticNodeDefinition<TTypes>>;
    dynamic: Array<PotatnoStaticNodeDefinition<TTypes>>;
};

/**
 * Settings to set global configuration static, so it cant be changed by the user.
 */
export type PotatnoFunctionDefinitionStaticSettings = {
    imports: boolean;
    inputs: boolean;
    outputs: boolean;
};

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