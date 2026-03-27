import { Exception } from "@kartoffelgames/core";
import { NodeCategory } from "../node/node-category.enum.ts";
import { PotatnoProject } from "./potatno-project.ts";

/**
 * Definition of a node type that can be instantiated in the graph. Registered at the project level and referenced by nodes via the definitionName property.
 * Generics allow for strong typing of input and output port definitions, which are passed to the code generator callback for type-safe code generation.
 * 
 * @template TInputKeys - String literal union type of valid input port names for this node definition.
 * @template TInputs - Object type mapping input port names to their definitions, constrained by TInputKeys.
 * @template TOutputKeys - String literal union type of valid output port names for this node definition.
 * @template TOutputs - Object type mapping output port names to their definitions, constrained by TOutputKeys.
 */
export class PotatnoProjectNodeDefinition<TInputs extends PotatnoProjectNodeDefinitionPorts = {}, TOutputs extends PotatnoProjectNodeDefinitionPorts = {}> {
    private readonly mId: string;
    private readonly mCategory: NodeCategory;
    private readonly mInputs: TInputs;
    private readonly mLabel: string;
    private readonly mOutputs: TOutputs;
    private readonly mCodeGenerator: PotatnoProjectNodeDefinitionCodeGenerator<TInputs, TOutputs>;

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
    public get codeGenerator(): PotatnoProjectNodeDefinitionCodeGenerator<TInputs, TOutputs> {
        return this.mCodeGenerator;
    }

    /**
     * Constructor.
     * 
     * @param params - Constructor parameters. 
     */
    public constructor(pProject: PotatnoProject, params: PotatnoProjectNodeDefinitionConstructorParameter<TInputs, TOutputs>) {
        this.mId = params.name;
        this.mLabel = params.label ?? params.name;
        this.mCategory = params.category;
        this.mInputs = params.inputs ?? {} as TInputs;
        this.mOutputs = params.outputs ?? {} as TOutputs;
        this.mCodeGenerator = params.codeGenerator;

        // Validate input value ports types are defined in project.
        for (const lPort of Object.values<PotatnoProjectNodeDefinitionPort>(this.mInputs)) {
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
        for (const lPort of Object.values<PotatnoProjectNodeDefinitionPort>(this.mOutputs)) {
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

type PotatnoProjectNodeDefinitionConstructorParameter<TInputs extends PotatnoProjectNodeDefinitionPorts, TOutputs extends PotatnoProjectNodeDefinitionPorts> = {
    label?: string;
    name: string;
    category: NodeCategory;
    inputs: TInputs;
    outputs: TOutputs;
    codeGenerator: PotatnoProjectNodeDefinitionCodeGenerator<TInputs, TOutputs>;
};

/**
 * Typed context passed to the node code generator callback.
 * All maps are plain JS objects for type safety and easy destructuring.
 */
export type PotatnoProjectNodeDefinitionGeneratorData<TInput extends PotatnoProjectNodeDefinitionPorts, TOutput extends PotatnoProjectNodeDefinitionPorts> = {
    /**
     *  Input port valueIds keyed by port name. 
     */
    readonly inputs: PotatnoProjectCodeGeneratorPorts<TInput>;

    /** 
     * Output port valueIds keyed by port name. 
     */
    readonly outputs: PotatnoProjectCodeGeneratorPorts<TOutput>;
};

/**
 * Code generator callback type for node definitions, receiving a typed context with inputs, outputs, properties, and body code blocks.
 */
type PotatnoProjectNodeDefinitionCodeGenerator<TInput extends PotatnoProjectNodeDefinitionPorts, TOutput extends PotatnoProjectNodeDefinitionPorts> = (pContext: PotatnoProjectNodeDefinitionGeneratorData<TInput, TOutput>) => string;

/**
 * Definition of a port type used when registering node definitions.
 */

export type PotatnoProjectNodeDefinitionPort = PotatnoProjectNodeDefinitionFlowPort | PotatnoProjectNodeDefinitionValuePort | PotatnoProjectNodeDefinitionInputPort;

export type PotatnoProjectNodeDefinitionFlowPort = {
    /** 
     * Fixed type discriminator for flow ports.
     */
    nodeType: 'flow';
};

export type PotatnoProjectNodeDefinitionInputPort = {
    /**
     * Fixed type discriminator for input ports.
     */
    nodeType: 'input';

    /** 
     * Data type identifier for the port.
     */
    dataType: string;

    /** 
     * Input type for UI rendering and validation.
     */
    inputType: 'string' | 'number' | 'boolean';
};

export type PotatnoProjectNodeDefinitionValuePort = {
    /**
     * Fixed type discriminator for value ports.
     */
    nodeType: 'value';

    /** 
     * Data type identifier for the port.
     */
    dataType: string;
};

export type PotatnoProjectNodeDefinitionPorts<TKey extends string = string> = Record<TKey, PotatnoProjectNodeDefinitionPort>;

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

export type PotatnoProjectCodeGeneratorPorts<TPorts extends PotatnoProjectNodeDefinitionPorts> = {
    [K in keyof TPorts]: TPorts[K] extends PotatnoProjectNodeDefinitionValuePort ? PotatnoProjectCodeGeneratorValuePort :
    TPorts[K] extends PotatnoProjectNodeDefinitionInputPort ? PotatnoProjectCodeGeneratorInputPort :
    TPorts[K] extends PotatnoProjectNodeDefinitionFlowPort ? PotatnoProjectCodeGeneratorFlowPort : never;
};