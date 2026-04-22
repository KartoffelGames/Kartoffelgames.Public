import type { PotatnoFunctionDefinition } from './potatno-function-definition.ts';
import { PotatnoNodeDefinition, type PotatnoNodeDefinitionPorts } from "./potatno-node-definition.ts";

/**
 * Project-level configuration for a PotatnoCode editor instance.
 * Contains all registered node types, main function definitions, imports,
 * and callback configurations. Does not hold document state.
 */
export class PotatnoProject<TProjectType extends PotatnoProjectType> {
    private readonly mEntryPoint: PotatnoFunctionDefinition<TProjectType>;
    private readonly mImports: Array<PotatnoProjectImportDefinition<TProjectType>>;
    private readonly mNodeDefinitions: Map<string, PotatnoNodeDefinition<TProjectType, any, any>>;
    private readonly mValidTypes: Map<TProjectType, PotatnoProjectTypeDefinition<TProjectType>>;
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
     * Get the map of registered user function definitions.
     */
    public get userFunctions(): ReadonlyMap<string, PotatnoFunctionDefinition<TProjectType>> {
        return this.mUserFunctions;
    }

    /**
     * Create a new editor configuration with default values.
     */
    public constructor(pParameter: PotatnoProjectConstructorParameter<TProjectType>) {
        // Create a map of valid type identifiers for quick lookup when validating node definitions and connections.
        this.mValidTypes = new Map<TProjectType, PotatnoProjectTypeDefinition<TProjectType>>();
        for (const [lTypeName, lDefaultValue] of Object.entries(pParameter.types as PotatnoProjectTypeDefinitions<string>)) {
            this.mValidTypes.set(lTypeName as TProjectType, {
                name: lTypeName as TProjectType,
                defaultValue: lDefaultValue.defaultValue
            });
        }

        // Initialize empty arrays and maps for project definitions.
        this.mNodeDefinitions = new Map<string, PotatnoNodeDefinition<TProjectType>>();
        this.mImports = new Array<PotatnoProjectImportDefinition<TProjectType>>();
        this.mEntryPoint = pParameter.entryPoint;
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

    /**
     * Check if a type identifier is registered as valid in the project.
     *
     * @param pTypeName - The type identifier to check.
     *
     * @returns True if the type is registered, false otherwise.
     */
    public hasType(pTypeName: TProjectType): boolean {
        return this.mValidTypes.has(pTypeName);
    }

    /**
     * Get the project type definition for a given type identifier.
     * 
     * @param pTypeName - The type identifier to check.
     * 
     * @returns The project type definition for the given type identifier. 
     * 
     * @throws Error if the type identifier is not registered in the project.
     */
    public getType<TTypeName extends TProjectType>(pTypeName: TTypeName): PotatnoProjectTypeDefinition<TTypeName> {
        if (!this.mValidTypes.has(pTypeName)) {
            throw new Error(`Type '${pTypeName}' is not registered in the project.`);
        }

        return this.mValidTypes.get(pTypeName)! as PotatnoProjectTypeDefinition<TTypeName>;
    }
}

type PotatnoProjectConstructorParameter<TTypes extends PotatnoProjectType> = {
    types: PotatnoProjectTypeDefinitions<TTypes>;
    entryPoint: PotatnoFunctionDefinition<TTypes>;
};

/**
 * Potatno project valid types.
 * Defined by a type name and a default value of that type.
 */
export type PotatnoProjectTypeDefinitions<TTypeName extends PotatnoProjectType> = Record<TTypeName, {
    defaultValue: any;
    // TODO: A convert string to type.
    // TODO. A input element definition for this type so the editor can generate input fields for it.
    // TODO: A optional subtype definition for example for vector types.
}>;

export type PotatnoProjectTypeDefinition<TTypeName extends PotatnoProjectType> = {
    name: TTypeName;
    defaultValue: any;
};

export type PotatnoProjectType = string;

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