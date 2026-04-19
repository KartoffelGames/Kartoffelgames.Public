import { PotatnoCodeFunction } from "../parser/potatno-code-function.ts";
import { PotatnoNodeDefinition } from "./potatno-node-definition.ts";
import { PotatnoProjectTypes } from "./potatno-project.ts";

/**
 * Definition of a entry point blueprint.
 * Of of these blueprints eighter the main entry point or secondary user created entry points can be instantiated in the editor.
 */
export class PotatnoEntryPointDefinition<TTypes extends PotatnoProjectTypes = PotatnoProjectTypes, TPreviewElement extends Element = any> {
    /**
     * Factory method to create a new entry point definition.
     * 
     * @param pParameters - Constructor parameters for the entry point definition, including id, static node definitions, dynamic node definitions, and static settings.
     * 
     * @returns The created PotatnoEntryPointDefinition instance. 
     */
    public static create<TTypes extends PotatnoProjectTypes, TPreviewElement extends Element>(pParameters: PotatnoEntryPointDefinitionConstructorParameter<TTypes, TPreviewElement>): PotatnoEntryPointDefinition<TTypes, TPreviewElement> {
        return new PotatnoEntryPointDefinition(pParameters);
    }

    private readonly mId: string;
    private readonly mPreview: PotatnoNodeEntryPointPreview<TPreviewElement> | null;
    private readonly mStatics: PotatnoEntryPointDefinitionStaticSettings;
    private readonly mNodes: PotatnoEntryPointDefinitionNodes<TTypes>;
    private mCodeGenerator: ((func: PotatnoCodeFunction) => string);

    /**
     * Unique id for this entry point definition.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * Get the function code generator callback.
     */
    public get codeGenerator(): ((func: PotatnoCodeFunction) => string) {
        return this.mCodeGenerator;
    }

    /**
     * List of entry-point-exclusive nodes.
     */
    public get nodes(): Readonly<PotatnoEntryPointDefinitionNodes<TTypes>> {
        return this.mNodes;
    }

    /**
     * Get the preview configuration for this entry point, if provided. This can be used to generate and update a live preview element based on the entry point's function and example input data.
     * If no preview configuration is provided, no preview will be available for this entry point.
     */
    public get preview(): PotatnoNodeEntryPointPreview<TPreviewElement> | null {
        return this.mPreview;
    }

    /**
     * Static settings for this entry point definition, determining which static nodes are generated.
     */
    public get statics(): Readonly<PotatnoEntryPointDefinitionStaticSettings> {
        return this.mStatics;
    }

    /**
     * Constructor for a new entry point definition.
     * 
     * @param pParameters - Parameters defining the entry point's id, label, static nodes, dynamic nodes, and static settings.
     */
    private constructor(pParameters: PotatnoEntryPointDefinitionConstructorParameter<TTypes, TPreviewElement>) {
        this.mId = pParameters.id;

        // Set exclusive nodes defined for this entry point that are preset in the editor.
        this.mNodes = {
            static: pParameters.nodes?.static ?? [],
            dynamic: pParameters.nodes?.dynamic ?? [],
        };

        // Set the preview element for this entry point, if provided.
        this.mPreview = pParameters.preview ?? null;

        // Set static settings, defaulting to false for all if not provided.
        this.mStatics = {
            imports: pParameters.statics.imports ?? false,
            inputs: pParameters.statics.inputs ?? false,
            outputs: pParameters.statics.outputs ?? false,
        };

        // Set the entry point code generator.
        this.mCodeGenerator = pParameters.codeGenerator;
    }
}

type PotatnoEntryPointDefinitionConstructorParameter<TTypes extends PotatnoProjectTypes, TPreviewElement extends Element> = {
    id: string;
    statics: Partial<PotatnoEntryPointDefinitionStaticSettings>;
    nodes?: Partial<PotatnoEntryPointDefinitionNodes<TTypes>>;
    preview?: PotatnoNodeEntryPointPreview<TPreviewElement>;
    codeGenerator: (pFunction: PotatnoCodeFunction) => string;
};

type PotatnoEntryPointDefinitionNodes<TTypes extends PotatnoProjectTypes> = {
    static: Array<PotatnoNodeDefinition<TTypes>>;
    dynamic: Array<PotatnoNodeDefinition<TTypes>>;
};

/**
 * Settings to set global configuration static, so it cant be changed by the user.
 */
export type PotatnoEntryPointDefinitionStaticSettings = {
    imports: boolean;
    inputs: boolean;
    outputs: boolean;
};

export type PotatnoNodeEntryPointPreview<TElement extends Element> = {
    /**
     * Generator function that produces an HTMLElement to be used as a live preview for a node instance.
     * 
     * @returns an element that the node gets append as preview.
     */
    readonly generatePreview: () => TElement;

    /**
     * Update function that updates the preview element based on the current input values and output values of the node instance.
     * This can be used to create live, data-driven previews that react to changes in the node's inputs and outputs.
     * 
     * @param pElement - The preview element to be updated.
     * @param pFunction - The complete function object containing the function body code, inputs, and outputs, which can be used to update the preview element accordingly.
     * @param pPreviewInputData - The example preview input data for the entry point, which can be used to run the intermediate code and update the preview element accordingly.
     * @param pIntermediateCodeOutput - The output of the intermediate code execution, which can be used to update the preview element accordingly.
     */
    readonly updatePreview: (pElement: TElement, pFunction: PotatnoCodeFunction,pPreviewInputData: any, pIntermediateCodeOutput: string) => void;
};