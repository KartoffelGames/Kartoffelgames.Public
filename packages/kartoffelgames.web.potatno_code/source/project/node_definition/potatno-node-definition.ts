import { PotatnoCodeFunction } from "../../parser/potatno-code-function.ts";
import { PotatnoPortDefinition, PotatnoPortDefinitionConfiguration } from "../potatno-port-definition.ts";
import { PotatnoProject } from "../potatno-project.ts";

/**
 * Potatno node definition that changes dynamically based on the provided context.
 */
export abstract class PotatnoNodeDefinition<TProject extends PotatnoProject<any>> {
    private readonly mId: string;
    private readonly mCategory: string;
    private readonly mLabel: string;
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
        // Reads port configuration and converts it into PotatnoPortDefinition.
        return this.mPortProvider.inputs().map((pConfiguration) => {
            return PotatnoPortDefinition.new<TProject>(pConfiguration);
        });
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
        return this.mPortProvider.outputs().map((pConfiguration) => {
            return PotatnoPortDefinition.new<TProject>(pConfiguration);
        });
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
    }
}

type PotatnoNodeDefinitionConstructorParameter<TProject extends PotatnoProject<any>> = {
    id: string;
    label: string;
    category: string;
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
    add: Array<string>;

    /**
     * Regions other nodes requires to connect to this node.
     * Exactly the regions must be present. More or less regions will result in a validation error.
     */
    requires: Array<string>;
};

/*
 * Port generator.
 */

export type PotatnoNodeDefinitionPortGenerator<TProject extends PotatnoProject<any>> = {
    inputs: () => Array<PotatnoPortDefinitionConfiguration<TProject>>;
    outputs: () => Array<PotatnoPortDefinitionConfiguration<TProject>>;
};

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
     * This can be used to create live, data-driven previews that react to changes in the node's inputs and outputs.
     * 
     * @param pElement - The preview element to be updated.
     * @param pPreviewInputData - The example preview input data for the entry point, which can be used to run the intermediate code and update the preview element accordingly.
     * @param pIntermediateCodeOutput - The output of the intermediate code execution, which can be used to update the preview element accordingly.
     */
    readonly update: (pElement: Element, pContext: PotatnoNodeDefinitionGeneratorData, pFunction: PotatnoCodeFunction, pPreviewInputData: any, pIntermediateCodeOutput: string) => void;
};