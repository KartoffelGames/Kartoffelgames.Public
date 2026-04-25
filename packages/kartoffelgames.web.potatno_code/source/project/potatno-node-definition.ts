import { IPotatnoNodeDefinition, PotatnoNodeDefinitionCodeGenerator, PotatnoNodeDefinitionPreview } from "./i-potatno-node-definition.ts";
import { PotatnoPortDefinition } from "./potatno-port-definition.ts";
import { PotatnoProjectType } from "./potatno-project.ts";

/**
 * Definition of a node type that can be instantiated in the graph. Registered at the project level and referenced by nodes via the definitionName property.
 * Generics allow for strong typing of input and output port definitions, which are passed to the code generator callback for type-safe code generation.
 * 
 * @template TTypes - String literal union type of valid data type identifiers for ports in this project.
 * @template TInputs - Object type mapping input port names to their definitions.
 * @template TOutputs - Object type mapping output port names to their definitions.
 * @template TPreviewElement - The type of the HTMLElement used for node previews for this node definition.
 */
export class PotatnoNodeDefinition<TTypes extends PotatnoProjectType = PotatnoProjectType, TInputs extends PotatnoNodeDefinitionPorts<TTypes> = any, TOutputs extends PotatnoNodeDefinitionPorts<TTypes> = any, TPreviewElement extends Element = any> implements IPotatnoNodeDefinition<TTypes, TInputs, TOutputs, TPreviewElement> {
    /**
     * Factory method to create a new node definition and register it at the project level.
     * 
     * @param pParameters - Constructor parameters for the node definition, including id, label, category, input and output port definitions, and code generator callback.
     * 
     * @returns The created PotatnoNodeDefinition instance. 
     */
    public static create<TTypes extends PotatnoProjectType, TInputKeys extends string, TInputs extends PotatnoNodeDefinitionPorts<TTypes, TInputKeys>, TOutputKeys extends string, TOutputs extends PotatnoNodeDefinitionPorts<TTypes, TOutputKeys>, TPreviewElement extends Element>(pParameters: PotatnoNodeDefinitionConstructorParameter<TTypes, TInputs, TOutputs, TPreviewElement>): PotatnoNodeDefinition<TTypes, TInputs, TOutputs, TPreviewElement> {
        return new PotatnoNodeDefinition(pParameters);
    }

    private readonly mId: string;
    private readonly mCategory: string;
    private readonly mInputs: Array<PotatnoPortDefinition<TTypes>>;
    private readonly mLabel: string;
    private readonly mOutputs: Array<PotatnoPortDefinition<TTypes>>;
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
    public get category(): string {
        return this.mCategory;
    }

    /** 
     * Data input port definitions. 
     */
    public get inputs(): ReadonlyArray<PotatnoPortDefinition<TTypes>> {
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
    public get outputs(): ReadonlyArray<PotatnoPortDefinition<TTypes>> {
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
        this.mCodeGenerator = pParameters.codeGenerator;
        this.mPreview = pParameters.preview ?? null;

        // Convert input and output port definitions to internal format for easy access during code generation and preview updates.
        this.mInputs = Object.entries(pParameters.inputs ?? {}).map(([name, definition]) => {
            return new PotatnoPortDefinition(name, definition.portType, 'dataType' in definition ? definition.dataType : undefined);
        });

        this.mOutputs = Object.entries(pParameters.outputs ?? {}).map(([name, definition]) => {
            return new PotatnoPortDefinition(name, definition.portType, 'dataType' in definition ? definition.dataType : undefined);
        });
    }
}

type PotatnoNodeDefinitionConstructorParameter<TTypes extends PotatnoProjectType, TInputs extends PotatnoNodeDefinitionPorts<TTypes>, TOutputs extends PotatnoNodeDefinitionPorts<TTypes>, TPreviewElement extends Element> = {
    label?: string;
    id: string;
    category: string;
    inputs: TInputs;
    outputs: TOutputs;
    codeGenerator: PotatnoNodeDefinitionCodeGenerator<TTypes, TInputs, TOutputs>;
    preview?: PotatnoNodeDefinitionPreview<TTypes, TInputs, TOutputs, TPreviewElement>;
};

/**
 * Definition of a port type used when registering node definitions.
 */

export type PotatnoNodeDefinitionPortDefinition<TTypes extends PotatnoProjectType = PotatnoProjectType> = PotatnoNodeDefinitionFlowPort | PotatnoNodeDefinitionValuePort<TTypes>;

export type PotatnoNodeDefinitionFlowPort = {
    /** 
     * Fixed type discriminator for flow ports.
     */
    portType: 'flow';
};

export type PotatnoNodeDefinitionValuePort<TTypes extends PotatnoProjectType> = {
    /**
     * Fixed type discriminator for value ports.
     */
    portType: 'value';

    /** 
     * Data type identifier for the port.
     */
    dataType: TTypes;
};

export type PotatnoNodeDefinitionPorts<TTypes extends PotatnoProjectType = PotatnoProjectType, TKey extends string = string> = Record<TKey, PotatnoNodeDefinitionPortDefinition<TTypes>>;

/**
 * Code generator node outputs.
 */

export type PotatnoCodeGeneratorFlowPort = {
    /** 
     * Connected nodes code generator output.
     */
    code: string;
};

export type PotatnoCodeGeneratorValuePort = {
    /**
     * The valueId of the value. Autogenerated variable name can be derived from this for code generation purposes.
     */
    valueId: string;
};

export type PotatnoCodeGeneratorPorts<TTypes extends PotatnoProjectType, TPorts extends PotatnoNodeDefinitionPorts<TTypes>> = {
    [K in keyof TPorts]: TPorts[K] extends PotatnoNodeDefinitionValuePort<TTypes> ? PotatnoCodeGeneratorValuePort :
    TPorts[K] extends PotatnoNodeDefinitionFlowPort ? PotatnoCodeGeneratorFlowPort : never;
};

/**
 * Typed context passed to the node code generator callback.
 * All maps are plain JS objects for type safety and easy destructuring.
 */
export type PotatnoNodeDefinitionGeneratorData<TTypes extends PotatnoProjectType, TInput extends PotatnoNodeDefinitionPorts<TTypes>, TOutput extends PotatnoNodeDefinitionPorts<TTypes>> = {
    /**
     *  Input port valueIds keyed by port name. 
     */
    readonly inputs: PotatnoCodeGeneratorPorts<TTypes, TInput>;

    /** 
     * Output port valueIds keyed by port name. 
     */
    readonly outputs: PotatnoCodeGeneratorPorts<TTypes, TOutput>;
};

