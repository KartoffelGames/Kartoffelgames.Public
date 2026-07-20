import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, PwbComponent, PwbExport, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocument } from '../../../document/potatno-document.ts';
import type { PotatnoFunctionDefinition } from '../../../project/potatno-function-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../../../project/potatno-project.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoFunctionListComponent } from '../potatno_function_list/potatno-function-list-component.ts';
import { PotatnoNodeGraph } from '../potatno_node_graph/potatno-node-graph.ts';
import { PotatnoFunctionPropertiesComponent } from '../potatno_panel_properties/potatno-function-properties-component.ts';
import { PotatnoPreviewComponent } from '../potatno_preview/potatno-preview-component.ts';
import editorCss from './potatno-code-editor-component.css' with { type: 'text' };
import editorTemplate from './potatno-code-editor-component.html' with { type: 'text' };

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
    components: [PotatnoFunctionListComponent, PotatnoNodeGraph, PotatnoFunctionPropertiesComponent, PotatnoPreviewComponent]
})
export class PotatnoCodeEditorComponent implements IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private readonly mUnsubscribe: PotatnoCodeUiManagerUnsubscribe;

    /**
     * Document state backing the editor.
     */
    @PwbExport
    public get document(): PotatnoDocument<PotatnoProjectTypesDefinition> | null {
        return this.mManager.graph.document;
    } set document(pFile: PotatnoDocument<PotatnoProjectTypesDefinition>) {
        this.mManager.graph.setDocument(pFile as PotatnoDocument<PotatnoProjectTypesDefinition>);
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
     * Create the editor shell.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mComponent = pComponent;
        this.mManager = pManager;

        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.SpecialActiveFunction, () => {
            this.mComponent.updater.updateAsync();
        });
    }

    /**
     * Initialize the editor with a project.#
     * 
     * @param pProject - Project.
     */
    @PwbExport
    public initializeProject(pProject: PotatnoProject<PotatnoProjectTypesDefinition>): void {
        // TODO: remove once contexted injections are in place.
        this.mManager.initialize(pProject);
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
