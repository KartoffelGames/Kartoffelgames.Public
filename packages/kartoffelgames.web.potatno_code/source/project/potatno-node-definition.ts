import { Exception } from "@kartoffelgames/core";
import { NodeCategory } from "../node/node-category.enum.ts";
import { PotatnoProject } from "./potatno-project.ts";

export class PotatnoProjectNodeDefinition<TInputKeys extends string, TOutputKeys extends string, TInputs extends PotatnoProjectNodeDefinitionPorts<TInputKeys> = { [x in TInputKeys]: any }, TOutputs extends PotatnoProjectNodeDefinitionPorts<TOutputKeys> = { [x in TOutputKeys]: any }> {
    private readonly mName: string;
    private readonly mCategory: NodeCategory;
    private readonly mInputs: TInputs;
    private readonly mOutputs: TOutputs;
    private readonly mCodeGenerator: PotatnoProjectNodeDefinitionCodeGenerator<TInputs, TOutputs>;

    /**
     *  Unique display name for this node type. 
     */
    public get name(): string {
        return this.mName;
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
    public constructor(pProject: PotatnoProject, params: PotatnoProjectNodeDefinitionConstructorParameter<TInputKeys, TInputs, TOutputKeys, TOutputs>) {
        this.mName = params.name;
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
                throw new Exception(`Type not registered in project for input port type '${lPort.dataType}' in node definition '${this.mName}'.`, this);
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
                throw new Exception(`Type not registered in project for output port type '${lPort.dataType}' in node definition '${this.mName}'.`, this);
            }
        }
    }
}

type PotatnoProjectNodeDefinitionConstructorParameter<TInputKeys extends string, TInputs extends PotatnoProjectNodeDefinitionPorts<TInputKeys> | undefined, TOutputKeys extends string, TOutputs extends PotatnoProjectNodeDefinitionPorts<TOutputKeys> | undefined> = {
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
export type PotatnoProjectNodeDefinitionGeneratorData<TInputs extends PotatnoProjectNodeDefinitionPorts<any> | undefined, TOutputs extends PotatnoProjectNodeDefinitionPorts<any> | undefined> = {
    /**
     *  Input port valueIds keyed by port name. 
     */
    readonly inputs: Readonly<{ [K in keyof TInputs]: string }>;

    /** 
     * Output port valueIds keyed by port name. 
     */
    readonly outputs: Readonly<{ [K in keyof TOutputs]: string }>;

    /**
     *  Property values keyed by property name.
     */
    readonly properties: Readonly<Record<string, string>>;

    /** 
     * Body code blocks keyed by flow output name (for flow nodes).
     */
    readonly body: Readonly<Record<string, string>>;
};

/**
 * Code generator callback type for node definitions, receiving a typed context with inputs, outputs, properties, and body code blocks.
 */
type PotatnoProjectNodeDefinitionCodeGenerator<TInputs extends PotatnoProjectNodeDefinitionPorts<string> | undefined, TOutputs extends PotatnoProjectNodeDefinitionPorts<string> | undefined> = (pContext: PotatnoProjectNodeDefinitionGeneratorData<TInputs, TOutputs>) => string;

/**
 * Definition of a port type used when registering node definitions.
 */
type PotatnoProjectNodeDefinitionPort = {
    /** 
     * Fixed type discriminator for flow ports.
     */
    nodeType: 'flow';
} | {
    /**
     * Fixed type discriminator for value ports.
     */
    nodeType: 'value';

    /** 
     * Data type identifier for the port.
     */
    dataType: string;
};;

export type PotatnoProjectNodeDefinitionPorts<TKey extends string> = { [portName in TKey]: PotatnoProjectNodeDefinitionPort; };