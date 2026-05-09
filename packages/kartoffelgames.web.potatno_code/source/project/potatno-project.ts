import { PotatnoNodeDefinition } from "./node_definition/potatno-node-definition.ts";
import { PotatnoStaticNodeDefinition } from "./node_definition/potatno-static-node-definition.ts";
import { FlowConjunctionNodeDefinition } from "./node_definition/potatno-flow-conjunction-node-definition.ts";
import { ValueConjunctionNodeDefinition } from "./node_definition/potatno-value-conjunction-node-definition.ts";
import type { PotatnoFunctionDefinition } from './potatno-function-definition.ts';
import { PotatnoProjectTypesDefinition } from "./potatno-project-types-definition.ts";

/**
 * Project-level configuration for a PotatnoCode editor instance.
 * Contains all registered node types, main function definitions, imports,
 * and callback configurations. Does not hold document state.
 */
export class PotatnoProject<TProjectType extends PotatnoProjectTypesDefinition<string> = PotatnoProjectTypesDefinition<string>> {
    /**
     * Create a new PotatnoProject with the given configuration.
     *
     * @param pParameter - Project configuration including type definitions and entry point.
     */
    public static new<TProjectType extends PotatnoProjectTypesDefinition<string>>(pParameter: PotatnoProjectConstructorParameter<TProjectType>): PotatnoProject<TProjectType> {
        return new PotatnoProject(pParameter);
    }

    private readonly mEntryPoint: PotatnoFunctionDefinition<this>;
    private readonly mImports: Array<PotatnoProjectImportDefinition<this>>;
    private readonly mNodeDefinitions: Map<string, PotatnoNodeDefinition<this>>;
    private readonly mTypes: TProjectType;
    private readonly mUserFunctions: Map<string, PotatnoFunctionDefinition<this>>;

    /**
     * Get the registered entry point definition.
     * The main entry point to start the code generation from.
     */
    public get entryPoint(): PotatnoFunctionDefinition<this> {
        return this.mEntryPoint;
    }

    /**
     * Get the list of registered import definitions.
     */
    public get imports(): ReadonlyArray<PotatnoProjectImportDefinition<this>> {
        return this.mImports;
    }

    /**
     * Get the map of registered node definitions keyed by node definitions id.
     */
    public get nodeDefinitions(): ReadonlyArray<PotatnoNodeDefinition<this>> {
        return Array.from(this.mNodeDefinitions.values());
    }

    /**
     * Get the project type configuration, containing the valid type identifiers and their default values.
     */
    public get types(): TProjectType {
        return this.mTypes;
    }

    /**
     * Get the map of registered user function definitions.
     */
    public get userFunctions(): ReadonlyMap<string, PotatnoFunctionDefinition<this>> {
        return this.mUserFunctions;
    }

    /**
     * Create a new editor configuration with default values.
     */
    protected constructor(pParameter: PotatnoProjectConstructorParameter<TProjectType>) {
        // Init parameter.
        this.mEntryPoint = pParameter.entryPoint as unknown as PotatnoFunctionDefinition<this>;
        this.mTypes = pParameter.types;

        // Initialize empty arrays and maps for project definitions.
        this.mNodeDefinitions = new Map<string, PotatnoStaticNodeDefinition<this>>();
        this.mImports = new Array<PotatnoProjectImportDefinition<this>>();
        this.mUserFunctions = new Map<string, PotatnoFunctionDefinition<this>>();

        // Built-in conjunction pass-through nodes are always available in every project.
        this.addNodeDefinition(FlowConjunctionNodeDefinition.newConjunctionNode());
        this.addNodeDefinition(ValueConjunctionNodeDefinition.newConjunctionNode());
    }

    /**
     * Register an import definition.
     *
     * @param pDefinition - The import definition to register. Must have a unique label and contain valid node definitions.
     */
    public addImport(pDefinition: PotatnoProjectImportDefinition<this>): void {
        this.mImports.push(pDefinition);
    }

    /**
     * Register a node type definition.
     *
     * @param pDefinition - The node definition to register. Must have a unique id and use valid type identifiers for its ports.
     */
    public addNodeDefinition(pDefinition: PotatnoStaticNodeDefinition<this>): void {
        this.mNodeDefinitions.set(pDefinition.id, pDefinition);
    }

    /**
     * Register a user function definition. User functions are custom functions defined by the user that can be used as nodes in the editor.
     *
     * @param pDefinition - The function definition to register.
     */
    public addUserFunction(pDefinition: PotatnoFunctionDefinition<this>): void {
        this.mUserFunctions.set(pDefinition.id, pDefinition);
    }

    /**
     * Get a function definition by its id. Checks both the entry point and user functions.
     *
     * @param pId - The function definition id to look up.
     */
    public getFunction(pId: string): PotatnoFunctionDefinition<this> | undefined {
        if (this.mEntryPoint.id === pId) {
            return this.mEntryPoint;
        }

        return this.mUserFunctions.get(pId);
    }
}

type PotatnoProjectConstructorParameter<TProjectType extends PotatnoProjectTypesDefinition<string>> = {
    types: TProjectType;
    entryPoint: PotatnoFunctionDefinition<PotatnoProject<NoInfer<TProjectType>>>;
};

/**
 * Definition of an import group. When a function enables this import,
 * the contained node definitions become available in that function's node library.
 */
export type PotatnoProjectImportDefinition<TProject extends PotatnoProject<any>> = {
    /**
     * Unique identifier of the import group.
     */
    readonly id: string;

    /**
     * Display label of the import group.
     */
    readonly label: string;

    /**
     * Node definitions that become available when this import is enabled.
     */
    readonly nodes: Array<PotatnoStaticNodeDefinition<TProject>>;
};
