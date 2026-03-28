import { Exception } from "@kartoffelgames/core";
import { NodeCategory } from "../node/node-category.enum.ts";
import { PotatnoProject } from "./potatno-project.ts";

/**
 * Definition of a node type that can be instantiated in the graph. Registered at the project level and referenced by nodes via the definitionName property.
 * Generics allow for strong typing of input and output port definitions, which are passed to the code generator callback for type-safe code generation.
 * 
 * @template TTypes - String literal union type of valid data type identifiers for ports in this project.
 * @template TInputKeys - String literal union type of valid input port names for this node definition.
 * @template TInputs - Object type mapping input port names to their definitions, constrained by TInputKeys.
 * @template TOutputKeys - String literal union type of valid output port names for this node definition.
 * @template TOutputs - Object type mapping output port names to their definitions, constrained by TOutputKeys.
 */
export class PotatnoProjectNodeDefinition<TTypes extends string = string, TInputs extends PotatnoProjectNodeDefinitionPorts<TTypes> = any, TOutputs extends PotatnoProjectNodeDefinitionPorts<TTypes> = any> {
    /**
     * Factory method to create a new node definition and register it at the project level.
     * 
     * @param pProject - Reference to the project this node definition belongs to.
     * @param pParameters - Constructor parameters for the node definition, including id, label, category, input and output port definitions, and code generator callback.
     * 
     * @returns The created PotatnoProjectNodeDefinition instance. 
     */
    public static create<TTypes extends string, TInputKeys extends string, TInputs extends PotatnoProjectNodeDefinitionPorts<TTypes, TInputKeys>, TOutputKeys extends string, TOutputs extends PotatnoProjectNodeDefinitionPorts<TTypes, TOutputKeys>>(pProject: PotatnoProject<TTypes>, pParameters: PotatnoProjectNodeDefinitionConstructorParameter<TTypes, TInputs, TOutputs>): PotatnoProjectNodeDefinition<TTypes, TInputs, TOutputs> {
        return new PotatnoProjectNodeDefinition(pProject, pParameters);
    }

    private readonly mProject: PotatnoProject<TTypes>;
    private readonly mId: string;
    private readonly mCategory: NodeCategory;
    private readonly mInputs: TInputs;
    private readonly mLabel: string;
    private readonly mOutputs: TOutputs;
    private readonly mCodeGenerator: PotatnoProjectNodeDefinitionCodeGenerator<TTypes, TInputs, TOutputs>;

