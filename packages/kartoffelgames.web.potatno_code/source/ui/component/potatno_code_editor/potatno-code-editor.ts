import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, PwbChild, PwbComponent, PwbExport, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocument } from '../../../document/potatno-document.ts';
import type { PotatnoCodeFileSerializationResult } from '../../../serialization/potatno-serialization.type.ts';
import { PotatnoUiManager, PotatnoCodeUiManagerChangeType } from '../../manager/potatno-ui-manager.ts';
import type { PotatnoUiProject } from '../../potatno-ui-project.ts';
import editorCss from './potatno-code-editor.css' with { type: 'text' };
import editorTemplate from './potatno-code-editor.html' with { type: 'text' };

// Import child components to ensure they are registered.
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
export class PotatnoCodeEditor<TProject extends PotatnoUiProject> implements IComponentOnConnect, IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private mResizeMoveHandler: ((pEvent: PointerEvent) => void) | null;
    private mResizeState: { panel: 'left' | 'right'; startX: number; startWidth: number; } | null;
    private mResizeUpHandler: (() => void) | null;
    private mUnsubscribe: (() => void) | null;

    /**
     * Left panel DOM element used for resizing.
     */
    @PwbChild('panelLeft')
    public accessor panelLeft!: HTMLElement;

    /**
     * Right panel DOM element used for resizing.
     */
    @PwbChild('panelRight')
    public accessor panelRight!: HTMLElement;

    /**
     * Whether the preview panel should currently be shown.
     */
    public get hasPreview(): boolean {
        const lProject: PotatnoUiProject | null = this.mManager.project;
        const lActiveFunction: PotatnoDocumentFunction<PotatnoUiProject> | null = this.mManager.activeFunction;
        if (!lProject || !lActiveFunction || !lProject.previews) {
            return false;
        }

        for (const lEntry of lProject.previews.entries) {
            if (lEntry.executorFunctionId === lActiveFunction.definitionId) {
                return true;
            }
        }

        return false;
    }

    /**
     * Current document state.
     */
    public get file(): PotatnoDocument<TProject> | null {
        return this.mManager.document as PotatnoDocument<TProject> | null;
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
        this.mResizeMoveHandler = null;
        this.mResizeState = null;
        this.mResizeUpHandler = null;
        this.mUnsubscribe = null;
    }

    /**
     * Project configuration backing the editor.
     */
    @PwbExport
    public set project(pProject: TProject) {
        this.mManager.initialize(pProject);
    }

    /**
     * Document state backing the editor.
     */
    @PwbExport
    public set file(pFile: PotatnoDocument<TProject> | null) {
        this.mManager.setDocument(pFile as PotatnoDocument<PotatnoUiProject> | null);
    }

    /**
     * Load serialized code into a new document.
     *
     * @param pData - Serialized Potatno document data.
     */
    @PwbExport
    public loadCode(pData: PotatnoCodeFileSerializationResult): void {
        this.mManager.loadCode(pData);
    }

    /**
     * Generate serializable code from the current document.
     *
     * @returns Serialized Potatno document data, or null without a document.
     */
    @PwbExport
    public generateCode(): PotatnoCodeFileSerializationResult | null {
        return this.mManager.generateCode();
    }

    /**
     * Drive one preview tick. Called by the application's render loop.
     *
     * @returns A promise resolving once the current render pass finishes.
     */
    @PwbExport
    public triggerPreviewUpdate(): Promise<void> {
        return this.mManager.triggerPreviewUpdate();
    }

    /**
     * Subscribe to the manager so the preview panel toggles with preview availability.
     */
    public onConnect(): void {
        this.mUnsubscribe = this.mManager.subscribe([
            PotatnoCodeUiManagerChangeType.DocumentChange,
            PotatnoCodeUiManagerChangeType.FunctionActivate,
            PotatnoCodeUiManagerChangeType.FunctionAdd,
            PotatnoCodeUiManagerChangeType.FunctionDelete,
            PotatnoCodeUiManagerChangeType.PreviewChange
        ], () => {
            this.mComponent.updater.update();
        });
    }

    /**
     * Detach listeners and panel resize handlers.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe?.();
        this.mUnsubscribe = null;
        this.mManager.dispose();
        this.stopPanelResize();
    }

    /**
     * Start resizing the left panel.
     *
     * @param pEvent - Pointer event from the resize handle.
     */
    public onResizeLeftStart(pEvent: PointerEvent): void {
        pEvent.preventDefault();
        this.startPanelResize('left', pEvent);
    }

    /**
     * Start resizing the right panel.
     *
     * @param pEvent - Pointer event from the resize handle.
     */
    public onResizeRightStart(pEvent: PointerEvent): void {
        pEvent.preventDefault();
        this.startPanelResize('right', pEvent);
    }

    /**
     * Start panel resizing for one side.
     *
     * @param pPanel - Panel side being resized.
     * @param pEvent - Pointer event that started resizing.
     */
    private startPanelResize(pPanel: 'left' | 'right', pEvent: PointerEvent): void {
        // Tear down any in-progress resize first. This must happen before the new state is assigned:
        // stopPanelResize() clears mResizeState, so calling it afterwards would null the state the
        // move handler checks and silently no-op every resize.
        this.stopPanelResize();

        const lPanelElement: HTMLElement = pPanel === 'left' ? this.panelLeft : this.panelRight;
        this.mResizeState = { panel: pPanel, startWidth: lPanelElement.offsetWidth, startX: pEvent.clientX };

        const lMoveHandler = (pMoveEvent: PointerEvent): void => {
            if (!this.mResizeState) {
                return;
            }

            const lDelta: number = pPanel === 'left'
                ? pMoveEvent.clientX - this.mResizeState.startX
                : this.mResizeState.startX - pMoveEvent.clientX;
            lPanelElement.style.width = `${Math.max(200, Math.min(500, this.mResizeState.startWidth + lDelta))}px`;
        };

        const lUpHandler = (): void => {
            document.removeEventListener('pointermove', lMoveHandler);
            document.removeEventListener('pointerup', lUpHandler);
            this.mResizeMoveHandler = null;
            this.mResizeState = null;
            this.mResizeUpHandler = null;
        };

        this.mResizeMoveHandler = lMoveHandler;
        this.mResizeUpHandler = lUpHandler;
        document.addEventListener('pointermove', lMoveHandler);
        document.addEventListener('pointerup', lUpHandler);
    }

    /**
     * Stop panel resizing if it is active.
     */
    private stopPanelResize(): void {
        if (this.mResizeMoveHandler) {
            document.removeEventListener('pointermove', this.mResizeMoveHandler);
            this.mResizeMoveHandler = null;
        }

        if (this.mResizeUpHandler) {
            document.removeEventListener('pointerup', this.mResizeUpHandler);
            this.mResizeUpHandler = null;
        }

        this.mResizeState = null;
    }
}
