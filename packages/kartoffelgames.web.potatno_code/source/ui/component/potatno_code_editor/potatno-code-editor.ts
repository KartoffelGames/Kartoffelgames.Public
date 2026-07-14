import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, PwbComponent, PwbExport, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocument } from '../../../document/potatno-document.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import editorCss from './potatno-code-editor.css' with { type: 'text' };
import editorTemplate from './potatno-code-editor.html' with { type: 'text' };

// Import child components to ensure they are registered.
import type { PotatnoFunctionDefinition } from '../../../project/potatno-function-definition.ts';
import type { PotatnoProject } from '../../../project/potatno-project.ts';
import '../potatno_function_list/potatno-function-list.ts';
import '../potatno_node_graph/potatno-node-graph.ts';
import '../potatno_panel_properties/potatno-panel-properties.ts';
import '../potatno_preview/potatno-preview.ts';

/**
 * Top-level layout shell for the Potatno-code editor.
 *
 * All editor state and behaviour live in the shared {@link PotatnoUiManager}; this component
 * only owns the panel layout, the resize handles, and the bridge from {@link PwbApplication}'s
 * imperative API (project/document/preview tick) into the manager. It re-renders itself when the
 * preview availability changes so the preview panel can appear or disappear.
 */
@PwbComponent({
    selector: 'potatno-code-editor',
    template: editorTemplate,
    style: editorCss,
})
export class PotatnoCodeEditor implements IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private mProject: PotatnoProject<PotatnoProjectTypesDefinition> | null;
    private readonly mUnsubscribe: PotatnoCodeUiManagerUnsubscribe;

    /**
     * Document state backing the editor.
     */
    @PwbExport
    public get document(): PotatnoDocument<PotatnoProjectTypesDefinition> | null {
        return this.mManager.graph.document;
    } set document(pFile: PotatnoDocument<PotatnoProjectTypesDefinition>) {
        if (!this.mProject) {
            return;
        }

        this.mManager.initialize(this.mProject, pFile as PotatnoDocument<PotatnoProjectTypesDefinition>);
    }

    /**
     * Whether the preview panel should currently be shown.
     */
    public get hasPreview(): boolean {
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            return false;
        }

        // Get definition of active function.
        const lActiveFunctionDefintion: PotatnoFunctionDefinition<PotatnoProjectTypesDefinition> | undefined = lActiveFunction.project.getFunction(lActiveFunction.definitionId);
        if (!lActiveFunctionDefintion) {
            return false;
        }

        return lActiveFunction.project.preview.availableDisplays(lActiveFunctionDefintion).length > 0;
    }

    /**
     * Project configuration backing the editor.
     */
    @PwbExport
    public set project(pProject: PotatnoProject<PotatnoProjectTypesDefinition>) {
        // Cache the project. The manager is initialized once the document arrives via `file`.
        this.mProject = pProject;
    }

    /**
     * Create the editor shell.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mComponent = pComponent;
        this.mManager = pManager;
        this.mProject = null;

        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.SpecialActiveFunction, () => {
            this.mComponent.updater.updateAsync();
        });
    }

    /**
     * Drive one preview tick. Called by the application's render loop.
     *
     * @returns A promise resolving once the current render pass finishes.
     */
    @PwbExport
    public async triggerPreviewUpdate(): Promise<void> {
        return this.mManager.preview.execute();
    }

    /**
     * Detach listeners and panel resize handlers.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe();
    }
}
