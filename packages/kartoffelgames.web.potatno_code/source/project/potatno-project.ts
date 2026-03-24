import { PotatnoEditorConfiguration } from './potatno-editor-configuration.ts';
import type { PotatnoCodeFunction } from './potatno-code-function.ts';
import type { PotatnoImportDefinition } from './potatno-import-definition.ts';
import type { PotatnoMainFunctionDefinition } from './potatno-main-function-definition.ts';
import type { PotatnoGlobalPortDefinition } from './potatno-global-port-definition.ts';
import type { PotatnoNodeDefinition } from '../node/potatno-node-definition.ts';

/**
 * Project-level configuration for a PotatnoCode editor instance.
 * Contains all registered node types, main function definitions, imports,
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
     * Register a global input port definition visible in every function.
     */
    public defineGlobalInput(pDefinition: PotatnoGlobalPortDefinition): void {
        this.mConfiguration.addGlobalInput(pDefinition);
    }

    /**
     * Register a global output port definition visible in every function.
     */
    public defineGlobalOutput(pDefinition: PotatnoGlobalPortDefinition): void {
        this.mConfiguration.addGlobalOutput(pDefinition);
    }

    /**
     * Register an import definition. When a function enables this import,
     * the contained node definitions become available in that function's node library.
     */
    public defineImport(pDefinition: PotatnoImportDefinition): void {
        this.mConfiguration.addImport(pDefinition);
    }

    /**
     * Register a main function definition with the project.
     */
    public defineMainFunction(pDefinition: PotatnoMainFunctionDefinition): void {
        this.mConfiguration.addMainFunction(pDefinition);
    }

    /**
     * Register a node type definition with the project.
     */
    public defineNode(pDefinition: PotatnoNodeDefinition): void {
        this.mConfiguration.addNodeDefinition(pDefinition);
    }

    /**
     * Set the comment token used for metadata comments in generated code.
     */
    public setCommentToken(pToken: string): void {
        this.mConfiguration.setCommentToken(pToken);
    }

    /**
     * Set the function code generator callback that wraps function body code
     * into a complete function declaration.
     */
    public setFunctionCodeGenerator(pGenerator: (pFunc: PotatnoCodeFunction) => string): void {
        this.mConfiguration.setFunctionCodeGenerator(pGenerator);
    }

    /**
     * Set the preview callbacks for creating the initial preview DOM and
     * updating it with generated code.
     */
    public setPreview(pCreate: (pContainer: HTMLElement) => void, pUpdate: (pCode: string) => void): void {
        this.mConfiguration.setPreview(pCreate, pUpdate);
    }
}
