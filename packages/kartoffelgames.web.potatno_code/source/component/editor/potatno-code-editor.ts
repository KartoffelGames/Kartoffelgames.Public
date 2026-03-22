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
    | { mode: 'selecting'; startX: number; startY: number }
    | { mode: 'resizing-comment'; nodeId: string; startX: number; startY: number; originalW: number; originalH: number };

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
 * All cached view data. Stored outside PWB's deep proxy to prevent
 * cascading update loops when multiple properties change at once.
 */
interface CachedViewData {
    activeFunctionId: string;
    activeFunctionName: string;
    activeFunctionIsSystem: boolean;
    activeFunctionEditableByUser: boolean;
    errors: Array<{ message: string; location: string }>;
    hasPreview: boolean;
    nodeDefinitionList: Array<{ name: string; category: string }>;
    functionList: Array<{ id: string; name: string; label: string; system: boolean }>;
    availableImports: Array<string>;
    availableTypes: Array<string>;
    activeFunctionInputs: Array<{ name: string; type: string }>;
    activeFunctionOutputs: Array<{ name: string; type: string }>;
    activeFunctionImports: Array<string>;
    visibleNodes: Array<any>;
}

/**
 * Module-level storage for all complex objects that must NEVER be
 * deep-proxied by PWB. This includes the history (which holds graph
 * references with Maps), the clipboard, the canvas interaction helper,
 * the SVG renderer, and all cached view data.
 */
interface EditorInternals {
    history: PotatnoHistory;
    clipboard: PotatnoClipboard;
    interaction: PotatnoCanvasInteraction;
    renderer: PotatnoCanvasRenderer;
    hoveredPort: { nodeId: string; portId: string; portKind: string; direction: string; type: string } | null;
    interactionState: InteractionState;
    cachedData: CachedViewData;
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

    /**
     * Single tracked property. Incrementing this triggers exactly ONE
     * PWB update cycle. All actual data is read from the unproxied
     * gInternalsStore.cachedData.
     */
    private mCacheVersion: number;

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
    // Each getter reads this.mCacheVersion to register PWB tracking,
    // then returns data from the unproxied module-level store.

    public get project(): PotatnoProject {
        return this.getProject();
    }

    public get activeFunctionId(): string {
        void this.mCacheVersion;
        return this.getInternals().cachedData.activeFunctionId;
    }

    public get interaction(): PotatnoCanvasInteraction {
        return this.getInternals().interaction;
    }

    public get showSelectionBox(): boolean {
        return this.mShowSelectionBox;
    }

    public get hasPreview(): boolean {
        void this.mCacheVersion;
        return this.getInternals().cachedData.hasPreview;
    }

