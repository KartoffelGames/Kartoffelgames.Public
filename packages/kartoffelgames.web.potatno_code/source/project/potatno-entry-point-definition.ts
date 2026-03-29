import { PotatnoNodeDefinition } from "./potatno-node-definition.ts";
import { PotatnoProject, PotatnoProjectTypes } from "./potatno-project.ts";

/**
 * Definition of a entry point blueprint.
 * Of of these blueprints eighter the main entry point or secondary user created entry points can be instantiated in the editor.
 */
export class PotatnoEntryPointDefinition<TTypes extends PotatnoProjectTypes = PotatnoProjectTypes> {
    /**
     * Factory method to create a new entry point definition.
     * 
     * @param pParameters - Constructor parameters for the entry point definition, including id, static node definitions, dynamic node definitions, and static settings.
     * 
     * @returns The created PotatnoEntryPointDefinition instance. 
     */
    public static create<TTypes extends PotatnoProjectTypes = PotatnoProjectTypes>(pParameters: PotatnoEntryPointDefinitionConstructorParameter<TTypes>): PotatnoEntryPointDefinition<TTypes> {
        return new PotatnoEntryPointDefinition(pParameters);
    }

    private readonly mId: string;
    private readonly mStatics: PotatnoEntryPointDefinitionStaticSettings;
    private readonly mNodes: PotatnoEntryPointDefinitionNodes<TTypes>;

    /**
     * Unique id for this entry point definition.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * List of entry-point-exclusive nodes.
     */
    public get nodes(): Readonly<PotatnoEntryPointDefinitionNodes<TTypes>> {
        return this.mNodes;
    }

    /**
     * Static settings for this entry point definition, determining which static nodes are generated.
     */
    public get statics(): Readonly<PotatnoEntryPointDefinitionStaticSettings> {
        return this.mStatics;
    }

    /**
     * Constructor for a new entry point definition.
     * 
     * @param pParameters - Parameters defining the entry point's id, label, static nodes, dynamic nodes, and static settings.
     */
    private constructor(pParameters: PotatnoEntryPointDefinitionConstructorParameter<TTypes>) {
        this.mId = pParameters.id;

        // Set exclusive nodes defined for this entry point that are preset in the editor.
        this.mNodes = {
            static: pParameters.nodes?.static ?? [],
            dynamic: pParameters.nodes?.dynamic ?? [],
        };

        // Set static settings, defaulting to false for all if not provided.
        this.mStatics = {
            imports: pParameters.statics.imports ?? false,
            inputs: pParameters.statics.inputs ?? false,
            outputs: pParameters.statics.outputs ?? false,
        };
    }
}

type PotatnoEntryPointDefinitionConstructorParameter<TTypes extends PotatnoProjectTypes> = {
    id: string;
    statics: Partial<PotatnoEntryPointDefinitionStaticSettings>;
    nodes?: Partial<PotatnoEntryPointDefinitionNodes<TTypes>>;
};

type PotatnoEntryPointDefinitionNodes<TTypes extends PotatnoProjectTypes> = {
    static: Array<PotatnoNodeDefinition<TTypes>>;
    dynamic: Array<PotatnoNodeDefinition<TTypes>>;
};

export type PotatnoEntryPointDefinitionStaticSettings = {
    imports: boolean;
    inputs: boolean;
    outputs: boolean;
};
