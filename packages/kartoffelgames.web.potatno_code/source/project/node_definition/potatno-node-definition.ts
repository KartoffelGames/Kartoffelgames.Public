import { PotatnoCodeFunction } from "../../parser/potatno-code-function.ts";
import { PotatnoPortDefinition, PotatnoPortDefinitionConfiguration } from "../potatno-port-definition.ts";
import { PotatnoProjectType } from "../potatno-project-types-definition.ts";

/**
 * Potatno node definition that changes dynamically based on the provided context.
 */
export class PotatnoNodeDefinition<TTypes extends PotatnoProjectType> {
    private readonly mId: string;
    private readonly mCategory: string;
    private readonly mLabel: string;
    private readonly mCodeGenerator: PotatnoNodeDefinitionCodeGenerator;
    private readonly mPortProvider: PotatnoNodeDefinitionPortGenerator<TTypes>;
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
    public get inputs(): ReadonlyArray<PotatnoPortDefinition<TTypes>> {
        // Reads port configuration and converts it into PotatnoPortDefinition.
        return this.mPortProvider.inputs().map((pConfiguration) => {
            return new PotatnoPortDefinition<TTypes>(pConfiguration);
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
    public get outputs(): ReadonlyArray<PotatnoPortDefinition<TTypes>> {
        // Reads port configuration and converts it into PotatnoPortDefinition.
        return this.mPortProvider.outputs().map((pConfiguration) => {
            return new PotatnoPortDefinition<TTypes>(pConfiguration);
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
     * Constructor.
     * 
     * @param pParameters - Constructor parameters. 
     */
    public constructor(pParameters: PotatnoNodeDefinitionConstructorParameter<TTypes>) {
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

type PotatnoNodeDefinitionConstructorParameter<TTypes extends PotatnoProjectType> = {
    id: string;
    label: string;
    category: string;
    generators: {
        ports: PotatnoNodeDefinitionPortGenerator<TTypes>;
        code: PotatnoNodeDefinitionCodeGenerator;
        preview?: PotatnoNodeDefinitionPreviewGenerator | null;
    };
};

/*
 * Port generator.
 */

export type PotatnoNodeDefinitionPortGenerator<TTypes extends PotatnoProjectType> = {
    inputs: () => Array<PotatnoPortDefinitionConfiguration<TTypes>>;
    outputs: () => Array<PotatnoPortDefinitionConfiguration<TTypes>>;
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