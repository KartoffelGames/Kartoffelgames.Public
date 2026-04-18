import { NodeCategory } from "../node/node-category.enum.ts";
import { PotatnoProjectTypes } from "./potatno-project.ts";

/**
 * Definition of a node type that can be instantiated in the graph. Registered at the project level and referenced by nodes via the definitionName property.
 * Generics allow for strong typing of input and output port definitions, which are passed to the code generator callback for type-safe code generation.
 * 
 * @template TTypes - String literal union type of valid data type identifiers for ports in this project.
 * @template TInputs - Object type mapping input port names to their definitions.
 * @template TOutputs - Object type mapping output port names to their definitions.
 */
export class PotatnoNodeDefinition<TTypes extends PotatnoProjectTypes = PotatnoProjectTypes, TInputs extends PotatnoNodeDefinitionPorts<TTypes> = any, TOutputs extends PotatnoNodeDefinitionPorts<TTypes> = any, TPreviewElement extends Element = any> {
    /**
     * Factory method to create a new node definition and register it at the project level.
     * 
     * @param pParameters - Constructor parameters for the node definition, including id, label, category, input and output port definitions, and code generator callback.
     * 
     * @returns The created PotatnoProjectNodeDefinition instance. 
     */
    public static create<TTypes extends PotatnoProjectTypes, TInputKeys extends string, TInputs extends PotatnoNodeDefinitionPorts<TTypes, TInputKeys>, TOutputKeys extends string, TOutputs extends PotatnoNodeDefinitionPorts<TTypes, TOutputKeys>, TPreviewElement extends Element>(pParameters: PotatnoNodeDefinitionConstructorParameter<TTypes, TInputs, TOutputs, TPreviewElement>): PotatnoNodeDefinition<TTypes, TInputs, TOutputs, TPreviewElement> {
        return new PotatnoNodeDefinition(pParameters);
    }

    private readonly mId: string;
    private readonly mCategory: NodeCategory;
    private readonly mInputs: TInputs;
    private readonly mLabel: string;
    private readonly mOutputs: TOutputs;
    private readonly mCodeGenerator: PotatnoNodeDefinitionCodeGenerator<TTypes, TInputs, TOutputs>;
    private readonly mPreview: PotatnoNodeDefinitionPreview<TTypes, TInputs, TOutputs, TPreviewElement> | null;

    /**
     *  Unique id for this node definition. 
     */
    public get id(): string {
        return this.mId;
    }

    /** 
     * Category classification determining which subclass is instantiated for code generation.
     */
    public get category(): NodeCategory {
        return this.mCategory;
    }

    /** 
     * Data input port definitions. 
     */
    public get inputs(): TInputs {
        return this.mInputs;
    }

    /**
     * Display label for this node type.
     */
    public get label(): string {
        return this.mLabel;
    }

    /** 
     * Data output port definitions. 
     */
    public get outputs(): TOutputs {
        return this.mOutputs;
    }

    /**
     * Code generator callback that produces the code string from a typed context.
     */
    public get codeGenerator(): PotatnoNodeDefinitionCodeGenerator<TTypes, TInputs, TOutputs> {
        return this.mCodeGenerator;
    }

    /**
     * Preview configuration for this node type.
     */
    public get preview(): PotatnoNodeDefinitionPreview<TTypes, TInputs, TOutputs, TPreviewElement> | null {
        return this.mPreview;
    }

    /**
     * Constructor.
     * 
     * @param pParameters - Constructor parameters. 
     */
    public constructor(pParameters: PotatnoNodeDefinitionConstructorParameter<TTypes, TInputs, TOutputs, TPreviewElement>) {
        // Set id and label. Label defaults to id if not provided.
        this.mId = pParameters.id;
        this.mLabel = pParameters.label ?? pParameters.id;

        // Set category, inputs, outputs, and code generator callback.
        this.mCategory = pParameters.category;
        this.mInputs = pParameters.inputs ?? {} as TInputs;
        this.mOutputs = pParameters.outputs ?? {} as TOutputs;
        this.mCodeGenerator = pParameters.codeGenerator;
        this.mPreview = pParameters.preview ?? null;
    }
}

type PotatnoNodeDefinitionConstructorParameter<TTypes extends PotatnoProjectTypes, TInputs extends PotatnoNodeDefinitionPorts<TTypes>, TOutputs extends PotatnoNodeDefinitionPorts<TTypes>, TPreviewElement extends Element> = {
    label?: string;
    id: string;
    category: NodeCategory;
    inputs: TInputs;
    outputs: TOutputs;
    codeGenerator: PotatnoNodeDefinitionCodeGenerator<TTypes, TInputs, TOutputs>;
    preview?: PotatnoNodeDefinitionPreview<TTypes, TInputs, TOutputs, TPreviewElement>;
};

