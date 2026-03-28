import type { PotatnoCodeFunction } from './potatno-code-function.ts';
import type { PotatnoGlobalPortDefinition } from './potatno-global-port-definition.ts';
import type { PotatnoEntryPointDefinition } from './potatno-entry-point-definition.ts';
import { PotatnoNodeDefinition, type PotatnoNodeDefinitionPorts } from "./potatno-node-definition.ts";

/**
 * Project-level configuration for a PotatnoCode editor instance.
 * Contains all registered node types, main function definitions, imports,
 * and callback configurations. Does not hold document state.
 */
export class PotatnoProject<TTypes extends PotatnoProjectTypes> {
    private readonly mCommentToken: string;
    private mCreatePreview: ((container: HTMLElement) => void) | null;
    private mFunctionCodeGenerator: ((func: PotatnoCodeFunction) => string) | null;
    private readonly mGlobalInputs: Array<PotatnoGlobalPortDefinition>;
    private readonly mGlobalOutputs: Array<PotatnoGlobalPortDefinition>;
    private readonly mImports: Array<PotatnoProjectImportDefinition<TTypes>>;
    private mEntryPoint: PotatnoEntryPointDefinition<TTypes> | null;
    private readonly mNodeDefinitions: Map<string, PotatnoNodeDefinition<TTypes, any, any>>;
    private mUpdatePreview: ((code: string) => void) | null;
    private mValidTypes: Map<keyof TTypes, TTypes[keyof TTypes]>;

    /**
     * Get the comment token used for metadata comments in generated code.
     */
    public get commentToken(): string {
        return this.mCommentToken;
    }

    /**
     * Get the callback that creates the initial preview DOM structure.
     */
    public get createPreview(): ((container: HTMLElement) => void) | null {
        return this.mCreatePreview;
    }

    /**
     * Get the function code generator callback.
     */
    public get functionCodeGenerator(): ((func: PotatnoCodeFunction) => string) | null {
        return this.mFunctionCodeGenerator;
    }

    /**
     * Get the list of registered global input definitions.
     */
    public get globalInputs(): ReadonlyArray<PotatnoGlobalPortDefinition> {
        return this.mGlobalInputs;
    }

    /**
     * Get the list of registered global output definitions.
     */
    public get globalOutputs(): ReadonlyArray<PotatnoGlobalPortDefinition> {
        return this.mGlobalOutputs;
    }

    /**
     * Whether a preview creation callback has been configured.
     */
    public get hasPreview(): boolean {
        return this.mCreatePreview !== null;
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
    public get entryPoint(): PotatnoEntryPointDefinition<TTypes> | null {
        return this.mEntryPoint;
    }

    /**
     * Get the map of registered node definitions keyed by node definitions id.
     */
    public get nodeDefinitions(): ReadonlyMap<string, PotatnoNodeDefinition<TTypes>> {
        return this.mNodeDefinitions;
    }

    /**
     * Get the callback that updates the preview with new generated code.
     */
    public get updatePreview(): ((code: string) => void) | null {
        return this.mUpdatePreview;
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

        this.mCreatePreview = null;
        this.mUpdatePreview = null;
        this.mFunctionCodeGenerator = null;
        this.mEntryPoint = null;

        // Initialize empty arrays and maps for project definitions.
        this.mNodeDefinitions = new Map<string, PotatnoNodeDefinition<TTypes>>();
        this.mImports = new Array<PotatnoProjectImportDefinition<TTypes>>();
        this.mGlobalInputs = new Array<PotatnoGlobalPortDefinition>();
        this.mGlobalOutputs = new Array<PotatnoGlobalPortDefinition>();
    }

    /**
     * Register a global input port definition.
     */
    public addGlobalInput(pDefinition: PotatnoGlobalPortDefinition): void {
        this.mGlobalInputs.push(pDefinition);
    }

    /**
     * Register a global output port definition.
     */
    public addGlobalOutput(pDefinition: PotatnoGlobalPortDefinition): void {
        this.mGlobalOutputs.push(pDefinition);
    }

    /**
     * Register an import definition.
     */
    public addImport(pDefinition: PotatnoProjectImportDefinition<TTypes>): void {
        this.mImports.push(pDefinition);
    }

    /**
     * Register an entry point definition.
     */
    public setEntryPoint(pDefinition: PotatnoEntryPointDefinition<TTypes>): void {
        this.mEntryPoint = pDefinition;
    }

    /**
     * Register a node type definition.
     */
    public addNodeDefinition<TInputs extends PotatnoNodeDefinitionPorts<TTypes>, TOutputs extends PotatnoNodeDefinitionPorts<TTypes>>(pDefinition: PotatnoNodeDefinition<TTypes, TInputs, TOutputs>): void {
        this.mNodeDefinitions.set(pDefinition.id, pDefinition);
    }


    /**
     * Set the function code generator callback.
     */
    public setFunctionCodeGenerator(pGenerator: (func: PotatnoCodeFunction) => string): void {
        this.mFunctionCodeGenerator = pGenerator;
    }

    /**
     * Set both preview callbacks: one for initial DOM creation and one for code updates.
     */
    public setPreview(pCreate: (container: HTMLElement) => void, pUpdate: (code: string) => void): void {
        this.mCreatePreview = pCreate;
        this.mUpdatePreview = pUpdate;
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