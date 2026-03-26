import type { PotatnoCodeFunction } from './potatno-code-function.ts';
import type { PotatnoGlobalPortDefinition } from './potatno-global-port-definition.ts';
import type { PotatnoMainFunctionDefinition } from './potatno-main-function-definition.ts';
import { PotatnoProjectNodeDefinition, PotatnoProjectNodeDefinitionPorts } from "./potatno-node-definition.ts";

/**
 * Project-level configuration for a PotatnoCode editor instance.
 * Contains all registered node types, main function definitions, imports,
 * and callback configurations. Does not hold document state.
 */
export class PotatnoProject {
    private mCommentToken: string;
    private mCreatePreview: ((container: HTMLElement) => void) | null;
    private mFunctionCodeGenerator: ((func: PotatnoCodeFunction) => string) | null;
    private readonly mGlobalInputs: Array<PotatnoGlobalPortDefinition>;
    private readonly mGlobalOutputs: Array<PotatnoGlobalPortDefinition>;
    private readonly mImports: Array<PotatnoImportDefinition<string, string>>;
    private readonly mMainFunctions: Array<PotatnoMainFunctionDefinition>;
    private readonly mNodeDefinitions: Map<string, PotatnoProjectNodeDefinition>;
    private mUpdatePreview: ((code: string) => void) | null;
    private mValidTypes: Set<string>;

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
    public get imports(): ReadonlyArray<PotatnoImportDefinition<string, string>> {
        return this.mImports;
    }

    /**
     * Get the list of registered main function definitions.
     */
    public get mainFunctions(): ReadonlyArray<PotatnoMainFunctionDefinition> {
        return this.mMainFunctions;
    }

    /**
     * Get the map of registered node definitions keyed by name.
     */
    public get nodeDefinitions(): ReadonlyMap<string, PotatnoProjectNodeDefinition> {
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
    public constructor() {
        this.mCommentToken = '//';
        this.mNodeDefinitions = new Map<string, PotatnoProjectNodeDefinition>();
        this.mMainFunctions = new Array<PotatnoMainFunctionDefinition>();
        this.mImports = new Array<PotatnoImportDefinition>();
        this.mGlobalInputs = new Array<PotatnoGlobalPortDefinition>();
        this.mGlobalOutputs = new Array<PotatnoGlobalPortDefinition>();
        this.mCreatePreview = null;
        this.mUpdatePreview = null;
        this.mFunctionCodeGenerator = null;
        this.mValidTypes = new Set<string>();
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
    public addImport(pDefinition: PotatnoImportDefinition): void {
        this.mImports.push(pDefinition);
    }

    /**
     * Register a main function definition.
     */
    public addMainFunction(pDefinition: PotatnoMainFunctionDefinition): void {
        this.mMainFunctions.push(pDefinition);
    }

    /**
     * Register a node type definition.
     */
    public addNodeDefinition<TInputKeys extends string, TOutputKeys extends string, TInputs extends PotatnoProjectNodeDefinitionPorts<TInputKeys>, TOutputs extends PotatnoProjectNodeDefinitionPorts<TOutputKeys>>(pDefinition: PotatnoProjectNodeDefinition<TInputKeys, TInputs, TOutputKeys, TOutputs>): void {
        this.mNodeDefinitions.set(pDefinition.name, pDefinition);
    }

    /**
     * Set the comment token used for metadata comments in generated code.
     */
    public setCommentToken(pToken: string): void {
        this.mCommentToken = pToken;
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
     * Add a valid type identifier that can be used by node port definitions.
     * 
     * @param pTypeName - The unique string identifier of the type. 
     */
    public addType(pTypeName: string): void {
        this.mValidTypes.add(pTypeName);
    }

    /**
     * Check if a type identifier is registered as valid in the project.
     * 
     * @param pTypeName - The type identifier to check.
     * 
     * @returns True if the type is registered, false otherwise. 
     */
    public hasType(pTypeName: string): boolean {
        return this.mValidTypes.has(pTypeName);
    }
}

/**
 * Definition of an import group. When a function enables this import,
 * the contained node definitions become available in that function's node library.
 */
export interface PotatnoImportDefinition<TInputKeys extends string, TOutputKeys extends string> {
    /** Display name of the import group. */
    readonly name: string;
    /** Node definitions that become available when this import is enabled. */
    readonly nodes: Array<PotatnoProjectNodeDefinition<TInputKeys, TOutputKeys>>;
}
