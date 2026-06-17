import { Exception } from '@kartoffelgames/core';
import { PotatnoPortDefinition, type PotatnoPortDefinitionConfiguration } from '../potatno-port-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../potatno-project-types-definition.ts';

/**
 * Potatno node definition that changes dynamically based on the provided context.
 */
export class PotatnoNodeDefinition<TProjectTypes extends PotatnoProjectTypesDefinition> {
    private readonly mId: string;
    private readonly mCategory: string;
    private readonly mLabel: string;
    private readonly mRegions: PotatnoNodeDefinitionRegions;
    private readonly mCodeGenerator: PotatnoNodeDefinitionCodeGenerator;
    private readonly mPortProvider: PotatnoNodeDefinitionPortGenerator<TProjectTypes>;

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
    public get inputs(): ReadonlyArray<PotatnoPortDefinition<TProjectTypes>> {
        // Flag to check that a node can only have a single input flow port.
        let lHasFlowPort: boolean = false;

        // Reads port configuration and converts it into PotatnoPortDefinition.
        const lPorts: Array<PotatnoPortDefinition<TProjectTypes>> = [];
        this.mPortProvider.inputs((pConfiguration) => {
            lPorts.push(new PotatnoPortDefinition<TProjectTypes>(pConfiguration));

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
    public get outputs(): ReadonlyArray<PotatnoPortDefinition<TProjectTypes>> {
        // Reads port configuration and converts it into PotatnoPortDefinition.
        const lPorts: Array<PotatnoPortDefinition<TProjectTypes>> = [];
        this.mPortProvider.outputs((pConfiguration) => {
            lPorts.push(new PotatnoPortDefinition<TProjectTypes>(pConfiguration));
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
    public getPort(pName: string): PotatnoPortDefinition<TProjectTypes> | undefined {
        return [...this.inputs, ...this.outputs].find((pPort) => pPort.id === pName);
    }

    /**
     * Constructor.
     *
     * @param pParameters - Constructor parameters.
     */
    public constructor(pParameters: PotatnoNodeDefinitionConstructorParameter<TProjectTypes>) {
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

type PotatnoNodeDefinitionConstructorParameter<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    id: string;
    label: string;
    category: string;
    regions?: Partial<PotatnoNodeDefinitionRegions> | null;
    generators: {
        ports: PotatnoNodeDefinitionPortGenerator<TProjectTypes>;
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

export type PotatnoNodeDefinitionPortGenerator<TProjectTypes extends PotatnoProjectTypesDefinition> = {
    inputs: PotatnoNodeDefinitionPortGeneratorFunction<TProjectTypes>;
    outputs: PotatnoNodeDefinitionPortGeneratorFunction<TProjectTypes>;
};

export type PotatnoNodeDefinitionPortGeneratorFunction<TProjectTypes extends PotatnoProjectTypesDefinition> = (pAddPort: (pConfiguration: PotatnoPortDefinitionConfiguration<TProjectTypes>) => void) => void;

/*
 * Code generator ports.
 */

/**
 * Per-input-port context surface seen by a node's code generator.
 * Input ports only carry a value identifier (either the valueId of the
 * connected source output, or a literal expression for unconnected
 * value inputs).
 * 
 * Flow inputs do not appear in pContext.inputs.
 */
export type PotatnoCodeGeneratorInputPort = {
    /**
     * The valueId or literal expression to read from this input port.
     */
    value: string;

    /**
     * Input value is a direct value.
     * Determinates that this input port is not connected to any output.
     */
    isDirectValue: boolean;
};

/**
 * Per-output-port context surface seen by a node's code generator.
 *
 * For value outputs: valueId is the freshly-allocated variable name
 * the node should assign to; code.inner is unused (empty string).
 *
 * For flow outputs: code.inner is the recursive subgraph code reachable
 * downstream of this flow output; valueId is unused (empty string).
 */
export type PotatnoCodeGeneratorOutputPort = {
    /**
     * Variable name allocated for a value output. Empty string for flow outputs.
     */
    value: string;

    /**
     * Code attached to a flow output.
     */
    code: {
        /**
         * Recursive code reachable downstream of this flow output port.
         * Empty string for value outputs.
         */
        inner: string;
    };
};

/*
 * Code generator
 */

/**
 * Function signature for a node definition's code generator callback.
 */
export type PotatnoNodeDefinitionCodeGenerator = (pContext: PotatnoNodeDefinitionGeneratorContext) => string;

/**
 * Context object passed to a node definition's code generator callback.
 */
export type PotatnoNodeDefinitionGeneratorContext = {
    /**
     * Input port surfaces keyed by port definition id.
     * Only value inputs appear here; flow inputs are not represented.
     */
    readonly inputs: Record<string, PotatnoCodeGeneratorInputPort>;

    /**
     * Output port surfaces keyed by port definition id.
     */
    readonly outputs: Record<string, PotatnoCodeGeneratorOutputPort>;

    /**
     * Context-level code surface for branching nodes (≥2 flow outputs).
     */
    readonly code: {
        /**
         * Code that runs after a branching node's flow outputs reconverge the merged tail.
         * Empty string for non-branching nodes.
         */
        next: string;
    };
};