/**
 * Typed context passed to the node code generator callback.
 * All maps are plain JS objects for type safety and easy destructuring.
 */
export type PotatnoNodeDefinitionGeneratorData<TTypes extends PotatnoProjectTypes, TInput extends PotatnoNodeDefinitionPorts<TTypes>, TOutput extends PotatnoNodeDefinitionPorts<TTypes>> = {
    /**
     *  Input port valueIds keyed by port name. 
     */
    readonly inputs: PotatnoCodeGeneratorPorts<TTypes, TInput>;

    /** 
     * Output port valueIds keyed by port name. 
     */
    readonly outputs: PotatnoCodeGeneratorPorts<TTypes, TOutput>;
};

/**
 * Code generator callback type for node definitions, receiving a typed context with inputs, outputs, properties, and body code blocks.
 */
type PotatnoNodeDefinitionCodeGenerator<TTypes extends PotatnoProjectTypes, TInput extends PotatnoNodeDefinitionPorts<TTypes>, TOutput extends PotatnoNodeDefinitionPorts<TTypes>> = (pContext: PotatnoNodeDefinitionGeneratorData<TTypes, TInput, TOutput>) => string;

/**
 * Definition of a port type used when registering node definitions.
 */

export type PotatnoNodeDefinitionPort<TTypes extends PotatnoProjectTypes = PotatnoProjectTypes> = PotatnoNodeDefinitionFlowPort | PotatnoNodeDefinitionValuePort<TTypes> | PotatnoNodeDefinitionInputPort<TTypes>;

export type PotatnoNodeDefinitionFlowPort = {
    /** 
     * Fixed type discriminator for flow ports.
     */
    nodeType: 'flow';
};

export type PotatnoNodeDefinitionInputPort<TTypes extends PotatnoProjectTypes> = {
    /**
     * Fixed type discriminator for input ports.
     */
    nodeType: 'input';

    /** 
     * Data type identifier for the port.
     */
    dataType: keyof TTypes;

    /** 
     * Input type for UI rendering and validation.
     */
    inputType: 'string' | 'number' | 'boolean';
};

export type PotatnoNodeDefinitionValuePort<TTypes extends PotatnoProjectTypes> = {
    /**
     * Fixed type discriminator for value ports.
     */
    nodeType: 'value';

    /** 
     * Data type identifier for the port.
     */
    dataType: keyof TTypes;
};

export type PotatnoNodeDefinitionPorts<TTypes extends PotatnoProjectTypes = PotatnoProjectTypes, TKey extends string = string> = Record<TKey, PotatnoNodeDefinitionPort<TTypes>>;

/**
 * Code generator node outputs.
 */

export type PotatnoCodeGeneratorFlowPort = {
    /** 
     * Connected nodes code generator output.
     */
    code: string;
};

export type PotatnoCodeGeneratorInputPort = {
    /** 
     * User input value as string.
     */
    value: string;

    /**
     * The valueId of the value. Autogenerated variable name can be derived from this for code generation purposes.
     */
    valueId: string;
};

export type PotatnoCodeGeneratorValuePort = {
    /**
     * The valueId of the value. Autogenerated variable name can be derived from this for code generation purposes.
     */
    valueId: string;
};

export type PotatnoCodeGeneratorPorts<TTypes extends PotatnoProjectTypes, TPorts extends PotatnoNodeDefinitionPorts<TTypes>> = {
    [K in keyof TPorts]: TPorts[K] extends PotatnoNodeDefinitionValuePort<TTypes> ? PotatnoCodeGeneratorValuePort :
    TPorts[K] extends PotatnoNodeDefinitionInputPort<TTypes> ? PotatnoCodeGeneratorInputPort :
    TPorts[K] extends PotatnoNodeDefinitionFlowPort ? PotatnoCodeGeneratorFlowPort : never;
};

/**
 * Preview generation.
 */

export type PotatnoNodeDefinitionPreview<TTypes extends PotatnoProjectTypes, TInput extends PotatnoNodeDefinitionPorts<TTypes>, TOutput extends PotatnoNodeDefinitionPorts<TTypes>, TElement extends Element> = {
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
    readonly updatePreview: (pElement: TElement, pContext: PotatnoNodeDefinitionGeneratorData<TTypes, TInput, TOutput>, pPreviewInputData: any, pIntermediateCodeOutput: string) => void;
};