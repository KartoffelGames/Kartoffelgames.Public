import { Exception } from "@kartoffelgames/core";
import { PotatnoCodeFunction } from "../../parser/potatno-code-function.ts";
import { PotatnoPortDefinition, PotatnoPortDefinitionConfiguration } from "../potatno-port-definition.ts";
import { PotatnoProject } from "../potatno-project.ts";

/**
 * Potatno node definition that changes dynamically based on the provided context.
 */
export class PotatnoNodeDefinition<TProject extends PotatnoProject<any>> {
    /**
     * Create a new PotatnoNodeDefinition.
     *
     * @param pParameters - Static node definition configuration including id, label, category, ports, and generators.
     */
    public static newNode<TProject extends PotatnoProject<any>>(pParameters: PotatnoNodeDefinitionConstructorParameter<TProject>): PotatnoNodeDefinition<TProject> {
        return new PotatnoNodeDefinition<TProject>(pParameters);
    }

    private readonly mId: string;
    private readonly mCategory: string;
    private readonly mLabel: string;
    private readonly mRegions: PotatnoNodeDefinitionRegions;
    private readonly mCodeGenerator: PotatnoNodeDefinitionCodeGenerator;
    private readonly mPortProvider: PotatnoNodeDefinitionPortGenerator<TProject>;
    private readonly mPreviewGenerator: PotatnoNodeDefinitionPreviewGenerator | null;

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
     * Preview configuration for this node type.
     */
    public get preview(): PotatnoNodeDefinitionPreviewGenerator | null {
        return this.mPreviewGenerator;
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
        this.mPreviewGenerator = pParameters.generators.preview ?? null;

        // Set regions with default empty arrays if not provided.
        this.mRegions = {
            add: pParameters.regions?.add ?? new Array<string>(),
            allows: pParameters.regions?.allows ?? new Array<string>(),
            requires: pParameters.regions?.requires ?? new Array<string>(),
        };
    }
}

type PotatnoNodeDefinitionConstructorParameter<TProject extends PotatnoProject<any>> = {
    id: string;
    label: string;
    category: string;
    regions?: Partial<PotatnoNodeDefinitionRegions> | null;
    generators: {
        ports: PotatnoNodeDefinitionPortGenerator<TProject>;
        code: PotatnoNodeDefinitionCodeGenerator;
        preview?: PotatnoNodeDefinitionPreviewGenerator | null;
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

export type PotatnoNodeDefinitionPortGenerator<TProject extends PotatnoProject<any>> = {
    inputs: PotatnoNodeDefinitionPortGeneratorFunction<TProject>;
    outputs: PotatnoNodeDefinitionPortGeneratorFunction<TProject>;
};

export type PotatnoNodeDefinitionPortGeneratorFunction<TProject extends PotatnoProject<any>> = (pAddPort: (pConfiguration: PotatnoPortDefinitionConfiguration<TProject>) => void) => void;

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

export type PotatnoNodeDefinitionCodeGenerator = (pContext: PotatnoNodeDefinitionGeneratorData) => string;

export type PotatnoNodeDefinitionGeneratorData = {
    /**
     *  Input port valueIds keyed by port name. 
     */
    readonly inputs: Record<string, PotatnoCodeGeneratorPort>;

    /** 
     * Output port valueIds keyed by port name. 
     */
    readonly outputs: Record<string, PotatnoCodeGeneratorPort>;
};

/*
 * Preview generator.
 */

export type PotatnoNodeDefinitionPreviewGenerator = {
    /**
     * Generator function that produces an HTMLElement to be used as a live preview for a node instance.
     * 
     * @returns an element that the node gets append as preview.
     */
    readonly generate: () => Element;

    /**
     * Update function that updates the preview element based on the current input values and output values of the node instance.
     * 
     * @param pElement - The preview element to be updated.
     * @param pPreviewInputData - The example preview input data for the entry point, which can be used to run the intermediate code and update the preview element accordingly.
     * @param pIntermediateCodeOutput - The output of the intermediate code execution, which can be used to update the preview element accordingly.
     */
    readonly update: (pElement: Element, pContext: PotatnoNodeDefinitionGeneratorData, pFunction: PotatnoCodeFunction, pPreviewInputData: any, pIntermediateCodeOutput: string) => void;
};