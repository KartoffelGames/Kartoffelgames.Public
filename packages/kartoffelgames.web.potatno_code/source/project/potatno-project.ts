import { NodeCategory } from "../node/node-category.enum.ts";
import type { PotatnoCodeFunction } from './potatno-code-function.ts';
import type { PotatnoGlobalPortDefinition } from './potatno-global-port-definition.ts';
import type { PotatnoImportDefinition } from './potatno-import-definition.ts';
import type { PotatnoMainFunctionDefinition } from './potatno-main-function-definition.ts';

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
    private readonly mImports: Array<PotatnoImportDefinition>;
    private readonly mMainFunctions: Array<PotatnoMainFunctionDefinition>;
    private readonly mNodeDefinitions: Map<string, PotatnoProjectNodeDefinition>;
    private mUpdatePreview: ((code: string) => void) | null;

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
    public get imports(): ReadonlyArray<PotatnoImportDefinition> {
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
    public addNodeDefinition<TInputs extends PotatnoProjectNodePorts, TOutputs extends PotatnoProjectNodePorts>(pDefinition: PotatnoProjectNodeDefinition<TInputs, TOutputs>): void {
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
}

/**
 * Typed context passed to the node code generator callback.
 * All maps are plain JS objects for type safety and easy destructuring.
 */
export interface NodeCodeContext<TInputs extends PotatnoProjectNodePorts, TOutputs extends PotatnoProjectNodePorts> {
    /** Input port valueIds keyed by port name. */
    readonly inputs: Readonly<Record<keyof TInputs, string>>;
    /** Output port valueIds keyed by port name. */
    readonly outputs: Readonly<Record<keyof TOutputs, string>>;
    /** Property values keyed by property name. */
    readonly properties: Readonly<Record<string, string>>;
    /** Body code blocks keyed by flow output name (for flow nodes). */
    readonly body: Readonly<Record<string, string>>;
}

/**
 * Definition of a node type that can be registered with the editor project.
 * Uses a {@link codeGenerator} callback that receives a typed {@link NodeCodeContext}.
 */
export interface PotatnoProjectNodeDefinition<TInputs extends PotatnoProjectNodePorts, TOutputs extends PotatnoProjectNodePorts> {
    /** Unique display name for this node type. */
    readonly name: string;
    /** Category classification determining which subclass is instantiated for code generation. */
    readonly category: NodeCategory;
    /** Data input port definitions. */
    readonly inputs: TInputs;
    /** Data output port definitions. */
    readonly outputs: TOutputs;
    /** Flow input port names. Only used by flow-category nodes. */
    readonly flowInputs?: Array<string>;
    /** Flow output port names. Only used by flow-category nodes. */
    readonly flowOutputs?: Array<string>;
    /** Code generator callback that produces the code string from a typed context. */
    readonly codeGenerator?: (pContext: NodeCodeContext<TInputs, TOutputs>) => string;
}

/**
 * Definition of a port type used when registering node definitions.
 */
export interface PotatnoPortType {
    /** Data type identifier for the port. */
    readonly type: string;
}


type PotatnoProjectNodePorts = { [portName: string]: PotatnoPortType };