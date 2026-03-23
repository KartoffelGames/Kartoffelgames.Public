import type { PotatnoCodeFunction } from './potatno-code-function.ts';
import type { PotatnoGlobalValueDefinition } from './potatno-global-value-definition.ts';
import type { PotatnoMainFunctionDefinition } from './potatno-main-function-definition.ts';
import type { PotatnoNodeDefinition } from '../node/potatno-node-definition.ts';

/**
 * Full editor configuration holding all registered node types, functions, and callbacks.
 */
export class PotatnoEditorConfiguration {
    private mCommentToken: string;
    private mCreatePreview: ((container: HTMLElement) => void) | null;
    private mFunctionCodeGenerator: ((func: PotatnoCodeFunction) => string) | null;
    private readonly mGlobalValues: Array<PotatnoGlobalValueDefinition>;
    private readonly mMainFunctions: Array<PotatnoMainFunctionDefinition>;
    private readonly mNodeDefinitions: Map<string, PotatnoNodeDefinition>;
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
     * Set the callback that creates the initial preview DOM structure.
     */
    public set createPreview(pValue: ((container: HTMLElement) => void) | null) {
        this.mCreatePreview = pValue;
    }

    /**
     * Get the function code generator callback.
     */
    public get functionCodeGenerator(): ((func: PotatnoCodeFunction) => string) | null {
        return this.mFunctionCodeGenerator;
    }

    /**
     * Get the list of registered global value definitions.
     */
    public get globalValues(): ReadonlyArray<PotatnoGlobalValueDefinition> {
        return this.mGlobalValues;
    }

    /**
     * Whether a preview creation callback has been configured.
     */
    public get hasPreview(): boolean {
        return this.mCreatePreview !== null;
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
    public get nodeDefinitions(): ReadonlyMap<string, PotatnoNodeDefinition> {
        return this.mNodeDefinitions;
    }

    /**
     * Get the callback that updates the preview with new generated code.
     */
    public get updatePreview(): ((code: string) => void) | null {
        return this.mUpdatePreview;
    }

    /**
     * Set the callback that updates the preview with new generated code.
     */
    public set updatePreview(pValue: ((code: string) => void) | null) {
        this.mUpdatePreview = pValue;
    }

    /**
     * Create a new editor configuration with default values.
     */
    public constructor() {
        this.mCommentToken = '//';
        this.mNodeDefinitions = new Map<string, PotatnoNodeDefinition>();
        this.mMainFunctions = new Array<PotatnoMainFunctionDefinition>();
        this.mGlobalValues = new Array<PotatnoGlobalValueDefinition>();
        this.mCreatePreview = null;
        this.mUpdatePreview = null;
        this.mFunctionCodeGenerator = null;
    }

    /**
     * Register a global value definition.
     *
     * @param pDefinition - The global value definition to add.
     */
    public addGlobalValue(pDefinition: PotatnoGlobalValueDefinition): void {
        this.mGlobalValues.push(pDefinition);
    }

    /**
     * Register a main function definition.
     *
     * @param pDefinition - The main function definition to add.
     */
    public addMainFunction(pDefinition: PotatnoMainFunctionDefinition): void {
        this.mMainFunctions.push(pDefinition);
    }

    /**
     * Register a node type definition.
     *
     * @param pDefinition - The node definition to add.
     */
    public addNodeDefinition(pDefinition: PotatnoNodeDefinition): void {
        this.mNodeDefinitions.set(pDefinition.name, pDefinition);
    }

    /**
     * Set the comment token used for metadata comments in generated code.
     *
     * @param pToken - The comment token string (e.g. '//').
     */
    public setCommentToken(pToken: string): void {
        this.mCommentToken = pToken;
    }

    /**
     * Set the callback that creates the initial preview DOM structure.
     * Called once when the preview is first initialized.
     *
     * @param pCallback - The preview creation callback receiving the container element.
     */
    public setCreatePreview(pCallback: (container: HTMLElement) => void): void {
        this.mCreatePreview = pCallback;
    }

    /**
     * Set the function code generator callback that wraps function body code
     * into a complete function declaration.
     *
     * @param pGenerator - The function code generator callback.
     */
    public setFunctionCodeGenerator(pGenerator: (func: PotatnoCodeFunction) => string): void {
        this.mFunctionCodeGenerator = pGenerator;
    }

    /**
     * Set the callback that updates the preview with new generated code.
     * Called on every code change after the preview has been created.
     *
     * @param pCallback - The preview update callback receiving the generated code string.
     */
    public setUpdatePreview(pCallback: (code: string) => void): void {
        this.mUpdatePreview = pCallback;
    }
}