    public get editorErrors(): Array<{ message: string; location: string }> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.errors;
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
        void this.mCacheVersion;
        return this.getInternals().cachedData.visibleNodes;
    }

    public get nodeDefinitionList(): Array<{ name: string; category: string }> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.nodeDefinitionList;
    }

    public get functionList(): Array<{ id: string; name: string; label: string; system: boolean }> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.functionList;
    }

    public get activeFunctionName(): string {
        void this.mCacheVersion;
        return this.getInternals().cachedData.activeFunctionName;
    }

    public get activeFunctionInputs(): Array<{ name: string; type: string }> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.activeFunctionInputs;
    }

    public get activeFunctionOutputs(): Array<{ name: string; type: string }> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.activeFunctionOutputs;
    }

    public get activeFunctionImports(): Array<string> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.activeFunctionImports;
    }

    public get activeFunctionIsSystem(): boolean {
        void this.mCacheVersion;
        return this.getInternals().cachedData.activeFunctionIsSystem;
    }

    public get activeFunctionEditableByUser(): boolean {
        void this.mCacheVersion;
        return this.getInternals().cachedData.activeFunctionEditableByUser;
    }

    public get availableImportsList(): Array<string> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.availableImports;
    }

    public get availableTypes(): Array<string> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.availableTypes;
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
     * This keeps history, clipboard, interaction, renderer, cached data
     * and interaction state completely outside PWB's deep proxy reach.
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
            interactionState: { mode: 'idle' },
            cachedData: {
                activeFunctionId: '',
                activeFunctionName: '',
                activeFunctionIsSystem: false,
                activeFunctionEditableByUser: false,
                errors: [],
                hasPreview: false,
                nodeDefinitionList: [],
                functionList: [],
                availableImports: [],
                availableTypes: [],
                activeFunctionInputs: [],
                activeFunctionOutputs: [],
                activeFunctionImports: [],
                visibleNodes: []
            }
        });
        this.mShowSelectionBox = false;
        this.mSelectionBoxScreen = { x1: 0, y1: 0, x2: 0, y2: 0 };
        this.mPreviewDebounceTimer = 0;
        this.mKeyboardHandler = null;
        this.mResizeState = null;
        this.mResizeMoveHandler = null;
        this.mResizeUpHandler = null;
        this.mCacheVersion = 0;
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
        const lProject: PotatnoProject = this.getProject();
        const lSerializer: PotatnoSerializer = new PotatnoSerializer(lProject.configuration);
        return lSerializer.serialize(lProject);
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
        const lProject: PotatnoProject = this.getProject();
        let lDefinition: PotatnoNodeDefinition | undefined = lProject.configuration.nodeDefinitions.get(lDefName);

        // Check if it's a user-defined function rather than a built-in node definition.
        if (!lDefinition) {
            for (const lFunc of lProject.functions.values()) {
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

        const lGraph: PotatnoGraph | undefined = lProject.activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        // Place at center of visible area.
        const lInternals: EditorInternals = this.getInternals();
        const lWrapper: HTMLElement = this.canvasWrapper;
        const lWidth: number = lWrapper ? lWrapper.clientWidth || 800 : 800;
        const lHeight: number = lWrapper ? lWrapper.clientHeight || 600 : 600;
        const lCenter = lInternals.interaction.screenToWorld(lWidth / 2, lHeight / 2);
        const lSnapped = lInternals.interaction.snapToGrid(lCenter.x, lCenter.y);

        const lAction: NodeAddAction = new NodeAddAction(lGraph, lDefinition, { x: lSnapped.x / lInternals.interaction.gridSize, y: lSnapped.y / lInternals.interaction.gridSize });
        lInternals.history.push(lAction);
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
        const lProject: PotatnoProject = this.getProject();
        const lCount: number = this.getInternals().cachedData.functionList.length;
        const lFunc: PotatnoFunction = lProject.addFunction(
            `function_${lCount}`,
            `Function ${lCount}`,
            false
        );
        lProject.setActiveFunction(lFunc.id);
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
        const lInternals: EditorInternals = this.getInternals();

        // Middle mouse: pan.
        if (pEvent.button === 1) {
            pEvent.preventDefault();
            lInternals.interactionState = { mode: 'panning', startX: pEvent.clientX, startY: pEvent.clientY };
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
            lInternals.interactionState = { mode: 'selecting', startX: lX, startY: lY };
            this.mSelectionBoxScreen = { x1: lX, y1: lY, x2: lX, y2: lY };
            this.mShowSelectionBox = false; // Show only after a minimum drag distance.
            (pEvent.currentTarget as HTMLElement).setPointerCapture(pEvent.pointerId);
        }
    }

    public onCanvasPointerMove(pEvent: PointerEvent): void {
        const lInternals: EditorInternals = this.getInternals();
        const lState: InteractionState = lInternals.interactionState;

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

        if (lState.mode === 'resizing-comment') {
            const lDx: number = (pEvent.clientX - lState.startX) / lInternals.interaction.zoom;
            const lDy: number = (pEvent.clientY - lState.startY) / lInternals.interaction.zoom;
            const lGridSize: number = lInternals.interaction.gridSize;
            const lNewW: number = lState.originalW + Math.round(lDx / lGridSize);
            const lNewH: number = lState.originalH + Math.round(lDy / lGridSize);
            const lNode: PotatnoNode | undefined = this.getProject().activeFunction?.graph.getNode(lState.nodeId);
            if (lNode) {
                lNode.resizeTo(lNewW, lNewH);
                this.updateNodeSize(lState.nodeId);
            }
            return;
        }
    }

    public onCanvasPointerUp(pEvent: PointerEvent): void {
        const lInternals: EditorInternals = this.getInternals();

        if (lInternals.interactionState.mode === 'dragging-node') {
            this.rebuildCachedData();
            this.renderConnections();
            this.updatePreview();
        }

        if (lInternals.interactionState.mode === 'dragging-wire') {
            lInternals.renderer.clearTempConnection(this.svgLayer);

            // Finalize connection if dropped on a valid port.
            if (lInternals.hoveredPort) {
                const lTarget = lInternals.hoveredPort;

                // Validate: must connect output-to-input (or input-to-output) and same port kind.
                if (lInternals.interactionState.direction !== lTarget.direction &&
                    lInternals.interactionState.portKind === lTarget.portKind) {

                    const lGraph: PotatnoGraph | undefined = this.getProject().activeFunction?.graph;
                    if (lGraph) {
                        const lKind: PortKind = lInternals.interactionState.portKind === 'data' ? PortKind.Data : PortKind.Flow;

                        let lSourceNodeId: string;
                        let lSourcePortId: string;
                        let lTargetNodeId: string;
                        let lTargetPortId: string;

                        if (lInternals.interactionState.direction === 'output') {
                            lSourceNodeId = lInternals.interactionState.sourceNodeId;
                            lSourcePortId = lInternals.interactionState.sourcePortId;
                            lTargetNodeId = lTarget.nodeId;
                            lTargetPortId = lTarget.portId;
                        } else {
                            lSourceNodeId = lTarget.nodeId;
                            lSourcePortId = lTarget.portId;
                            lTargetNodeId = lInternals.interactionState.sourceNodeId;
                            lTargetPortId = lInternals.interactionState.sourcePortId;
                        }

                        lGraph.addConnection(lSourceNodeId, lSourcePortId, lTargetNodeId, lTargetPortId, lKind);
                        this.rebuildCachedData();
                        this.renderConnections();
                        this.updatePreview();
                    }
                }
            }
        }

        if (lInternals.interactionState.mode === 'selecting') {
            this.mShowSelectionBox = false;
            // Select nodes within the selection box.
            this.selectNodesInBox();
        }

        if (lInternals.interactionState.mode === 'resizing-comment') {
            this.rebuildCachedData();
        }

        lInternals.interactionState = { mode: 'idle' };
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
        const lInternals: EditorInternals = this.getInternals();
        const lSelectedIds: Set<string> = this.getSelectedIds();

        // Selection.
        if (pEvent.ctrlKey) {
            if (lSelectedIds.has(lNodeId)) {
                lSelectedIds.delete(lNodeId);
            } else {
                lSelectedIds.add(lNodeId);
            }
        } else {
            if (!lSelectedIds.has(lNodeId)) {
                lSelectedIds.clear();
                lSelectedIds.add(lNodeId);
            }
        }
        this.rebuildCachedData();

        // Start dragging all selected nodes.
        const lOrigins: Array<{ nodeId: string; originX: number; originY: number }> = [];
        const lGraph: PotatnoGraph | undefined = this.getProject().activeFunction?.graph;

        for (const lSelectedId of lSelectedIds) {
            const lSelectedNode: PotatnoNode | undefined = lGraph?.getNode(lSelectedId);
            if (lSelectedNode) {
                lOrigins.push({
                    nodeId: lSelectedId,
                    originX: lSelectedNode.position.x * lInternals.interaction.gridSize,
                    originY: lSelectedNode.position.y * lInternals.interaction.gridSize
                });
            }
        }

        // If dragging a comment node, also include non-comment nodes inside its bounds.
        if (lGraph) {
            const lDraggedNode: PotatnoNode | undefined = lGraph.getNode(lNodeId);
            if (lDraggedNode && lDraggedNode.category === NodeCategory.Comment) {
                const lGs: number = lInternals.interaction.gridSize;
                const lCommentLeft: number = lDraggedNode.position.x * lGs;
                const lCommentTop: number = lDraggedNode.position.y * lGs;
                const lCommentRight: number = lCommentLeft + lDraggedNode.size.w * lGs;
                const lCommentBottom: number = lCommentTop + lDraggedNode.size.h * lGs;

                for (const lNode of lGraph.nodes.values()) {
                    if (lNode.id === lNodeId || lSelectedIds.has(lNode.id)) {
                        continue; // Already included or is the comment itself.
                    }
                    if (lNode.category === NodeCategory.Comment) {
                        continue; // Don't auto-include other comment nodes.
                    }
                    const lNx: number = lNode.position.x * lGs;
                    const lNy: number = lNode.position.y * lGs;
                    if (lNx >= lCommentLeft && lNx <= lCommentRight && lNy >= lCommentTop && lNy <= lCommentBottom) {
                        lOrigins.push({
                            nodeId: lNode.id,
                            originX: lNx,
                            originY: lNy
                        });
                    }
                }
            }
        }

        if (lOrigins.length > 0) {
            lInternals.interactionState = {
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

        const lInternals: EditorInternals = this.getInternals();
        const lGridSize: number = lInternals.interaction.gridSize;
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

        lInternals.interactionState = {
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

    /**
     * Handle resize-start event from comment nodes.
     */
    public onNodeResizeStart(pEvent: any, _pNodeRender: any): void {
        const lData = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        const lNode: PotatnoNode | undefined = this.getProject().activeFunction?.graph.getNode(lData.nodeId);
        if (!lNode) {
            return;
        }

        this.getInternals().interactionState = {
            mode: 'resizing-comment',
            nodeId: lData.nodeId,
            startX: lData.startX,
            startY: lData.startY,
            originalW: lNode.size.w,
            originalH: lNode.size.h
        };
        this.canvasWrapper.setPointerCapture(pEvent.pointerId ?? lData.startX);
    }

    /**
     * Handle comment text changes from comment nodes.
     */
    public onCommentChange(pEvent: any): void {
        const lData = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        const lNode: PotatnoNode | undefined = this.getProject().activeFunction?.graph.getNode(lData.nodeId);
        if (lNode) {
            const lAction: PropertyChangeAction = new PropertyChangeAction(lNode, 'comment', lData.text);
            this.getInternals().history.push(lAction);
            this.rebuildCachedData();
        }
    }

    /**
     * Handle value changes from value nodes.
     */
    public onValueChange(pEvent: any): void {
        const lData = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        const lNode: PotatnoNode | undefined = this.getProject().activeFunction?.graph.getNode(lData.nodeId);
        if (lNode) {
            const lAction: PropertyChangeAction = new PropertyChangeAction(lNode, lData.property, lData.value);
            this.getInternals().history.push(lAction);
            this.rebuildCachedData();
            this.updatePreview();
        }
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
        const lInternals: EditorInternals = this.getInternals();
        const lData = lInternals.clipboard.getData();
        if (!lData) {
            return;
        }

        const lProject: PotatnoProject = this.getProject();
        const lGraph: PotatnoGraph | undefined = lProject.activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        const lActions: Array<import('../../data_model/history/potatno-history-action.ts').PotatnoHistoryAction> = [];
        const lAddActions: Array<NodeAddAction> = [];
        for (const lNodeData of lData.nodes) {
            const lDef: PotatnoNodeDefinition | undefined = lProject.configuration.nodeDefinitions.get(lNodeData.definitionName);
            if (lDef) {
                const lAction: NodeAddAction = new NodeAddAction(
                    lGraph,
                    lDef,
                    { x: lNodeData.position.x + 2, y: lNodeData.position.y + 2 }
                );
                lActions.push(lAction);
                lAddActions.push(lAction);
            }
        }

        if (lActions.length > 0) {
            lInternals.history.push(new CompositeAction('Paste nodes', lActions));

            // Restore properties (e.g., value text for value nodes, comment text).
            for (let lIdx: number = 0; lIdx < lAddActions.length; lIdx++) {
                const lNewNode: PotatnoNode | null = lAddActions[lIdx].node;
                const lNodeData = lData.nodes[lIdx];
                if (lNewNode && lNodeData.properties) {
                    for (const [lKey, lValue] of Object.entries(lNodeData.properties)) {
                        lNewNode.properties.set(lKey, lValue);
                    }
                }
            }

            // Restore internal connections between pasted nodes.
            for (const lConnData of lData.internalConnections) {
                const lSourceNode: PotatnoNode | null = lAddActions[lConnData.sourceNodeIndex]?.node ?? null;
                const lTargetNode: PotatnoNode | null = lAddActions[lConnData.targetNodeIndex]?.node ?? null;
                if (lSourceNode && lTargetNode) {
                    // Find port IDs by name.
                    let lSourcePortId: string = '';
                    let lTargetPortId: string = '';
                    const lKind: PortKind = lConnData.kind === 'flow' ? PortKind.Flow : PortKind.Data;

                    if (lKind === PortKind.Data) {
                        for (const [lName, lPort] of lSourceNode.outputs) {
                            if (lName === lConnData.sourcePortName) {
                                lSourcePortId = lPort.id;
                                break;
                            }
                        }
                        for (const [lName, lPort] of lTargetNode.inputs) {
                            if (lName === lConnData.targetPortName) {
                                lTargetPortId = lPort.id;
                                break;
                            }
                        }
                    } else {
                        for (const [lName, lPort] of lSourceNode.flowOutputs) {
                            if (lName === lConnData.sourcePortName) {
                                lSourcePortId = lPort.id;
                                break;
                            }
                        }
                        for (const [lName, lPort] of lTargetNode.flowInputs) {
                            if (lName === lConnData.targetPortName) {
                                lTargetPortId = lPort.id;
                                break;
                            }
                        }
                    }

                    if (lSourcePortId && lTargetPortId) {
                        lGraph.addConnection(lSourceNode.id, lSourcePortId, lTargetNode.id, lTargetPortId, lKind);
                    }
                }
            }

            // Select pasted nodes.
            this.getSelectedIds().clear();
            for (const lAction of lAddActions) {
                if (lAction.node) {
                    this.getSelectedIds().add(lAction.node.id);
                }
            }

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

        const lInternals: EditorInternals = this.getInternals();

        // Convert box screen coordinates to world coordinates.
        const lTopLeft = lInternals.interaction.screenToWorld(
            Math.min(this.mSelectionBoxScreen.x1, this.mSelectionBoxScreen.x2),
            Math.min(this.mSelectionBoxScreen.y1, this.mSelectionBoxScreen.y2)
        );
        const lBottomRight = lInternals.interaction.screenToWorld(
            Math.max(this.mSelectionBoxScreen.x1, this.mSelectionBoxScreen.x2),
            Math.max(this.mSelectionBoxScreen.y1, this.mSelectionBoxScreen.y2)
        );

        const lGridSize: number = lInternals.interaction.gridSize;

        for (const lNode of lGraph.nodes.values()) {
            const lNodeX: number = lNode.position.x * lGridSize;
            const lNodeY: number = lNode.position.y * lGridSize;
            const lNodeRight: number = lNodeX + lNode.size.w * lGridSize;
            const lNodeBottom: number = lNodeY + lNode.size.h * lGridSize;

            // Rectangle intersection test: select if ANY part of the node overlaps the selection box.
            if (lNodeX < lBottomRight.x && lNodeRight > lTopLeft.x && lNodeY < lBottomRight.y && lNodeBottom > lTopLeft.y) {
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

        const lInternals: EditorInternals = this.getInternals();
        const lGridSize: number = lInternals.interaction.gridSize;
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

        lInternals.renderer.renderConnections(this.svgLayer, lConnectionData);
    }

    private updatePreview(): void {
        const lProject: PotatnoProject = this.getProject();
        const lCallback = lProject.configuration.previewCallback;
        if (!lCallback) {
            return;
        }

        // If there are errors, don't generate code.
        const lCachedData: CachedViewData = this.getInternals().cachedData;
        if (lCachedData.errors.length > 0) {
            return;
        }

        // Generate code using the raw project reference (no proxy access).
        let lCleanCode: string;
        try {
            const lSerializer: PotatnoSerializer = new PotatnoSerializer(lProject.configuration);
            const lCode: string = lSerializer.serialize(lProject);
            lCleanCode = this.stripMetadataComments(lCode, lProject.configuration.commentToken);
        } catch {
            return;
        }

        // Capture the preview element reference.
        const lPreviewEl: any = (this as any).previewEl;

        // Debounce the DOM update.
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

    private stripMetadataComments(pCode: string, pToken: string): string {
        const lLines: Array<string> = pCode.split('\n');
        const lFiltered: Array<string> = lLines.filter((lLine) => {
            const lTrimmed: string = lLine.trim();
            return !lTrimmed.startsWith(`${pToken} __POTATNO_START:`) && !lTrimmed.startsWith(`${pToken} __POTATNO_END:`);
        });
        return lFiltered.join('\n');
    }

    /**
     * Update only a single node's pixel position in the cached visible nodes array.
     * Avoids a full rebuildCachedData during drag operations for better performance.
     */
    private updateNodePosition(pNodeId: string): void {
        const lProject: PotatnoProject = this.getProject();
        const lNode: PotatnoNode | undefined = lProject.activeFunction?.graph.getNode(pNodeId);
        if (!lNode) {
            return;
        }
        const lGridSize: number = this.getInternals().interaction.gridSize;
        for (const lCachedNode of this.getInternals().cachedData.visibleNodes) {
            if (lCachedNode.id === pNodeId) {
                lCachedNode.position = { x: lNode.position.x, y: lNode.position.y };
                lCachedNode.pixelX = lNode.position.x * lGridSize;
                lCachedNode.pixelY = lNode.position.y * lGridSize;
                break;
            }
        }
    }

    /**
     * Update only a single node's size in the cached visible nodes array.
     * Avoids a full rebuildCachedData during resize operations.
     */
    private updateNodeSize(pNodeId: string): void {
        const lProject: PotatnoProject = this.getProject();
        const lNode: PotatnoNode | undefined = lProject.activeFunction?.graph.getNode(pNodeId);
        if (!lNode) {
            return;
        }
        for (const lCachedNode of this.getInternals().cachedData.visibleNodes) {
            if (lCachedNode.id === pNodeId) {
                lCachedNode.size = { w: lNode.size.w, h: lNode.size.h };
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
     * Rebuild all cached view data. Writes to the unproxied module-level
     * store, then increments mCacheVersion ONCE to trigger exactly one
     * PWB update cycle.
     */
    private rebuildCachedData(): void {
        const lProject: PotatnoProject = this.getProject();
        const lCached: CachedViewData = this.getInternals().cachedData;

        // Active function ID.
        lCached.activeFunctionId = lProject.activeFunctionId;

        // Preview availability.
        lCached.hasPreview = lProject.configuration.previewCallback !== null;

        // Validate and cache errors.
        lCached.errors = this.validateProject();

        // Node definitions.
        const lNodeDefs: Array<{ name: string; category: string }> = [];
        for (const lDef of lProject.configuration.nodeDefinitions.values()) {
            lNodeDefs.push({ name: lDef.name, category: lDef.category });
        }
        // Add user-defined (non-system) functions as callable nodes.
        for (const lFunc of lProject.functions.values()) {
            if (!lFunc.system) {
                lNodeDefs.push({ name: lFunc.name, category: NodeCategory.Function });
            }
        }
        lCached.nodeDefinitionList = lNodeDefs;

        // Function list.
        const lFuncs: Array<{ id: string; name: string; label: string; system: boolean }> = [];
        for (const lFunc of lProject.functions.values()) {
            lFuncs.push({ id: lFunc.id, name: lFunc.name, label: lFunc.label, system: lFunc.system });
        }
        lCached.functionList = lFuncs;

        // Available imports.
        lCached.availableImports = lProject.configuration.globalValues.map(g => g.name);

        // Available types (collected from all node definition ports).
        const lTypeSet: Set<string> = new Set<string>();
        for (const lDef of lProject.configuration.nodeDefinitions.values()) {
            for (const lInput of lDef.inputs) {
                lTypeSet.add(lInput.type);
            }
            for (const lOutput of lDef.outputs) {
                lTypeSet.add(lOutput.type);
            }
        }
        lCached.availableTypes = [...lTypeSet].sort();

        // Active function data.
        const lActiveFunc: PotatnoFunction | undefined = lProject.activeFunction;
        lCached.activeFunctionName = lActiveFunc?.name ?? '';
        lCached.activeFunctionIsSystem = lActiveFunc?.system ?? false;
        lCached.activeFunctionEditableByUser = (lActiveFunc as any)?.editableByUser ?? false;
        lCached.activeFunctionInputs = [...(lActiveFunc?.inputs ?? [])];
        lCached.activeFunctionOutputs = [...(lActiveFunc?.outputs ?? [])];
        lCached.activeFunctionImports = [...(lActiveFunc?.imports ?? [])];

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
                const lDef = lProject.configuration.nodeDefinitions.get(lNode.definitionName);
                const lCategoryMeta = NODE_CATEGORY_META[lNode.category] ?? { icon: '?', cssColor: 'var(--pn-text-muted)', label: 'Unknown' };
                const lInputs: Array<{ id: string; name: string; type: string; direction: string; connectedTo: string | null }> = [];
                for (const lPort of lNode.inputs.values()) {
                    lInputs.push({ id: lPort.id, name: lPort.name, type: lPort.type, direction: lPort.direction, connectedTo: lPort.connectedTo });
                }
                const lOutputs: Array<{ id: string; name: string; type: string; direction: string; connectedTo: string | null }> = [];
                for (const lPort of lNode.outputs.values()) {
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
            lCached.visibleNodes = lNodes;
        } else {
            lCached.visibleNodes = [];
        }

        // Trigger exactly ONE PWB update by incrementing the tracked counter.
        this.mCacheVersion++;
    }
}
