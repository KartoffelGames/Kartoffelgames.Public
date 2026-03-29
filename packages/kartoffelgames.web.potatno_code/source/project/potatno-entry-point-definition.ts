import { PotatnoCodeFunction } from "../parser/potatno-code-function.ts";
import { PotatnoNodeDefinition } from "./potatno-node-definition.ts";
import { PotatnoProjectTypes } from "./potatno-project.ts";

/**
 * Definition of a entry point blueprint.
 * Of of these blueprints eighter the main entry point or secondary user created entry points can be instantiated in the editor.
 */
export class PotatnoEntryPointDefinition<TTypes extends PotatnoProjectTypes = PotatnoProjectTypes> {
    /**
     * Factory method to create a new entry point definition.
     * 
     * @param pParameters - Constructor parameters for the entry point definition, including id, static node definitions, dynamic node definitions, and static settings.
     * 
     * @returns The created PotatnoEntryPointDefinition instance. 
     */
    public static create<TTypes extends PotatnoProjectTypes = PotatnoProjectTypes>(pParameters: PotatnoEntryPointDefinitionConstructorParameter<TTypes>): PotatnoEntryPointDefinition<TTypes> {
        return new PotatnoEntryPointDefinition(pParameters);
    }

    private readonly mId: string;
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
    private constructor(pParameters: PotatnoEntryPointDefinitionConstructorParameter<TTypes>) {
        this.mId = pParameters.id;

        // Set exclusive nodes defined for this entry point that are preset in the editor.
        this.mNodes = {
            static: pParameters.nodes?.static ?? [],
            dynamic: pParameters.nodes?.dynamic ?? [],
        };

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

type PotatnoEntryPointDefinitionConstructorParameter<TTypes extends PotatnoProjectTypes> = {
    id: string;
    statics: Partial<PotatnoEntryPointDefinitionStaticSettings>;
    nodes?: Partial<PotatnoEntryPointDefinitionNodes<TTypes>>;
    preview?: PotatnoNodeEntryPointPreview<HTMLElement>;
    codeGenerator: (func: PotatnoCodeFunction) => string;
};

type PotatnoEntryPointDefinitionNodes<TTypes extends PotatnoProjectTypes> = {
    static: Array<PotatnoNodeDefinition<TTypes>>;
    dynamic: Array<PotatnoNodeDefinition<TTypes>>;
};

export type PotatnoEntryPointDefinitionStaticSettings = {
    imports: boolean;
    inputs: boolean;
    outputs: boolean;
};

export type PotatnoNodeEntryPointPreview<TElement extends HTMLElement> = {
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
     * @param pPreviewInputData - The example preview input data for the entry point, which can be used to run the intermediate code and update the preview element accordingly.
     * @param pIntermediateCodeOutput - The output of the intermediate code execution, which can be used to update the preview element accordingly.
     */
    readonly updatePreview: (pElement: TElement, pPreviewInputData: any, pIntermediateCodeOutput: string) => void;
};