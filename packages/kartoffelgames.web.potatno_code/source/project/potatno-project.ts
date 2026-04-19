import type { PotatnoFunctionDefinition } from './potatno-function-definition.ts';
import { PotatnoNodeDefinition, type PotatnoNodeDefinitionPorts } from "./potatno-node-definition.ts";

/**
 * Project-level configuration for a PotatnoCode editor instance.
 * Contains all registered node types, main function definitions, imports,
 * and callback configurations. Does not hold document state.
 */
export class PotatnoProject<TTypes extends PotatnoProjectTypes = PotatnoProjectTypes> {
    private readonly mCommentToken: string;
    
    private readonly mImports: Array<PotatnoProjectImportDefinition<TTypes>>;
    private readonly mEntryPoint: PotatnoFunctionDefinition<TTypes>;
    private readonly mNodeDefinitions: Map<string, PotatnoNodeDefinition<TTypes, any, any>>;
    private mValidTypes: Map<keyof TTypes, TTypes[keyof TTypes]>;

    /**
     * Get the comment token used for metadata comments in generated code.
     */
    public get commentToken(): string {
        return this.mCommentToken;
    }

    /**
     * Get the list of registered import definitions.
     */
    public get imports(): ReadonlyArray<PotatnoProjectImportDefinition<TTypes>> {
        return this.mImports;
    }

    /**
     * Get the registered entry point definition.
     * The main entry point to start the code generation from.
     */
    public get entryPoint(): PotatnoFunctionDefinition<TTypes> {
        return this.mEntryPoint;
    }

    /**
     * Get the map of registered node definitions keyed by node definitions id.
     */
    public get nodeDefinitions(): ReadonlyMap<string, PotatnoNodeDefinition<TTypes>> {
        return this.mNodeDefinitions;
    }

    /**
     * Create a new editor configuration with default values.
     */
    public constructor(pParameter: PotatnoProjectConstructorParameter<TTypes>) {
        this.mCommentToken = pParameter.commentToken;

        // Create a map of valid type identifiers for quick lookup when validating node definitions and connections.
        this.mValidTypes = new Map<keyof TTypes, TTypes[keyof TTypes]>();
        for (const [lTypeName, lDefaultValue] of Object.entries(pParameter.types)) {
            this.mValidTypes.set(lTypeName as keyof TTypes, lDefaultValue);
        }

        // Initialize empty arrays and maps for project definitions.
        this.mNodeDefinitions = new Map<string, PotatnoNodeDefinition<TTypes>>();
        this.mImports = new Array<PotatnoProjectImportDefinition<TTypes>>();
        this.mEntryPoint = pParameter.entryPoint;
    }

    /**
     * Register an import definition.
     */
    public addImport(pDefinition: PotatnoProjectImportDefinition<TTypes>): void {
        this.mImports.push(pDefinition);
    }

    /**
     * Register a node type definition.
     */
    public addNodeDefinition<TInputs extends PotatnoNodeDefinitionPorts<TTypes>, TOutputs extends PotatnoNodeDefinitionPorts<TTypes>, TPreviewElement extends Element>(pDefinition: PotatnoNodeDefinition<TTypes, TInputs, TOutputs, TPreviewElement>): void {
        this.mNodeDefinitions.set(pDefinition.id, pDefinition);
    }

    /**
     * Check if a type identifier is registered as valid in the project.
     *
     * @param pTypeName - The type identifier to check.
     *
     * @returns True if the type is registered, false otherwise.
     */
    public hasType(pTypeName: keyof TTypes): boolean {
        return this.mValidTypes.has(pTypeName);
    }
}

type PotatnoProjectConstructorParameter<TTypes extends PotatnoProjectTypes> = {
    types: TTypes;
    commentToken: string;
    entryPoint: PotatnoFunctionDefinition<TTypes>;
};

/**
 * Potatno project valid types.
 * Defined by a type name and a default value of that type.
 */
export type PotatnoProjectTypes<TTypeName extends string = string, TType = any> = {
    [typeName in TTypeName]: TType;
};

/**
 * Definition of an import group. When a function enables this import,
 * the contained node definitions become available in that function's node library.
 */
export type PotatnoProjectImportDefinition<TType extends PotatnoProjectTypes> = {
    /** 
     * Display name of the import group. 
     */
    readonly name: string;

    /**
     * Node definitions that become available when this import is enabled. 
     */
    readonly nodes: Array<PotatnoNodeDefinition<TType>>;
};