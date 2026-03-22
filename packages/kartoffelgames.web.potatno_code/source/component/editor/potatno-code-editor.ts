import { PwbComponent, Processor, PwbExport, PwbChild, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import editorCss from './potatno-code-editor.css';
import editorTemplate from './potatno-code-editor.html';
import { PotatnoEditorConfiguration } from '../../data_model/configuration/potatno-editor-configuration.ts';
import type { PotatnoNodeDefinition } from '../../data_model/configuration/potatno-node-definition.ts';
import type { PotatnoMainFunctionDefinition } from '../../data_model/configuration/potatno-main-function-definition.ts';
import type { PotatnoGlobalValueDefinition } from '../../data_model/configuration/potatno-global-value-definition.ts';
import type { PotatnoCodeFunction } from '../../data_model/code_generation/potatno-code-function.ts';
import { PotatnoProject } from '../../data_model/function/potatno-project.ts';
import type { PotatnoFunction } from '../../data_model/function/potatno-function.ts';
import { PotatnoHistory } from '../../data_model/history/potatno-history.ts';
import { PotatnoClipboard } from '../../data_model/clipboard/potatno-clipboard.ts';
import { PotatnoSerializer } from '../../data_model/serialization/potatno-serializer.ts';
import { PotatnoDeserializer } from '../../data_model/serialization/potatno-deserializer.ts';
import { NodeCategory, NODE_CATEGORY_META } from '../../data_model/enum/node-category.enum.ts';
import { PortKind } from '../../data_model/enum/port-kind.enum.ts';
import { NodeAddAction } from '../../data_model/history/actions/node-actions.ts';
import { NodeRemoveAction, NodeMoveAction } from '../../data_model/history/actions/node-actions.ts';
import { ConnectionAddAction, ConnectionRemoveAction } from '../../data_model/history/actions/connection-actions.ts';
import { PropertyChangeAction } from '../../data_model/history/actions/property-change-action.ts';
import { CompositeAction } from '../../data_model/history/actions/composite-action.ts';
import type { PotatnoNode } from '../../data_model/graph/potatno-node.ts';
import type { PotatnoGraph } from '../../data_model/graph/potatno-graph.ts';
import type { PotatnoConnection } from '../../data_model/graph/potatno-connection.ts';
import { PotatnoCanvasInteraction } from '../canvas/potatno-canvas-interaction.ts';
import { PotatnoCanvasRenderer } from '../canvas/potatno-canvas-renderer.ts';

// Import child components to ensure they're registered.
import '../node_library/potatno-node-library.ts';
import '../function_list/potatno-function-list.ts';
import '../panel_left/potatno-panel-left.ts';
import '../panel_right/potatno-panel-properties.ts';
import '../preview/potatno-preview.ts';
import '../canvas/potatno-canvas.ts';
import '../node/potatno-node.ts';
import '../port/potatno-port.ts';
import '../shared/potatno-tabs.ts';
import '../shared/potatno-resize-handle.ts';
import '../shared/potatno-search-input.ts';

/**
 * Interaction state for the canvas.
 */
type InteractionState =
    | { mode: 'idle' }
    | { mode: 'panning'; startX: number; startY: number }
    | { mode: 'dragging-node'; nodeId: string; startX: number; startY: number; origins: Array<{ nodeId: string; originX: number; originY: number }> }
    | { mode: 'dragging-wire'; sourceNodeId: string; sourcePortId: string; portKind: string; direction: string; type: string; startX: number; startY: number }
    | { mode: 'selecting'; startX: number; startY: number };

/**
 * Module-level project storage. Keeps PotatnoProject instances outside
 * PWB's deep proxy so that internal Map operations work correctly.
 */
const gProjectStore: Map<string, PotatnoProject> = new Map();

/**
 * Module-level selection storage. Keeps Set<string> instances outside
 * PWB's deep proxy so that internal Set operations work correctly.
 */
const gSelectionStore: Map<string, Set<string>> = new Map();

/**
 * Module-level storage for all complex objects that must NEVER be
 * deep-proxied by PWB. This includes the history (which holds graph
 * references with Maps), the clipboard, the canvas interaction helper,
 * and the SVG renderer.
 */
interface EditorInternals {
    history: PotatnoHistory;
    clipboard: PotatnoClipboard;
    interaction: PotatnoCanvasInteraction;
    renderer: PotatnoCanvasRenderer;
    hoveredPort: { nodeId: string; portId: string; portKind: string; direction: string; type: string } | null;
    interactionState: InteractionState;
}
const gInternalsStore: Map<string, EditorInternals> = new Map();

@PwbComponent({
    selector: 'potatno-code-editor',
    template: editorTemplate,
    style: editorCss,
})
export class PotatnoCodeEditor extends Processor implements IComponentOnConnect, IComponentOnDeconstruct {
    // --- Data Model ---
    private mProjectKey: string;
    private mShowSelectionBox: boolean;
    private mSelectionBoxScreen: { x1: number; y1: number; x2: number; y2: number };
    private mPreviewDebounceTimer: number;
    private mKeyboardHandler: ((e: KeyboardEvent) => void) | null;
    private mResizeState: { panel: 'left' | 'right'; startX: number; startWidth: number } | null;
    private mResizeMoveHandler: ((e: PointerEvent) => void) | null;
    private mResizeUpHandler: ((e: PointerEvent) => void) | null;

    // --- Cached view data (stable references to avoid PWB update loops) ---
    private mCachedActiveFunctionId: string;
    private mCachedActiveFunctionName: string;
    private mCachedActiveFunctionIsSystem: boolean;
    private mCachedErrors: Array<{ message: string; location: string }>;
    private mCachedHasPreview: boolean;
    private mCachedNodeDefinitionList: Array<{ name: string; category: string }>;
    private mCachedFunctionList: Array<{ id: string; name: string; label: string; system: boolean }>;
    private mCachedAvailableImports: Array<string>;
    private mCachedAvailableTypes: Array<string>;
    private mCachedActiveFunctionInputs: Array<{ name: string; type: string }>;
    private mCachedActiveFunctionOutputs: Array<{ name: string; type: string }>;
    private mCachedActiveFunctionImports: Array<string>;
    private mCachedVisibleNodes: Array<any>;

    // --- DOM Refs ---
    @PwbChild('svgLayer')
    public accessor svgLayer!: SVGSVGElement;

    @PwbChild('canvasWrapper')
    public accessor canvasWrapper!: HTMLElement;

    @PwbChild('panelLeft')
    public accessor panelLeft!: HTMLElement;

    @PwbChild('panelRight')
    public accessor panelRight!: HTMLElement;

    // --- Public Getters for Template ---
    public get project(): PotatnoProject {
        return this.getProject();
    }

    public get activeFunctionId(): string {
        return this.mCachedActiveFunctionId;
    }

    public get interaction(): PotatnoCanvasInteraction {
        return this.getInternals().interaction;
    }

    public get showSelectionBox(): boolean {
        return this.mShowSelectionBox;
    }

    public get hasPreview(): boolean {
        return this.mCachedHasPreview;
    }

    public get editorErrors(): Array<{ message: string; location: string }> {
        return this.mCachedErrors;
    }

    public get gridBackgroundStyle(): string {
        return this.getInternals().interaction.getGridBackgroundCss();
    }

    public get gridTransformStyle(): string {
        return 'transform: ' + this.getInternals().interaction.getTransformCss();
    }

    public get selectionBoxStyle(): string {
        if (!this.mShowSelectionBox) {
            return 'display: none';
        }
        const lX: number = Math.min(this.mSelectionBoxScreen.x1, this.mSelectionBoxScreen.x2);
        const lY: number = Math.min(this.mSelectionBoxScreen.y1, this.mSelectionBoxScreen.y2);
        const lW: number = Math.abs(this.mSelectionBoxScreen.x2 - this.mSelectionBoxScreen.x1);
        const lH: number = Math.abs(this.mSelectionBoxScreen.y2 - this.mSelectionBoxScreen.y1);
        return `left: ${lX}px; top: ${lY}px; width: ${lW}px; height: ${lH}px`;
    }

    public get visibleNodes(): Array<any> {
        return this.mCachedVisibleNodes;
    }

    public get nodeDefinitionList(): Array<{ name: string; category: string }> {
        return this.mCachedNodeDefinitionList;
    }

    public get functionList(): Array<{ id: string; name: string; label: string; system: boolean }> {
        return this.mCachedFunctionList;
    }

    public get activeFunctionName(): string {
        return this.mCachedActiveFunctionName;
    }

    public get activeFunctionInputs(): Array<{ name: string; type: string }> {
        return this.mCachedActiveFunctionInputs;
    }

    public get activeFunctionOutputs(): Array<{ name: string; type: string }> {
        return this.mCachedActiveFunctionOutputs;
    }

    public get activeFunctionImports(): Array<string> {
        return this.mCachedActiveFunctionImports;
    }

    public get activeFunctionIsSystem(): boolean {
        return this.mCachedActiveFunctionIsSystem;
    }

    public get availableImportsList(): Array<string> {
        return this.mCachedAvailableImports;
    }

    public get availableTypes(): Array<string> {
        return this.mCachedAvailableTypes;
    }

    /**
     * Get the raw (non-proxied) project instance from the module-level store.
     */
    private getProject(): PotatnoProject {
        return gProjectStore.get(this.mProjectKey)!;
    }

    /**
     * Get the raw (non-proxied) selection set from the module-level store.
     */
    private getSelectedIds(): Set<string> {
        return gSelectionStore.get(this.mProjectKey)!;
    }

    /**
     * Get the raw (non-proxied) internals from the module-level store.
     * This keeps history, clipboard, interaction, renderer, and interaction
     * state completely outside PWB's deep proxy reach.
     */
    private getInternals(): EditorInternals {
        return gInternalsStore.get(this.mProjectKey)!;
    }

    public constructor() {
        super();
        this.mProjectKey = crypto.randomUUID();
        gProjectStore.set(this.mProjectKey, new PotatnoProject());
        gSelectionStore.set(this.mProjectKey, new Set<string>());
        gInternalsStore.set(this.mProjectKey, {
            history: new PotatnoHistory(),
            clipboard: new PotatnoClipboard(),
            interaction: new PotatnoCanvasInteraction(20),
            renderer: new PotatnoCanvasRenderer(),
            hoveredPort: null,
            interactionState: { mode: 'idle' }
        });
        this.mShowSelectionBox = false;
        this.mSelectionBoxScreen = { x1: 0, y1: 0, x2: 0, y2: 0 };
        this.mPreviewDebounceTimer = 0;
        this.mKeyboardHandler = null;
        this.mResizeState = null;
        this.mResizeMoveHandler = null;
        this.mResizeUpHandler = null;

        // Initialize cached view data with empty arrays.
        this.mCachedActiveFunctionId = '';
        this.mCachedActiveFunctionName = '';
        this.mCachedActiveFunctionIsSystem = false;
        this.mCachedErrors = [];
        this.mCachedHasPreview = false;
        this.mCachedNodeDefinitionList = [];
        this.mCachedFunctionList = [];
        this.mCachedAvailableImports = [];
        this.mCachedAvailableTypes = [];
        this.mCachedActiveFunctionInputs = [];
        this.mCachedActiveFunctionOutputs = [];
        this.mCachedActiveFunctionImports = [];
        this.mCachedVisibleNodes = [];
    }

    // ============================================================
    // Public Setup API (exposed on the HTML element via @PwbExport)
    // ============================================================

    @PwbExport
    public defineNode(pDefinition: PotatnoNodeDefinition): void {
        this.getProject().configuration.addNodeDefinition(pDefinition);
        this.rebuildCachedData();
    }

    @PwbExport
    public defineMainFunction(pDefinition: PotatnoMainFunctionDefinition): void {
        this.getProject().configuration.addMainFunction(pDefinition);
        this.rebuildCachedData();
    }

    @PwbExport
    public defineGlobalValue(pDefinition: PotatnoGlobalValueDefinition): void {
        this.getProject().configuration.addGlobalValue(pDefinition);
        this.rebuildCachedData();
    }

    @PwbExport
    public setCommentToken(pToken: string): void {
        this.getProject().configuration.setCommentToken(pToken);
    }

    @PwbExport
    public setPreviewCallback(pCallback: (code: string) => DocumentFragment): void {
        this.getProject().configuration.setPreviewCallback(pCallback);
    }

    @PwbExport
    public setFunctionCodeGenerator(pGenerator: (func: PotatnoCodeFunction) => string): void {
        this.getProject().configuration.setFunctionCodeGenerator(pGenerator);
    }

    @PwbExport
    public initialize(): void {
        this.getProject().initializeMainFunctions();
        this.rebuildCachedData();
        this.renderConnections();
        this.updatePreview();
    }

    @PwbExport
    public loadCode(pCode: string): void {
        const lProject: PotatnoProject = this.getProject();
        const lDeserializer: PotatnoDeserializer = new PotatnoDeserializer(lProject.configuration);
        const lNewProject: PotatnoProject = lDeserializer.deserialize(pCode);
        // Replace the stored project in module-level store.
        gProjectStore.set(this.mProjectKey, lNewProject);
        this.getInternals().history.clear();
        this.getSelectedIds().clear();
        this.rebuildCachedData();
        this.renderConnections();
        this.updatePreview();
    }

    @PwbExport
    public generateCode(): string {
        const lSerializer: PotatnoSerializer = new PotatnoSerializer(this.getProject().configuration);
        return lSerializer.serialize(this.getProject());
    }

    // ============================================================
    // Lifecycle
    // ============================================================

    public onConnect(): void {
        this.mKeyboardHandler = (pEvent: KeyboardEvent) => this.onKeyDown(pEvent);
        document.addEventListener('keydown', this.mKeyboardHandler);
    }

    public onDeconstruct(): void {
        if (this.mKeyboardHandler) {
            document.removeEventListener('keydown', this.mKeyboardHandler);
        }
        gProjectStore.delete(this.mProjectKey);
        gSelectionStore.delete(this.mProjectKey);
        gInternalsStore.delete(this.mProjectKey);
    }

    // ============================================================
    // Template Helpers
    // ============================================================

    // ============================================================
    // Event Handlers: Left Panel
    // ============================================================

    public onNodeDragFromLibrary(pEvent: any): void {
        const lDefName: string = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        let lDefinition: PotatnoNodeDefinition | undefined = this.getProject().configuration.nodeDefinitions.get(lDefName);

        // Check if it's a user-defined function rather than a built-in node definition.
        if (!lDefinition) {
            for (const lFunc of this.getProject().functions.values()) {
                if (lFunc.name === lDefName && !lFunc.system) {
                    // Create a temporary definition for this user function.
                    lDefinition = {
                        name: lFunc.name,
                        category: NodeCategory.Function,
                        inputs: [...lFunc.inputs],
                        outputs: [...lFunc.outputs],
                        codeGenerator: () => ''
                    };
                    break;
                }
            }
        }

        if (!lDefinition) {
            return;
        }

        const lGraph: PotatnoGraph | undefined = this.getProject().activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        // Place at center of visible area.
        const lWrapper: HTMLElement = this.canvasWrapper;
        const lWidth: number = lWrapper ? lWrapper.clientWidth || 800 : 800;
        const lHeight: number = lWrapper ? lWrapper.clientHeight || 600 : 600;
        const lCenter = this.getInternals().interaction.screenToWorld(lWidth / 2, lHeight / 2);
        const lSnapped = this.getInternals().interaction.snapToGrid(lCenter.x, lCenter.y);

        const lAction: NodeAddAction = new NodeAddAction(lGraph, lDefinition, { x: lSnapped.x / this.getInternals().interaction.gridSize, y: lSnapped.y / this.getInternals().interaction.gridSize });
        this.getInternals().history.push(lAction);
        this.rebuildCachedData();
        this.renderConnections();
        this.updatePreview();
    }

    public onFunctionSelect(pEvent: any): void {
        const lFuncId: string = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        this.getProject().setActiveFunction(lFuncId);
        this.getSelectedIds().clear();
        this.rebuildCachedData();
        this.renderConnections();
    }

    public onFunctionAdd(): void {
        const lCount: number = this.mCachedFunctionList.length;
        const lFunc: PotatnoFunction = this.getProject().addFunction(
            `function_${lCount}`,
            `Function ${lCount}`,
            false
        );
        this.getProject().setActiveFunction(lFunc.id);
        this.getSelectedIds().clear();
        this.rebuildCachedData();
        this.renderConnections();
    }

    public onFunctionDelete(pEvent: any): void {
        const lFuncId: string = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        this.getProject().removeFunction(lFuncId);
        this.getSelectedIds().clear();
        this.rebuildCachedData();
        this.renderConnections();
        this.updatePreview();
    }

    // ============================================================
    // Event Handlers: Properties Panel
    // ============================================================

    public onPropertiesChange(pEvent: any): void {
        const lFunc: PotatnoFunction | undefined = this.getProject().activeFunction;
        if (!lFunc) {
            return;
        }

        const lData = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        if (lData.name !== undefined) {
            lFunc.setName(lData.name);
            lFunc.setLabel(lData.name);
        }
        if (lData.inputs !== undefined) {
            lFunc.setInputs(lData.inputs);
        }
        if (lData.outputs !== undefined) {
            lFunc.setOutputs(lData.outputs);
        }
        if (lData.imports !== undefined) {
            lFunc.setImports(lData.imports);
        }

        lFunc.graph.validate();
        this.rebuildCachedData();
        this.renderConnections();
        this.updatePreview();
    }

    // ============================================================
    // Event Handlers: Canvas Interaction
    // ============================================================

    public onCanvasPointerDown(pEvent: PointerEvent): void {
        // Middle mouse: pan.
        if (pEvent.button === 1) {
            pEvent.preventDefault();
            this.getInternals().interactionState = { mode: 'panning', startX: pEvent.clientX, startY: pEvent.clientY };
            (pEvent.currentTarget as HTMLElement).setPointerCapture(pEvent.pointerId);
            return;
        }

        // Left mouse on background: start selection box.
        if (pEvent.button === 0) {
            if (!pEvent.ctrlKey) {
                this.getSelectedIds().clear();
                this.rebuildCachedData();
            }
            const lRect: DOMRect = this.canvasWrapper.getBoundingClientRect();
            const lX: number = pEvent.clientX - lRect.left;
            const lY: number = pEvent.clientY - lRect.top;
            this.getInternals().interactionState = { mode: 'selecting', startX: lX, startY: lY };
            this.mSelectionBoxScreen = { x1: lX, y1: lY, x2: lX, y2: lY };
            this.mShowSelectionBox = false; // Show only after a minimum drag distance.
            (pEvent.currentTarget as HTMLElement).setPointerCapture(pEvent.pointerId);
        }
    }

    public onCanvasPointerMove(pEvent: PointerEvent): void {
        const lState: InteractionState = this.getInternals().interactionState;
        const lInternals: EditorInternals = this.getInternals();

        if (lState.mode === 'panning') {
            const lDx: number = pEvent.clientX - lState.startX;
            const lDy: number = pEvent.clientY - lState.startY;
            lInternals.interaction.pan(lDx, lDy);
            lState.startX = pEvent.clientX;
            lState.startY = pEvent.clientY;
            this.renderConnections();
            return;
        }

        if (lState.mode === 'dragging-node') {
            const lDx: number = (pEvent.clientX - lState.startX) / lInternals.interaction.zoom;
            const lDy: number = (pEvent.clientY - lState.startY) / lInternals.interaction.zoom;

            for (const lOrigin of lState.origins) {
                const lNewX: number = lOrigin.originX + lDx;
                const lNewY: number = lOrigin.originY + lDy;
                const lSnapped = lInternals.interaction.snapToGrid(lNewX, lNewY);

                const lNode: PotatnoNode | undefined = this.getProject().activeFunction?.graph.getNode(lOrigin.nodeId);
                if (lNode) {
                    lNode.moveTo(lSnapped.x / lInternals.interaction.gridSize, lSnapped.y / lInternals.interaction.gridSize);
                    this.updateNodePosition(lOrigin.nodeId);
                }
            }
            this.renderConnections();
            return;
        }

        if (lState.mode === 'dragging-wire') {
            const lRect: DOMRect = this.canvasWrapper.getBoundingClientRect();
            const lEndX: number = (pEvent.clientX - lRect.left - lInternals.interaction.panX) / lInternals.interaction.zoom;
            const lEndY: number = (pEvent.clientY - lRect.top - lInternals.interaction.panY) / lInternals.interaction.zoom;
            lInternals.renderer.renderTempConnection(
                this.svgLayer,
                { x: lState.startX, y: lState.startY },
                { x: lEndX, y: lEndY },
                '#bac2de'
            );
            return;
        }

        if (lState.mode === 'selecting') {
            const lRect: DOMRect = this.canvasWrapper.getBoundingClientRect();
            this.mSelectionBoxScreen.x2 = pEvent.clientX - lRect.left;
            this.mSelectionBoxScreen.y2 = pEvent.clientY - lRect.top;
            const lDx: number = Math.abs(this.mSelectionBoxScreen.x2 - this.mSelectionBoxScreen.x1);
            const lDy: number = Math.abs(this.mSelectionBoxScreen.y2 - this.mSelectionBoxScreen.y1);
            if (lDx > 5 || lDy > 5) {
                this.mShowSelectionBox = true;
            }
            return;
        }
    }

    public onCanvasPointerUp(pEvent: PointerEvent): void {
        if (this.getInternals().interactionState.mode === 'dragging-node') {
            const lNode: PotatnoNode | undefined = this.getProject().activeFunction?.graph.getNode(this.getInternals().interactionState.nodeId);
            if (lNode) {
                const lSnapped = this.getInternals().interaction.snapToGrid(
                    lNode.position.x * this.getInternals().interaction.gridSize,
                    lNode.position.y * this.getInternals().interaction.gridSize
                );
                // Record as a history action (the actual move already happened).
                // We don't re-push the action since we already moved the node directly.
            }
            this.rebuildCachedData();
            this.renderConnections();
            this.updatePreview();
        }

        if (this.getInternals().interactionState.mode === 'dragging-wire') {
            this.getInternals().renderer.clearTempConnection(this.svgLayer);

            // Finalize connection if dropped on a valid port.
            if (this.getInternals().hoveredPort) {
                const lTarget = this.getInternals().hoveredPort;

                // Validate: must connect output-to-input (or input-to-output) and same port kind.
                if (this.getInternals().interactionState.direction !== lTarget.direction &&
                    this.getInternals().interactionState.portKind === lTarget.portKind) {

                    const lGraph: PotatnoGraph | undefined = this.getProject().activeFunction?.graph;
                    if (lGraph) {
                        const lKind: PortKind = this.getInternals().interactionState.portKind === 'data' ? PortKind.Data : PortKind.Flow;

                        let lSourceNodeId: string;
                        let lSourcePortId: string;
                        let lTargetNodeId: string;
                        let lTargetPortId: string;

                        if (this.getInternals().interactionState.direction === 'output') {
                            lSourceNodeId = this.getInternals().interactionState.sourceNodeId;
                            lSourcePortId = this.getInternals().interactionState.sourcePortId;
                            lTargetNodeId = lTarget.nodeId;
                            lTargetPortId = lTarget.portId;
                        } else {
                            lSourceNodeId = lTarget.nodeId;
                            lSourcePortId = lTarget.portId;
                            lTargetNodeId = this.getInternals().interactionState.sourceNodeId;
                            lTargetPortId = this.getInternals().interactionState.sourcePortId;
                        }

                        lGraph.addConnection(lSourceNodeId, lSourcePortId, lTargetNodeId, lTargetPortId, lKind);
                        this.rebuildCachedData();
                        this.renderConnections();
                        this.updatePreview();
                    }
                }
            }
        }

        if (this.getInternals().interactionState.mode === 'selecting') {
            this.mShowSelectionBox = false;
            // Select nodes within the selection box.
            this.selectNodesInBox();
        }

        this.getInternals().interactionState = { mode: 'idle' };
        (pEvent.currentTarget as HTMLElement).releasePointerCapture(pEvent.pointerId);
    }

    public onCanvasWheel(pEvent: WheelEvent): void {
        pEvent.preventDefault();
        const lRect: DOMRect = this.canvasWrapper.getBoundingClientRect();
        const lMouseX: number = pEvent.clientX - lRect.left;
        const lMouseY: number = pEvent.clientY - lRect.top;
        this.getInternals().interaction.zoomAt(lMouseX, lMouseY, pEvent.deltaY > 0 ? -0.1 : 0.1);
        this.renderConnections();
    }

    public onContextMenu(pEvent: Event): void {
        pEvent.preventDefault();
    }

    // ============================================================
    // Event Handlers: Node Interaction
    // ============================================================

    public onNodePointerDown(pEvent: PointerEvent, pNodeRender: any): void {
        // Check composedPath for port elements. If the click originated from
        // within a <potatno-port>, let the port interaction handle it instead
        // of starting a node drag.
        const lPath: Array<EventTarget> = pEvent.composedPath();
        for (const lEl of lPath) {
            if ((lEl as HTMLElement).tagName?.toLowerCase() === 'potatno-port') {
                return; // Let port interaction handle this.
            }
        }

        pEvent.stopPropagation();

        if (pEvent.button !== 0) {
            return;
        }

        const lNodeId: string = pNodeRender.id;

        // Selection.
        if (pEvent.ctrlKey) {
            if (this.getSelectedIds().has(lNodeId)) {
                this.getSelectedIds().delete(lNodeId);
            } else {
                this.getSelectedIds().add(lNodeId);
            }
        } else {
            if (!this.getSelectedIds().has(lNodeId)) {
                this.getSelectedIds().clear();
                this.getSelectedIds().add(lNodeId);
            }
        }
        this.rebuildCachedData();

        // Start dragging all selected nodes.
        const lOrigins: Array<{ nodeId: string; originX: number; originY: number }> = [];
        for (const lSelectedId of this.getSelectedIds()) {
            const lSelectedNode: PotatnoNode | undefined = this.getProject().activeFunction?.graph.getNode(lSelectedId);
            if (lSelectedNode) {
                lOrigins.push({
                    nodeId: lSelectedId,
                    originX: lSelectedNode.position.x * this.getInternals().interaction.gridSize,
                    originY: lSelectedNode.position.y * this.getInternals().interaction.gridSize
                });
            }
        }

        if (lOrigins.length > 0) {
            this.getInternals().interactionState = {
                mode: 'dragging-node',
                nodeId: lNodeId,
                startX: pEvent.clientX,
                startY: pEvent.clientY,
                origins: lOrigins
            };
            this.canvasWrapper.setPointerCapture(pEvent.pointerId);
        }
    }

    public onPortDragStart(pEvent: any): void {
        const lData = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        const lGraph: PotatnoGraph | undefined = this.getProject().activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        const lNode: PotatnoNode | undefined = lGraph.getNode(lData.nodeId);
        if (!lNode) {
            return;
        }

        const lGridSize: number = this.getInternals().interaction.gridSize;
        const lNodeX: number = lNode.position.x * lGridSize;
        const lNodeY: number = lNode.position.y * lGridSize;
        const lNodeW: number = lNode.size.w * lGridSize;
        const lHeaderHeight: number = 28;
        const lPortGap: number = 24;

        let lStartX: number;
        let lStartY: number;

        if (lData.portKind === 'flow') {
            // Flow ports are in the header.
            lStartX = lData.direction === 'output' ? lNodeX + lNodeW : lNodeX;
            lStartY = lNodeY + lHeaderHeight / 2;
        } else {
            // Data ports: find port index from the cached data.
            let lPortIndex: number = 0;
            if (lData.direction === 'output') {
                let lIdx: number = 0;
                for (const lPort of lNode.outputs.values()) {
                    if (lPort.id === lData.portId) { lPortIndex = lIdx; break; }
                    lIdx++;
                }
                lStartX = lNodeX + lNodeW;
            } else {
                let lIdx: number = 0;
                for (const lPort of lNode.inputs.values()) {
                    if (lPort.id === lData.portId) { lPortIndex = lIdx; break; }
                    lIdx++;
                }
                lStartX = lNodeX;
            }
            lStartY = lNodeY + lHeaderHeight + (lPortIndex + 0.5) * lPortGap;
        }

        this.getInternals().interactionState = {
            mode: 'dragging-wire',
            sourceNodeId: lData.nodeId,
            sourcePortId: lData.portId,
            portKind: lData.portKind,
            direction: lData.direction,
            type: lData.type,
            startX: lStartX,
            startY: lStartY
        };
    }

    /**
     * Track the port currently under the pointer for connection drop targeting.
     */
    public onPortHover(pEvent: any): void {
        const lData = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        this.getInternals().hoveredPort = {
            nodeId: lData.nodeId,
            portId: lData.portId,
            portKind: lData.portKind,
            direction: lData.direction,
            type: lData.type
        };
    }

    /**
     * Clear the hovered port when the pointer leaves a port element.
     */
    public onPortLeave(): void {
        this.getInternals().hoveredPort = null;
    }

    // ============================================================
    // Event Handlers: Keyboard
    // ============================================================

    private onKeyDown(pEvent: KeyboardEvent): void {
        // Delete selected nodes.
        if (pEvent.key === 'Delete') {
            this.deleteSelectedNodes();
            return;
        }

        // Undo.
        if (pEvent.ctrlKey && pEvent.key === 'z') {
            pEvent.preventDefault();
            this.getInternals().history.undo();
            this.rebuildCachedData();
            this.renderConnections();
            this.updatePreview();
            return;
        }

        // Redo.
        if (pEvent.ctrlKey && (pEvent.key === 'y' || (pEvent.shiftKey && pEvent.key === 'z'))) {
            pEvent.preventDefault();
            this.getInternals().history.redo();
            this.rebuildCachedData();
            this.renderConnections();
            this.updatePreview();
            return;
        }

        // Copy.
        if (pEvent.ctrlKey && pEvent.key === 'c') {
            const lGraph: PotatnoGraph | undefined = this.getProject().activeFunction?.graph;
            if (lGraph) {
                this.getInternals().clipboard.copy(lGraph, this.getSelectedIds());
            }
            return;
        }

        // Paste.
        if (pEvent.ctrlKey && pEvent.key === 'v') {
            this.pasteFromClipboard();
            return;
        }
    }

    // ============================================================
    // Panel Resize
    // ============================================================

    public onResizeLeftStart(pEvent: PointerEvent): void {
        pEvent.preventDefault();
        this.startPanelResize('left', pEvent);
    }

    public onResizeRightStart(pEvent: PointerEvent): void {
        pEvent.preventDefault();
        this.startPanelResize('right', pEvent);
    }

    private startPanelResize(pPanel: 'left' | 'right', pEvent: PointerEvent): void {
        const lPanelEl: HTMLElement = pPanel === 'left' ? this.panelLeft : this.panelRight;
        this.mResizeState = {
            panel: pPanel,
            startX: pEvent.clientX,
            startWidth: lPanelEl.offsetWidth
        };

        this.mResizeMoveHandler = (e: PointerEvent) => {
            if (!this.mResizeState) {
                return;
            }
            const lDelta: number = pPanel === 'left'
                ? e.clientX - this.mResizeState.startX
                : this.mResizeState.startX - e.clientX;
            const lNewWidth: number = Math.max(200, Math.min(500, this.mResizeState.startWidth + lDelta));
            lPanelEl.style.width = `${lNewWidth}px`;
        };

        this.mResizeUpHandler = () => {
            if (this.mResizeMoveHandler) {
                document.removeEventListener('pointermove', this.mResizeMoveHandler);
            }
            if (this.mResizeUpHandler) {
                document.removeEventListener('pointerup', this.mResizeUpHandler);
            }
            this.mResizeState = null;
        };

        document.addEventListener('pointermove', this.mResizeMoveHandler);
        document.addEventListener('pointerup', this.mResizeUpHandler);
    }

    // ============================================================
    // Private Methods
    // ============================================================

    private deleteSelectedNodes(): void {
        const lGraph: PotatnoGraph | undefined = this.getProject().activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        const lActions: Array<import('../../data_model/history/potatno-history-action.ts').PotatnoHistoryAction> = [];
        for (const lNodeId of this.getSelectedIds()) {
            const lNode: PotatnoNode | undefined = lGraph.getNode(lNodeId);
            if (lNode && !lNode.system) {
                lActions.push(new NodeRemoveAction(lGraph, lNodeId));
            }
        }

        if (lActions.length > 0) {
            this.getInternals().history.push(new CompositeAction('Delete nodes', lActions));
            this.getSelectedIds().clear();
            this.rebuildCachedData();
            this.renderConnections();
            this.updatePreview();
        }
    }

    private pasteFromClipboard(): void {
        const lData = this.getInternals().clipboard.getData();
        if (!lData) {
            return;
        }

        const lGraph: PotatnoGraph | undefined = this.getProject().activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        const lActions: Array<import('../../data_model/history/potatno-history-action.ts').PotatnoHistoryAction> = [];
        for (const lNodeData of lData.nodes) {
            const lDef: PotatnoNodeDefinition | undefined = this.getProject().configuration.nodeDefinitions.get(lNodeData.definitionName);
            if (lDef) {
                const lAction: NodeAddAction = new NodeAddAction(
                    lGraph,
                    lDef,
                    { x: lNodeData.position.x + 2, y: lNodeData.position.y + 2 }
                );
                lActions.push(lAction);
            }
        }

        if (lActions.length > 0) {
            this.getInternals().history.push(new CompositeAction('Paste nodes', lActions));
            this.rebuildCachedData();
            this.renderConnections();
            this.updatePreview();
        }
    }

    private selectNodesInBox(): void {
        const lGraph: PotatnoGraph | undefined = this.getProject().activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        // Convert box screen coordinates to world coordinates.
        const lTopLeft = this.getInternals().interaction.screenToWorld(
            Math.min(this.mSelectionBoxScreen.x1, this.mSelectionBoxScreen.x2),
            Math.min(this.mSelectionBoxScreen.y1, this.mSelectionBoxScreen.y2)
        );
        const lBottomRight = this.getInternals().interaction.screenToWorld(
            Math.max(this.mSelectionBoxScreen.x1, this.mSelectionBoxScreen.x2),
            Math.max(this.mSelectionBoxScreen.y1, this.mSelectionBoxScreen.y2)
        );

        for (const lNode of lGraph.nodes.values()) {
            const lNodeX: number = lNode.position.x * this.getInternals().interaction.gridSize;
            const lNodeY: number = lNode.position.y * this.getInternals().interaction.gridSize;

            if (lNodeX >= lTopLeft.x && lNodeX <= lBottomRight.x && lNodeY >= lTopLeft.y && lNodeY <= lBottomRight.y) {
                this.getSelectedIds().add(lNode.id);
            }
        }
        this.rebuildCachedData();
    }

    private renderConnections(): void {
        if (!this.svgLayer) {
            return;
        }

        const lGraph: PotatnoGraph | undefined = this.getProject().activeFunction?.graph;
        if (!lGraph) {
            this.getInternals().renderer.clearAll(this.svgLayer);
            return;
        }

        const lGridSize: number = this.getInternals().interaction.gridSize;
        const lHeaderHeight: number = 28;
        const lPortGap: number = 24;

        const lConnectionData: Array<any> = [];
        for (const lConn of lGraph.connections.values()) {
            const lSourceNode: PotatnoNode | undefined = lGraph.getNode(lConn.sourceNodeId);
            const lTargetNode: PotatnoNode | undefined = lGraph.getNode(lConn.targetNodeId);
            if (!lSourceNode || !lTargetNode) {
                continue;
            }

            const lSourceNodeX: number = lSourceNode.position.x * lGridSize;
            const lSourceNodeY: number = lSourceNode.position.y * lGridSize;
            const lTargetNodeX: number = lTargetNode.position.x * lGridSize;
            const lTargetNodeY: number = lTargetNode.position.y * lGridSize;
            const lSourceNodeW: number = lSourceNode.size.w * lGridSize;

            let lSourceX: number;
            let lSourceY: number;
            let lTargetX: number;
            let lTargetY: number;

            if (lConn.kind === PortKind.Data) {
                // Find port index for source (output) port.
                let lSourceIdx: number = 0;
                let lIdx: number = 0;
                for (const lPort of lSourceNode.outputs.values()) {
                    if (lPort.id === lConn.sourcePortId) {
                        lSourceIdx = lIdx;
                        break;
                    }
                    lIdx++;
                }

                // Find port index for target (input) port.
                let lTargetIdx: number = 0;
                lIdx = 0;
                for (const lPort of lTargetNode.inputs.values()) {
                    if (lPort.id === lConn.targetPortId) {
                        lTargetIdx = lIdx;
                        break;
                    }
                    lIdx++;
                }

                lSourceX = lSourceNodeX + lSourceNodeW;
                lSourceY = lSourceNodeY + lHeaderHeight + (lSourceIdx + 0.5) * lPortGap;
                lTargetX = lTargetNodeX;
                lTargetY = lTargetNodeY + lHeaderHeight + (lTargetIdx + 0.5) * lPortGap;
            } else {
                // Flow connections: ports are in the header.
                const lTargetNodeW: number = lTargetNode.size.w * lGridSize;
                lSourceX = lSourceNodeX + lSourceNodeW;
                lSourceY = lSourceNodeY + lHeaderHeight / 2;
                lTargetX = lTargetNodeX;
                lTargetY = lTargetNodeY + lHeaderHeight / 2;
            }

            lConnectionData.push({
                id: lConn.id,
                sourceX: lSourceX,
                sourceY: lSourceY,
                targetX: lTargetX,
                targetY: lTargetY,
                color: lConn.valid ? 'var(--pn-text-secondary)' : 'var(--pn-accent-danger)',
                valid: lConn.valid
            });
        }

        this.getInternals().renderer.renderConnections(this.svgLayer, lConnectionData);
    }

    private updatePreview(): void {
        const lCallback = this.getProject().configuration.previewCallback;
        if (!lCallback) {
            return;
        }

        // If there are errors, don't generate code.
        if (this.mCachedErrors.length > 0) {
            return;
        }

        // Generate code synchronously while still inside the current update cycle.
        // Reading tracked properties here is expected and will not trigger a new cycle.
        let lCleanCode: string;
        try {
            const lCode: string = this.generateCode();
            lCleanCode = this.stripMetadataComments(lCode);
        } catch {
            return;
        }

        // Capture the preview element reference so the timeout callback
        // does not access the processor proxy at all.
        const lPreviewEl: any = (this as any).previewEl;

        // Debounce only the lightweight DOM update.  The callback uses only
        // local variables (primitive string, function ref, DOM element) so it
        // never reaches into proxy-wrapped objects and cannot trigger an
        // UntrackableFunctionCall loop.
        clearTimeout(this.mPreviewDebounceTimer);
        this.mPreviewDebounceTimer = setTimeout(() => {
            try {
                const lFragment: DocumentFragment = lCallback(lCleanCode);
                if (lPreviewEl && typeof lPreviewEl.setContent === 'function') {
                    lPreviewEl.setContent(lFragment);
                }
            } catch {
                // Silently ignore preview errors.
            }
        }, 300) as unknown as number;
    }

    private stripMetadataComments(pCode: string): string {
        const lToken: string = this.getProject().configuration.commentToken;
        const lLines: Array<string> = pCode.split('\n');
        const lFiltered: Array<string> = lLines.filter((lLine) => {
            const lTrimmed: string = lLine.trim();
            return !lTrimmed.startsWith(`${lToken} __POTATNO_START:`) && !lTrimmed.startsWith(`${lToken} __POTATNO_END:`);
        });
        return lFiltered.join('\n');
    }

    /**
     * Update only a single node's pixel position in the cached visible nodes array.
     * Avoids a full rebuildCachedData during drag operations for better performance.
     */
    private updateNodePosition(pNodeId: string): void {
        const lProject = this.getProject();
        const lNode = lProject.activeFunction?.graph.getNode(pNodeId);
        if (!lNode) {
            return;
        }
        for (const lCachedNode of this.mCachedVisibleNodes) {
            if (lCachedNode.id === pNodeId) {
                lCachedNode.position = { x: lNode.position.x, y: lNode.position.y };
                lCachedNode.pixelX = lNode.position.x * this.getInternals().interaction.gridSize;
                lCachedNode.pixelY = lNode.position.y * this.getInternals().interaction.gridSize;
                break;
            }
        }
    }

    /**
     * Validate the current project and return a list of errors.
     * Checks for disconnected input ports and invalid connections.
     */
    private validateProject(): Array<{ message: string; location: string }> {
        const lErrors: Array<{ message: string; location: string }> = [];
        const lProject: PotatnoProject = this.getProject();
        const lNameRegex: RegExp = /^[a-zA-Z][a-zA-Z0-9_]*$/;
        const lFunctionNames: Set<string> = new Set<string>();

        // Check all functions for naming errors.
        for (const lFunc of lProject.functions.values()) {
            // Duplicate function name check.
            if (lFunctionNames.has(lFunc.name)) {
                lErrors.push({ message: `Duplicate function name "${lFunc.name}".`, location: `Function "${lFunc.name}"` });
            }
            lFunctionNames.add(lFunc.name);

            // Invalid function name.
            if (!lNameRegex.test(lFunc.name)) {
                lErrors.push({ message: `Invalid function name "${lFunc.name}". Must start with a letter and contain only letters, digits, and underscores.`, location: `Function "${lFunc.name}"` });
            }

            // Input name validation.
            const lPortNames: Set<string> = new Set<string>();
            for (const lInput of lFunc.inputs) {
                if (!lNameRegex.test(lInput.name)) {
                    lErrors.push({ message: `Invalid input name "${lInput.name}".`, location: `Function "${lFunc.name}" > Inputs` });
                }
                if (lPortNames.has(lInput.name)) {
                    lErrors.push({ message: `Duplicate input/output name "${lInput.name}".`, location: `Function "${lFunc.name}" > Inputs` });
                }
                lPortNames.add(lInput.name);
            }

            // Output name validation.
            for (const lOutput of lFunc.outputs) {
                if (!lNameRegex.test(lOutput.name)) {
                    lErrors.push({ message: `Invalid output name "${lOutput.name}".`, location: `Function "${lFunc.name}" > Outputs` });
                }
                if (lPortNames.has(lOutput.name)) {
                    lErrors.push({ message: `Duplicate input/output name "${lOutput.name}".`, location: `Function "${lFunc.name}" > Outputs` });
                }
                lPortNames.add(lOutput.name);
            }
        }

        const lFunc: PotatnoFunction | undefined = lProject.activeFunction;
        if (!lFunc) {
            lErrors.push({ message: 'No active function selected.', location: 'Editor' });
            return lErrors;
        }

        // Check for disconnected input ports (required inputs with no connection).
        for (const lNode of lFunc.graph.nodes.values()) {
            for (const lInput of lNode.inputs.values()) {
                if (!lInput.connectedTo && !lNode.system) {
                    lErrors.push({
                        message: `Input "${lInput.name}" on node "${lNode.definitionName}" is not connected.`,
                        location: `Function "${lFunc.name}" > Node "${lNode.definitionName}"`
                    });
                }
            }
        }

        // Check for invalid connections (type mismatches).
        for (const lConn of lFunc.graph.connections.values()) {
            if (!lConn.valid) {
                lErrors.push({
                    message: `Type mismatch on connection.`,
                    location: `Function "${lFunc.name}"`
                });
            }
        }

        return lErrors;
    }

    /**
     * Rebuild all cached view data arrays. Call this whenever the underlying
     * data model changes so that PWB sees a new reference only when data has
     * actually been modified.
     */
    private rebuildCachedData(): void {
        // Active function ID.
        this.mCachedActiveFunctionId = this.getProject().activeFunctionId;

        // Preview availability.
        this.mCachedHasPreview = this.getProject().configuration.previewCallback !== null;

        // Validate and cache errors.
        this.mCachedErrors = this.validateProject();

        // Node definitions.
        const lNodeDefs: Array<{ name: string; category: string }> = [];
        for (const lDef of this.getProject().configuration.nodeDefinitions.values()) {
            lNodeDefs.push({ name: lDef.name, category: lDef.category });
        }
        // Add user-defined (non-system) functions as callable nodes.
        for (const lFunc of this.getProject().functions.values()) {
            if (!lFunc.system) {
                lNodeDefs.push({ name: lFunc.name, category: NodeCategory.Function });
            }
        }
        this.mCachedNodeDefinitionList = lNodeDefs;

        // Function list.
        const lFuncs: Array<{ id: string; name: string; label: string; system: boolean }> = [];
        for (const lFunc of this.getProject().functions.values()) {
            lFuncs.push({ id: lFunc.id, name: lFunc.name, label: lFunc.label, system: lFunc.system });
        }
        this.mCachedFunctionList = lFuncs;

        // Available imports.
        this.mCachedAvailableImports = this.getProject().configuration.globalValues.map(g => g.name);

        // Available types (collected from all node definition ports).
        const lTypeSet: Set<string> = new Set<string>();
        for (const lDef of this.getProject().configuration.nodeDefinitions.values()) {
            for (const lInput of lDef.inputs) {
                lTypeSet.add(lInput.type);
            }
            for (const lOutput of lDef.outputs) {
                lTypeSet.add(lOutput.type);
            }
        }
        this.mCachedAvailableTypes = [...lTypeSet].sort();

        // Active function data.
        const lActiveFunc: PotatnoFunction | undefined = this.getProject().activeFunction;
        this.mCachedActiveFunctionName = lActiveFunc?.name ?? '';
        this.mCachedActiveFunctionIsSystem = lActiveFunc?.system ?? false;
        this.mCachedActiveFunctionInputs = [...(lActiveFunc?.inputs ?? [])];
        this.mCachedActiveFunctionOutputs = [...(lActiveFunc?.outputs ?? [])];
        this.mCachedActiveFunctionImports = [...(lActiveFunc?.imports ?? [])];

        // Visible nodes.
        if (lActiveFunc) {
            // Build a set of output port IDs that have connections.
            const lConnectedOutputPortIds: Set<string> = new Set<string>();
            const lConnectedFlowPortIds: Set<string> = new Set<string>();
            for (const lConn of lActiveFunc.graph.connections.values()) {
                lConnectedOutputPortIds.add(lConn.sourcePortId);
                // For flow ports, both sides are "connected".
                lConnectedFlowPortIds.add(lConn.sourcePortId);
                lConnectedFlowPortIds.add(lConn.targetPortId);
            }

            const lNodes: Array<any> = [];
            for (const lNode of lActiveFunc.graph.nodes.values()) {
                const lDef = this.getProject().configuration.nodeDefinitions.get(lNode.definitionName);
                const lCategoryMeta = NODE_CATEGORY_META[lNode.category] ?? { icon: '?', cssColor: 'var(--pn-text-muted)', label: 'Unknown' };
                // CRITICAL: Only include plain primitives and pre-spread arrays
                // in cached render data. NEVER include references to data model
                // objects (PotatnoNode, Map, Set) because PWB's deep proxy will
                // wrap them and break internal Map/Set operations, causing the
                // function switching bug.
                const lInputs: Array<{ id: string; name: string; type: string; direction: string; connectedTo: string | null }> = [];
                for (const lPort of lNode.inputs.values()) {
                    lInputs.push({ id: lPort.id, name: lPort.name, type: lPort.type, direction: lPort.direction, connectedTo: lPort.connectedTo });
                }
                const lOutputs: Array<{ id: string; name: string; type: string; direction: string; connectedTo: string | null }> = [];
                for (const lPort of lNode.outputs.values()) {
                    // Output ports don't track connectedTo in the data model.
                    // Check the connection set to determine if this port is connected.
                    const lIsConnected: boolean = lConnectedOutputPortIds.has(lPort.id);
                    lOutputs.push({ id: lPort.id, name: lPort.name, type: lPort.type, direction: lPort.direction, connectedTo: lIsConnected ? 'connected' : null });
                }
                const lFlowIns: Array<{ id: string; name: string; direction: string; connectedTo: string | null }> = [];
                for (const lPort of lNode.flowInputs.values()) {
                    lFlowIns.push({ id: lPort.id, name: lPort.name, direction: lPort.direction, connectedTo: lConnectedFlowPortIds.has(lPort.id) ? 'connected' : null });
                }
                const lFlowOuts: Array<{ id: string; name: string; direction: string; connectedTo: string | null }> = [];
                for (const lPort of lNode.flowOutputs.values()) {
                    lFlowOuts.push({ id: lPort.id, name: lPort.name, direction: lPort.direction, connectedTo: lConnectedFlowPortIds.has(lPort.id) ? 'connected' : null });
                }

                lNodes.push({
                    id: lNode.id,
                    definitionName: lNode.definitionName,
                    category: lNode.category,
                    categoryColor: lCategoryMeta.cssColor,
                    categoryIcon: lCategoryMeta.icon,
                    label: lNode.definitionName,
                    position: { x: lNode.position.x, y: lNode.position.y },
                    size: { w: lNode.size.w, h: lNode.size.h },
                    system: lNode.system,
                    selected: this.getSelectedIds().has(lNode.id),
                    inputs: lInputs,
                    outputs: lOutputs,
                    flowInputs: lFlowIns,
                    flowOutputs: lFlowOuts,
                    valueText: lNode.properties.get('value') ?? '',
                    commentText: lNode.properties.get('comment') ?? '',
                    hasDefinition: !!lDef,
                    pixelX: lNode.position.x * this.getInternals().interaction.gridSize,
                    pixelY: lNode.position.y * this.getInternals().interaction.gridSize
                });
            }
            this.mCachedVisibleNodes = lNodes;
        } else {
            this.mCachedVisibleNodes = [];
        }
    }
}
