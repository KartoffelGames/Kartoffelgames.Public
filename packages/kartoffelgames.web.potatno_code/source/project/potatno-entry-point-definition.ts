import { PotatnoProjectNodeDefinition } from "./potatno-node-definition.ts";
import { PotatnoProject } from "./potatno-project.ts";

/**
 * Definition of a static module (fixed entry point) for the editor.
 * Inputs and outputs are defined as Record<name, type> for type safety.
 */
export class PotatnoEntryPointDefinition<TTypes extends string> {
    private readonly mProject: PotatnoProject<TTypes>;
    private readonly mId: string;
    private readonly mLabel: string;
    private readonly mStatics: PotatnoModuleDefinitionStaticSettings;
    private readonly mNodes: PotatnoModuleDefinitionNodes<TTypes> ;

    /**
     * Unique id for this entry point definition.
     */
    public get id(): string {
        return this.mId;
    }

    /**
     * List of entry-point-exclusive nodes.
     */
    public get nodes(): Readonly<PotatnoModuleDefinitionNodes<TTypes>> {
        return this.mNodes;
    }

    /**
     * Reference to the project this entry point definition belongs to.
     */
    public get project(): PotatnoProject<TTypes> {
        return this.mProject;
    }

    /** 
     * Display label of the entry point.
     * */
    public get label(): string {
        return this.mLabel;
    }

    /**
     * Static settings for this entry point definition, determining which static nodes are generated.
     */
    public get statics(): Readonly<PotatnoModuleDefinitionStaticSettings> {
        return this.mStatics;
    }

    /**
     * Constructor for a new entry point definition.
     * 
     * @param pProject - Reference to the project this entry point belongs to.
     * @param pParameters - Parameters defining the entry point's id, label, static nodes, dynamic nodes, and static settings.
     */
    public constructor(pProject: PotatnoProject<TTypes>, pParameters: PotatnoModuleDefinitionConstructorParameter<TTypes>) {
        this.mProject = pProject;

        // Set id and label. Label defaults to id if not provided.
        this.mId = pParameters.id;
        this.mLabel = pParameters.label ?? pParameters.id;

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

type PotatnoModuleDefinitionConstructorParameter<TTypes extends string> = {
    label?: string;
    id: string;
    statics: Partial<PotatnoModuleDefinitionStaticSettings>;
    nodes?: Partial<PotatnoModuleDefinitionNodes<TTypes>>;
};

type PotatnoModuleDefinitionNodes<TTypes extends string> = {
    static: Array<PotatnoProjectNodeDefinition<TTypes>>;
    dynamic: Array<PotatnoProjectNodeDefinition<TTypes>>;
};

export type PotatnoModuleDefinitionStaticSettings = {
    imports: boolean;
    inputs: boolean;
    outputs: boolean;
};
