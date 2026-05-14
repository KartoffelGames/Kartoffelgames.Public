import { Exception } from "@kartoffelgames/core";
import { PotatnoCodeGeneratorFunctionResult } from "../../parser/potatno-code-generator-function-result.ts";
import { PotatnoPortDefinition, PotatnoPortDefinitionConfiguration } from "../potatno-port-definition.ts";
import { PotatnoProject } from "../potatno-project.ts";

/**
 * Potatno node definition that changes dynamically based on the provided context.
 */
export class PotatnoNodeDefinition<TProject extends PotatnoProject> {
    /**
     * Create a new PotatnoNodeDefinition.
     *
     * @param pParameters - Static node definition configuration including id, label, category, ports, and generators.
     */
    public static newNode<TProject extends PotatnoProject>(pParameters: PotatnoNodeDefinitionConstructorParameter<TProject>): PotatnoNodeDefinition<TProject> {
        return new PotatnoNodeDefinition<TProject>(pParameters);
    }

    private readonly mId: string;
    private readonly mCategory: string;
    private readonly mLabel: string;
    private readonly mRegions: PotatnoNodeDefinitionRegions;
    private readonly mCodeGenerator: PotatnoNodeDefinitionCodeGenerator;
    private readonly mPortProvider: PotatnoNodeDefinitionPortGenerator<TProject>;

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
    public get inputs(): ReadonlyArray<PotatnoPortDefinition<TProject>> {
        // Flag to check that a node can only have a single input flow port.
        let lHasFlowPort: boolean = false;

        // Reads port configuration and converts it into PotatnoPortDefinition.
        const lPorts: Array<PotatnoPortDefinition<TProject>> = [];
        this.mPortProvider.inputs((pConfiguration) => {
            lPorts.push(PotatnoPortDefinition.new<TProject>(pConfiguration));

            // Check that there is only a single flow port.
            if (pConfiguration.portType === 'flow') {
                if (lHasFlowPort) {
                    throw new Exception(`Node definition ${this.id} has multiple input flow ports, which is not allowed.`, this);
                }

                lHasFlowPort = true;
            }
        });

        return lPorts;
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
    public get outputs(): ReadonlyArray<PotatnoPortDefinition<TProject>> {
        // Reads port configuration and converts it into PotatnoPortDefinition.
        const lPorts: Array<PotatnoPortDefinition<TProject>> = [];
        this.mPortProvider.outputs((pConfiguration) => {
            lPorts.push(PotatnoPortDefinition.new<TProject>(pConfiguration));
        });

        return lPorts;
    }

    /**
     * Regions this node adds, allows, and requires.
     */
    public get regions(): PotatnoNodeDefinitionRegions {
        return this.mRegions;
    }

    /**
     * Code generator callback that produces the code string from a typed context.
     */
    public get codeGenerator(): PotatnoNodeDefinitionCodeGenerator {
        return this.mCodeGenerator;
    }

    /**
     * Get a port definition by its name. Searches both input and output ports.
     *
     * @param pName - The port name to look up.
     */
    public getPort(pName: string): PotatnoPortDefinition<TProject> | undefined {
        return [...this.inputs, ...this.outputs].find((pPort) => pPort.id === pName);
    }

    /**
     * Constructor.
     *
     * @param pParameters - Constructor parameters.
     */
    protected constructor(pParameters: PotatnoNodeDefinitionConstructorParameter<TProject>) {
        // Set id and label.
        this.mId = pParameters.id;
        this.mLabel = pParameters.label;

        // Set category, inputs, outputs, and code generator callback.
        this.mCategory = pParameters.category;
        this.mCodeGenerator = pParameters.generators.code;
        this.mPortProvider = pParameters.generators.ports;

        // Set regions with default empty arrays if not provided.
        this.mRegions = {
            add: pParameters.regions?.add ?? new Array<string>(),
            allows: pParameters.regions?.allows ?? new Array<string>(),
            requires: pParameters.regions?.requires ?? new Array<string>(),
        };
    }
}

type PotatnoNodeDefinitionConstructorParameter<TProject extends PotatnoProject> = {
    id: string;
    label: string;
    category: string;
    regions?: Partial<PotatnoNodeDefinitionRegions> | null;
    generators: {
        ports: PotatnoNodeDefinitionPortGenerator<TProject>;
        code: PotatnoNodeDefinitionCodeGenerator;
    };
};

/*
 * Node regions.
 */
export type PotatnoNodeDefinitionRegions = {
    /**
     * Regions the node adds to the graph.
     */
    add: ReadonlyArray<string>;

    /**
     * Regions other nodes are allowed to connect but are not mandatory for this node.
     */
    allows: ReadonlyArray<string>;

    /**
     * Regions other nodes requires to connect to this node.
     * Exactly the regions must be present. More or less regions will result in a validation error.
     */
    requires: ReadonlyArray<string>;
};

/*
 * Port generator.
 */

export type PotatnoNodeDefinitionPortGenerator<TProject extends PotatnoProject> = {
    inputs: PotatnoNodeDefinitionPortGeneratorFunction<TProject>;
    outputs: PotatnoNodeDefinitionPortGeneratorFunction<TProject>;
};

export type PotatnoNodeDefinitionPortGeneratorFunction<TProject extends PotatnoProject> = (pAddPort: (pConfiguration: PotatnoPortDefinitionConfiguration<TProject>) => void) => void;

/*
 * Code generator ports.
 */
export type PotatnoCodeGeneratorPort = {
    valueId: string;
    code: {
        inner: string;
        next: string;
    };
};

/*
 * Code generator
 */

export type PotatnoNodeDefinitionCodeGenerator = (pContext: PotatnoNodeDefinitionGeneratorContext) => string;

export type PotatnoNodeDefinitionGeneratorContext = {
    /**
     *  Input port valueIds keyed by port name. 
     */
    readonly inputs: Record<string, PotatnoCodeGeneratorPort>;

    /** 
     * Output port valueIds keyed by port name. 
     */
    readonly outputs: Record<string, PotatnoCodeGeneratorPort>;
};