    /**
     *  Unique id for this node definition. 
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * Reference to the project this node definition belongs to.
     */
    public get project(): PotatnoProject<TTypes> {
        return this.mProject;
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
    public get codeGenerator(): PotatnoProjectNodeDefinitionCodeGenerator<TTypes, TInputs, TOutputs> {
        return this.mCodeGenerator;
    }

    /**
     * Constructor.
     * 
     * @param pParameters - Constructor parameters. 
     */
    public constructor(pProject: PotatnoProject<TTypes>, pParameters: PotatnoProjectNodeDefinitionConstructorParameter<TTypes, TInputs, TOutputs>) {
        this.mProject = pProject;

        // Set id and label. Label defaults to id if not provided.
        this.mId = pParameters.id;
        this.mLabel = pParameters.label ?? pParameters.id;

        // Set category, inputs, outputs, and code generator callback.
        this.mCategory = pParameters.category;
        this.mInputs = pParameters.inputs ?? {} as TInputs;
        this.mOutputs = pParameters.outputs ?? {} as TOutputs;
        this.mCodeGenerator = pParameters.codeGenerator;

        // Validate input value ports types are defined in project.
        for (const lPort of Object.values<PotatnoProjectNodeDefinitionPort<TTypes>>(this.mInputs)) {
            // Skip none value ports.
            if (lPort.nodeType !== 'value') {
                continue;
            }

            // Throw if type is not registered in project.
            if (!pProject.hasType(lPort.dataType)) {
                throw new Exception(`Type not registered in project for input port type '${lPort.dataType}' in node definition '${this.mId}'.`, this);
            }
        }

        // Validate output value ports types are defined in project.
        for (const lPort of Object.values<PotatnoProjectNodeDefinitionPort<TTypes>>(this.mOutputs)) {
            // Skip none value ports.
            if (lPort.nodeType !== 'value') {
                continue;
            }

            // Throw if type is not registered in project.
            if (!pProject.hasType(lPort.dataType)) {
                throw new Exception(`Type not registered in project for output port type '${lPort.dataType}' in node definition '${this.mId}'.`, this);
            }
        }
    }
}

type PotatnoProjectNodeDefinitionConstructorParameter<TTypes extends string, TInputs extends PotatnoProjectNodeDefinitionPorts<TTypes>, TOutputs extends PotatnoProjectNodeDefinitionPorts<TTypes>> = {
    label?: string;
    id: string;
    category: NodeCategory;
    inputs: TInputs;
    outputs: TOutputs;
    codeGenerator: PotatnoProjectNodeDefinitionCodeGenerator<TTypes, TInputs, TOutputs>;
};

/**
 * Typed context passed to the node code generator callback.
 * All maps are plain JS objects for type safety and easy destructuring.
 */
export type PotatnoProjectNodeDefinitionGeneratorData<TTypes extends string, TInput extends PotatnoProjectNodeDefinitionPorts<TTypes>, TOutput extends PotatnoProjectNodeDefinitionPorts<TTypes>> = {
    /**
     *  Input port valueIds keyed by port name. 
     */
    readonly inputs: PotatnoProjectCodeGeneratorPorts<TTypes, TInput>;

    /** 
     * Output port valueIds keyed by port name. 
     */
    readonly outputs: PotatnoProjectCodeGeneratorPorts<TTypes, TOutput>;
};

/**
 * Code generator callback type for node definitions, receiving a typed context with inputs, outputs, properties, and body code blocks.
 */
type PotatnoProjectNodeDefinitionCodeGenerator<TTypes extends string, TInput extends PotatnoProjectNodeDefinitionPorts<TTypes>, TOutput extends PotatnoProjectNodeDefinitionPorts<TTypes>> = (pContext: PotatnoProjectNodeDefinitionGeneratorData<TTypes, TInput, TOutput>) => string;

/**
 * Definition of a port type used when registering node definitions.
 */

export type PotatnoProjectNodeDefinitionPort<TTypes extends string = string> = PotatnoProjectNodeDefinitionFlowPort | PotatnoProjectNodeDefinitionValuePort<TTypes> | PotatnoProjectNodeDefinitionInputPort<TTypes>;

export type PotatnoProjectNodeDefinitionFlowPort = {
    /** 
     * Fixed type discriminator for flow ports.
     */
    nodeType: 'flow';
};

export type PotatnoProjectNodeDefinitionInputPort<TTypes extends string> = {
    /**
     * Fixed type discriminator for input ports.
     */
    nodeType: 'input';

    /** 
     * Data type identifier for the port.
     */
    dataType: TTypes;

    /** 
     * Input type for UI rendering and validation.
     */
    inputType: 'string' | 'number' | 'boolean';
};

export type PotatnoProjectNodeDefinitionValuePort<TTypes extends string> = {
    /**
     * Fixed type discriminator for value ports.
     */
    nodeType: 'value';

    /** 
     * Data type identifier for the port.
     */
    dataType: TTypes;
};

export type PotatnoProjectNodeDefinitionPorts<TTypes extends string, TKey extends string = string> = Record<TKey, PotatnoProjectNodeDefinitionPort<TTypes>>;

/**
 * Code generator node outputs.
 */

export type PotatnoProjectCodeGeneratorFlowPort = {
    /** 
     * Connected nodes code generator output.
     */
    code: string;
};

export type PotatnoProjectCodeGeneratorInputPort = {
    /** 
     * User input value as string.
     */
    value: string;

    /**
     * The valueId of the value. Autogenerated variable name can be derived from this for code generation purposes.
     */
    valueId: string;
};

export type PotatnoProjectCodeGeneratorValuePort = {
    /**
     * The valueId of the value. Autogenerated variable name can be derived from this for code generation purposes.
     */
    valueId: string;
};

export type PotatnoProjectCodeGeneratorPorts<TTypes extends string, TPorts extends PotatnoProjectNodeDefinitionPorts<TTypes>> = {
    [K in keyof TPorts]: TPorts[K] extends PotatnoProjectNodeDefinitionValuePort<TTypes> ? PotatnoProjectCodeGeneratorValuePort :
    TPorts[K] extends PotatnoProjectNodeDefinitionInputPort<TTypes> ? PotatnoProjectCodeGeneratorInputPort :
    TPorts[K] extends PotatnoProjectNodeDefinitionFlowPort ? PotatnoProjectCodeGeneratorFlowPort : never;
};