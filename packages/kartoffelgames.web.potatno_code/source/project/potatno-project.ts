import type { PotatnoFunctionDefinition } from './potatno-function-definition.ts';
import { PotatnoNodeDefinition, type PotatnoNodeDefinitionPorts } from "./potatno-node-definition.ts";
import { PotatnoProjectType, PotatnoProjectTypesDefinition } from "./potatno-project-types-definition.ts";

/**
 * Project-level configuration for a PotatnoCode editor instance.
 * Contains all registered node types, main function definitions, imports,
 * and callback configurations. Does not hold document state.
 */
export class PotatnoProject<TProjectType extends PotatnoProjectType> {
    private readonly mEntryPoint: PotatnoFunctionDefinition<TProjectType>;
    private readonly mImports: Array<PotatnoProjectImportDefinition<TProjectType>>;
    private readonly mNodeDefinitions: Map<string, PotatnoNodeDefinition<TProjectType, any, any>>;
    private readonly mTypes: PotatnoProjectTypesDefinition<TProjectType>;
    private readonly mUserFunctions: Map<string, PotatnoFunctionDefinition<TProjectType>>;

    /**
     * Get the registered entry point definition.
     * The main entry point to start the code generation from.
     */
    public get entryPoint(): PotatnoFunctionDefinition<TProjectType> {
        return this.mEntryPoint;
    }

    /**
     * Get the list of registered import definitions.
     */
    public get imports(): ReadonlyArray<PotatnoProjectImportDefinition<TProjectType>> {
        return this.mImports;
    }

    /**
     * Get the map of registered node definitions keyed by node definitions id.
     */
    public get nodeDefinitions(): ReadonlyMap<string, PotatnoNodeDefinition<TProjectType>> {
        return this.mNodeDefinitions;
    }

    /**
     * Get the project type configuration, containing the valid type identifiers and their default values.
     */
    public get types(): PotatnoProjectTypesDefinition<TProjectType> {
        return this.mTypes;
    }

    /**
     * Get the map of registered user function definitions.
     */
    public get userFunctions(): ReadonlyMap<string, PotatnoFunctionDefinition<TProjectType>> {
        return this.mUserFunctions;
    }

    /**
     * Create a new editor configuration with default values.
     */
    public constructor(pParameter: PotatnoProjectConstructorParameter<TProjectType>) {
        // Init parameter.
        this.mEntryPoint = pParameter.entryPoint;
        this.mTypes = pParameter.types;
        
        // Initialize empty arrays and maps for project definitions.
        this.mNodeDefinitions = new Map<string, PotatnoNodeDefinition<TProjectType>>();
        this.mImports = new Array<PotatnoProjectImportDefinition<TProjectType>>();   
        this.mUserFunctions = new Map<string, PotatnoFunctionDefinition<TProjectType>>();
    }

    /**
     * Register an import definition.
     * 
     * @param pDefinition - The import definition to register. Must have a unique name and contain valid node definitions.
     */
    public addImport(pDefinition: PotatnoProjectImportDefinition<TProjectType>): void {
        this.mImports.push(pDefinition);
    }

    /**
     * Register a node type definition.
     * 
     * @param pDefinition - The node definition to register. Must have a unique id and use valid type identifiers for its ports.
     */
    public addNodeDefinition<TInputs extends PotatnoNodeDefinitionPorts<TProjectType>, TOutputs extends PotatnoNodeDefinitionPorts<TProjectType>, TPreviewElement extends Element>(pDefinition: PotatnoNodeDefinition<TProjectType, TInputs, TOutputs, TPreviewElement>): void {
        this.mNodeDefinitions.set(pDefinition.id, pDefinition);
    }

    /**
     * Register a user function definition. User functions are custom functions defined by the user that can be used as nodes in the editor.
     * 
     * @param pDefinition - The function definition to register. 
     */
    public addUserFunction(pDefinition: PotatnoFunctionDefinition<TProjectType>): void {
        this.mUserFunctions.set(pDefinition.id, pDefinition);
    }
}

type PotatnoProjectConstructorParameter<TTypes extends PotatnoProjectType> = {
    types: PotatnoProjectTypesDefinition<TTypes>;
    entryPoint: PotatnoFunctionDefinition<TTypes>;
};

/**
 * Definition of an import group. When a function enables this import,
 * the contained node definitions become available in that function's node library.
 */
export type PotatnoProjectImportDefinition<TType extends PotatnoProjectType> = {
    /** 
     * Display name of the import group. 
     */
    readonly name: string;

    /**
     * Node definitions that become available when this import is enabled. 
     */
    readonly nodes: Array<PotatnoNodeDefinition<TType>>;
};