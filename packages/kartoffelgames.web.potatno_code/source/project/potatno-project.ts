import { PotatnoEditorConfiguration } from './potatno-editor-configuration.ts';
import type { PotatnoCodeFunction } from './potatno-code-function.ts';
import type { PotatnoGlobalValueDefinition } from './potatno-global-value-definition.ts';
import type { PotatnoMainFunctionDefinition } from './potatno-main-function-definition.ts';
import type { PotatnoNodeDefinition } from '../node/potatno-node-definition.ts';

/**
 * Project-level configuration for a PotatnoCode editor instance.
 * Contains all registered node types, main function definitions, global values,
 * and callback configurations. Does not hold document state.
 */
export class PotatnoProject {
    private readonly mConfiguration: PotatnoEditorConfiguration;

    /**
     * Get the underlying editor configuration.
     */
    public get configuration(): PotatnoEditorConfiguration {
        return this.mConfiguration;
    }

    /**
     * Create a new project with a default editor configuration.
     */
    public constructor() {
        this.mConfiguration = new PotatnoEditorConfiguration();
    }

    /**
     * Register a node type definition with the project.
     *
     * @param pDefinition - The node definition to register.
     */
    public defineNode(pDefinition: PotatnoNodeDefinition): void {
        this.mConfiguration.addNodeDefinition(pDefinition);
    }

    /**
     * Register a main function definition with the project.
     *
     * @param pDefinition - The main function definition to register.
     */
    public defineMainFunction(pDefinition: PotatnoMainFunctionDefinition): void {
        this.mConfiguration.addMainFunction(pDefinition);
    }

    /**
     * Register a global value definition with the project.
     *
     * @param pDefinition - The global value definition to register.
     */
    public defineGlobalValue(pDefinition: PotatnoGlobalValueDefinition): void {
        this.mConfiguration.addGlobalValue(pDefinition);
    }

    /**
     * Set the comment token used for metadata comments in generated code.
     *
     * @param pToken - The comment token string (e.g. '//').
     */
    public setCommentToken(pToken: string): void {
        this.mConfiguration.setCommentToken(pToken);
    }

    /**
     * Set the function code generator callback that wraps function body code
     * into a complete function declaration.
     *
     * @param pGenerator - The function code generator callback.
     */
    public setFunctionCodeGenerator(pGenerator: (pFunc: PotatnoCodeFunction) => string): void {
        this.mConfiguration.setFunctionCodeGenerator(pGenerator);
    }

    /**
     * Set the callback that creates the initial preview DOM structure.
     * Called once when the preview is first initialized.
     *
     * @param pCallback - The preview creation callback receiving the container element.
     */
    public setCreatePreview(pCallback: (pContainer: HTMLElement) => void): void {
        this.mConfiguration.setCreatePreview(pCallback);
    }

    /**
     * Set the callback that updates the preview with new generated code.
     * Called on every code change after the preview has been created.
     *
     * @param pCallback - The preview update callback receiving the generated code string.
     */
    public setUpdatePreview(pCallback: (pCode: string) => void): void {
        this.mConfiguration.setUpdatePreview(pCallback);
    }
}
