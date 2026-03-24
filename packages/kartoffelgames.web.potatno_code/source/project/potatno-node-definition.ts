import { Exception } from "@kartoffelgames/core";
import { NodeCategory } from "../node/node-category.enum.ts";
import { PotatnoProject } from "./potatno-project.ts";

export class PotatnoProjectNodeDefinition<TInputs extends PotatnoProjectNodeDefinitionPorts = {}, TOutputs extends PotatnoProjectNodeDefinitionPorts = {}> {
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
    public constructor(pProject: PotatnoProject, params: PotatnoProjectNodeDefinitionConstructorParameter<TInputs, TOutputs>) {
        this.mName = params.name;
        this.mCategory = params.category;
        this.mInputs = params.inputs ?? {} as TInputs;
        this.mOutputs = params.outputs ?? {} as TOutputs;
        this.mCodeGenerator = params.codeGenerator;

        // Validate input and output value ports types are defined in project.
        for (const lPort of Object.values(this.mInputs)) {
            // Skip none value ports.
            if (lPort.nodeType !== 'value') {
                continue;
            }

            // Throw if type is not registered in project.
            if (!pProject.hasType(lPort.dataType)) {
                throw new Exception(`Type not registered in project for input port type '${lPort.dataType}' in node definition '${this.mName}'.`, this);
            }
        }
    }
}

type PotatnoProjectNodeDefinitionConstructorParameter<TInputs extends PotatnoProjectNodeDefinitionPorts | undefined, TOutputs extends PotatnoProjectNodeDefinitionPorts | undefined> = {
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
export type PotatnoProjectNodeDefinitionGeneratorData<TInputs extends PotatnoProjectNodeDefinitionPorts | undefined, TOutputs extends PotatnoProjectNodeDefinitionPorts | undefined> = {
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
type PotatnoProjectNodeDefinitionCodeGenerator<TInputs extends PotatnoProjectNodeDefinitionPorts | undefined, TOutputs extends PotatnoProjectNodeDefinitionPorts | undefined> = (pContext: PotatnoProjectNodeDefinitionGeneratorData<TInputs, TOutputs>) => string;

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

type PotatnoProjectNodeDefinitionPorts = { [portName: string]: PotatnoProjectNodeDefinitionPort; };