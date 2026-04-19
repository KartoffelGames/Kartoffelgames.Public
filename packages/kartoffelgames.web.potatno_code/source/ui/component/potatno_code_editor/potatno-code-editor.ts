import { PwbChild, PwbComponent, PwbExport, ComponentState, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import { PotatnoCodeFile } from '../../../document/potatno-code-file.ts';
import type { PotatnoGraph } from '../../../document/potatno-graph.ts';
import type { PotatnoNode } from '../../../document/potatno-node.ts';
import { NodeCategory, NodeCategoryMeta } from '../../../node/node-category.enum.ts';
import { PortKind } from '../../../node/port-kind.enum.ts';
import { PotatnoDeserializer } from '../../../parser/potatno-deserializer.ts';
import { PotatnoCodeGenerator, type FunctionCodeWithIntermediates } from '../../../parser/potatno-code-generator.ts';
import { PotatnoSerializer } from '../../../parser/potatno-serializer.ts';
import { PotatnoFunction } from '../../../document/potatno-function.ts';
import { PotatnoNodeDefinition, type PotatnoNodeDefinitionPort } from "../../../project/potatno-node-definition.ts";
import type { PotatnoProject } from '../../../project/potatno-project.ts';
import type { NodePreviewData } from '../../../project/potatno-preview-evaluator.ts';
import { PotatnoCanvasInteraction } from '../../potatno-canvas-interaction.ts';
import { PotatnoCanvasRenderer } from '../../potatno-canvas-renderer.ts';
import { PotatnoClipboard } from '../../potatno-clipboard.ts';
import { CompositeAction } from '../../potatno-composite-action.ts';
import type { PotatnoHistoryAction } from '../../potatno-history-action.ts';
import { PotatnoHistory } from '../../potatno-history.ts';
import { NodeAddAction, NodeRemoveAction } from '../../potatno-node-actions.ts';
import { PropertyChangeAction } from '../../potatno-property-change-action.ts';
import editorCss from './potatno-code-editor.css' with { type: 'text' };
import editorTemplate from './potatno-code-editor.html' with { type: 'text' };
import type { NodeRenderData } from '../potatno_node_component/potatno-node-component.ts';

// Import child components to ensure they're registered.
import '../potatno_function_list/potatno-function-list.ts';
import '../potatno_node_component/potatno-node-component.ts';
import '../potatno_node_library/potatno-node-library.ts';
import '../potatno_panel_left/potatno-panel-left.ts';
import '../potatno_panel_properties/potatno-panel-properties.ts';
import '../potatno_port/potatno-port.ts';
import '../potatno_preview/potatno-preview.ts';
import '../potatno_resize_handle/potatno-resize-handle.ts';
import '../potatno_search_input/potatno-search-input.ts';
import '../potatno_tabs/potatno-tabs.ts';

/**
 * Interaction state for the canvas.
 */
type InteractionState =
    | { mode: 'idle'; }
    | { mode: 'panning'; startX: number; startY: number; }
    | { mode: 'dragging-node'; nodeId: string; startX: number; startY: number; origins: Array<{ nodeId: string; originX: number; originY: number; }>; }
    | { mode: 'dragging-wire'; sourceNodeId: string; sourcePortId: string; portKind: string; direction: string; type: string; startX: number; startY: number; }
    | { mode: 'selecting'; startX: number; startY: number; }
    | { mode: 'resizing-comment'; nodeId: string; startX: number; startY: number; originalW: number; originalH: number; };

/**
 * All cached view data. Stored outside PWB's deep proxy to prevent
 * cascading update loops when multiple properties change at once.
 */
interface CachedViewData {
    activeFunctionId: string;
    activeFunctionName: string;
    activeFunctionIsSystem: boolean;
    activeFunctionEditableByUser: boolean;
    errors: Array<{ message: string; location: string; }>;
    hasPreview: boolean;
    nodeDefinitionList: Array<{ name: string; category: string; }>;
    functionList: Array<{ id: string; name: string; label: string; system: boolean; }>;
    availableImports: Array<string>;
    availableTypes: Array<string>;
    activeFunctionInputs: Array<{ name: string; type: string; }>;
    activeFunctionOutputs: Array<{ name: string; type: string; }>;
    activeFunctionImports: Array<string>;
    visibleNodes: Array<NodeRenderData>;
}

/**
 * Module-level storage for complex objects like history, clipboard,
 * canvas interaction helper, SVG renderer, and cached view data.
 */
interface EditorInternals {
    history: PotatnoHistory;
    clipboard: PotatnoClipboard;
    interaction: PotatnoCanvasInteraction;
    renderer: PotatnoCanvasRenderer;
    hoveredPort: { nodeId: string; portId: string; portKind: string; direction: string; type: string; } | null;
    interactionState: InteractionState;
    previewInitialized: boolean;
    previewElements: Map<string, HTMLElement>;
    previewDataCache: Map<string, { inputs: Record<string, unknown>; outputs: Record<string, unknown>; }>;
    entryPointPreviewElement: Element | null;
    previewDirty: boolean;
    cachedCodeResult: FunctionCodeWithIntermediates | null;
}

/**
 * Main editor component for the potatno-code visual programming environment.
 * Receives a PotatnoProject (configuration) and a PotatnoCodeFile (document state)
 * and provides the full visual editing experience.
 */
@PwbComponent({
    selector: 'potatno-code-editor',
    template: editorTemplate,
    style: editorCss,
})
export class PotatnoCodeEditor implements IComponentOnConnect, IComponentOnDeconstruct {
    private mProject: PotatnoProject | undefined;
    private mFile: PotatnoCodeFile | undefined;
    private mSelectedIds: Set<string> = new Set();
    private mInternals!: EditorInternals;
    private mSelectionBoxScreen: { x1: number; y1: number; x2: number; y2: number; };
    private mPreviewDebounceTimer: number;
    private mKeyboardHandler: ((e: KeyboardEvent) => void) | null;
    private mResizeState: { panel: 'left' | 'right'; startX: number; startWidth: number; } | null;
    private mResizeMoveHandler: ((e: PointerEvent) => void) | null;
    private mResizeUpHandler: ((e: PointerEvent) => void) | null;

    /**
     * Cached view data used by the template. Changing this triggers a re-render.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mCachedData: CachedViewData;

    /**
     * Whether the selection box is currently visible.
     */
    @ComponentState.state()
    private accessor mShowSelectionBox: boolean = false;

    /**
     * Incremented after pan/zoom to trigger grid style re-evaluation.
     */
    @ComponentState.state()
    private accessor mTransformVersion: number = 0;

    // --- DOM Refs ---

    /** Reference to the SVG layer element for rendering connections. */
    @PwbChild('svgLayer')
    public accessor svgLayer!: SVGSVGElement;

    /** Reference to the canvas wrapper element for interaction handling. */
    @PwbChild('canvasWrapper')
    public accessor canvasWrapper!: HTMLElement;

    /** Reference to the left panel element for resize operations. */
    @PwbChild('panelLeft')
    public accessor panelLeft!: HTMLElement;

    /** Reference to the right panel element for resize operations. */
    @PwbChild('panelRight')
    public accessor panelRight!: HTMLElement;

    // ============================================================
    // Public Getters for Template
    // ============================================================

    /**
     * Get the project configuration.
     */
    public get project(): PotatnoProject {
        return this.mProject!;
    }

    /**
     * Set the project configuration.
     */
    @PwbExport
    public set project(pProject: PotatnoProject) {
        this.mProject = pProject;
        this.rebuildCachedData();
    }

    /**
     * Get the current code file (document state).
     */
    public get file(): PotatnoCodeFile | null {
        return this.mFile ?? null;
    }

    /**
     * Set the code file (document state).
     * Automatically initializes main functions if the file has no functions.
     */
    @PwbExport
    public set file(pFile: PotatnoCodeFile | null) {
        if (pFile) {
            this.mFile = pFile;

            // Auto-initialize main functions if the file is empty and project has main function definitions.
            const lProject: PotatnoProject | undefined = this.mProject;
            if (lProject && pFile.functions.size === 0) {
                this.initializeMainFunctions(pFile, lProject);
            }
        } else {
            this.mFile = undefined;
        }

        this.mSelectedIds.clear();
        this.mInternals.history.clear();
        this.mInternals.previewInitialized = false;
        this.rebuildCachedData();
        this.renderConnections();
        this.initializePreview();
        this.updatePreview();
    }

    /**
     * Get the active function identifier.
     */
    public get activeFunctionId(): string {
        return this.mCachedData.activeFunctionId;
    }

    /**
     * Get the canvas interaction helper.
     */
    public get interaction(): PotatnoCanvasInteraction {
        return this.mInternals.interaction;
    }

    /**
     * Whether the selection box is currently visible.
     */
    public get showSelectionBox(): boolean {
        return this.mShowSelectionBox;
    }

    /**
     * Whether preview is available.
     */
    public get hasPreview(): boolean {
        return this.mCachedData.hasPreview;
    }

    /**
     * Get the current list of validation errors.
     */
    public get editorErrors(): Array<{ message: string; location: string; }> {
        return this.mCachedData.errors;
    }

    /**
     * Get the CSS for the grid background.
     */
    public get gridBackgroundStyle(): string {
        void this.mTransformVersion;
        return this.mInternals.interaction.getGridBackgroundCss();
    }

    /**
     * Get the CSS transform for the canvas content layer.
     */
    public get gridTransformStyle(): string {
        void this.mTransformVersion;
        return 'transform: ' + this.mInternals.interaction.getTransformCss();
    }

    /**
     * Get the inline style for the selection box overlay.
     */
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

    /**
     * Get the cached list of visible nodes for the active function.
     */
    public get visibleNodes(): Array<NodeRenderData> {
        return this.mCachedData.visibleNodes;
    }

    /**
     * Get the cached list of node definitions for the library panel.
     */
    public get nodeDefinitionList(): Array<{ name: string; category: string; }> {
        return this.mCachedData.nodeDefinitionList;
    }

    /**
     * Get the cached list of functions for the function list panel.
     */
    public get functionList(): Array<{ id: string; name: string; label: string; system: boolean; }> {
        return this.mCachedData.functionList;
    }

    /**
     * Get the name of the active function.
     */
    public get activeFunctionName(): string {
        return this.mCachedData.activeFunctionName;
    }

    /**
     * Get the active function's input port definitions.
     */
    public get activeFunctionInputs(): Array<{ name: string; type: string; }> {
        return this.mCachedData.activeFunctionInputs;
    }

    /**
     * Get the active function's output port definitions.
     */
    public get activeFunctionOutputs(): Array<{ name: string; type: string; }> {
        return this.mCachedData.activeFunctionOutputs;
    }

    /**
     * Get the active function's import list.
     */
    public get activeFunctionImports(): Array<string> {
        return this.mCachedData.activeFunctionImports;
    }

    /**
     * Whether the active function is a system function.
     */
    public get activeFunctionIsSystem(): boolean {
        return this.mCachedData.activeFunctionIsSystem;
    }

    /**
     * Whether the active function's definition is editable by the user.
     */
    public get activeFunctionEditableByUser(): boolean {
        return this.mCachedData.activeFunctionEditableByUser;
    }

    /**
     * Get the list of available import names.
     */
    public get availableImportsList(): Array<string> {
        return this.mCachedData.availableImports;
    }

    /**
     * Get the list of all available port types.
     */
    public get availableTypes(): Array<string> {
        return this.mCachedData.availableTypes;
    }

    /**
     * Get the preview element for a specific node (used by template binding).
     */
    public getPreviewElementForNode(pNodeId: string): HTMLElement | null {
        return this.mInternals.previewElements.get(pNodeId) ?? null;
    }

    /**
     * Constructor. Initializes internal state.
     */
    public constructor() {
        this.mInternals = {
            history: new PotatnoHistory(),
            clipboard: new PotatnoClipboard(),
            interaction: new PotatnoCanvasInteraction(20),
            renderer: new PotatnoCanvasRenderer(),
            hoveredPort: null,
            interactionState: { mode: 'idle' },
            previewInitialized: false,
            previewElements: new Map(),
            previewDataCache: new Map(),
            entryPointPreviewElement: null,
            previewDirty: true,
            cachedCodeResult: null,
        };
        this.mCachedData = {
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
        };
        this.mSelectionBoxScreen = { x1: 0, y1: 0, x2: 0, y2: 0 };
        this.mPreviewDebounceTimer = 0;
        this.mKeyboardHandler = null;
        this.mResizeState = null;
        this.mResizeMoveHandler = null;
        this.mResizeUpHandler = null;
    }

    // ============================================================
    // Public API (exposed on the HTML element via @PwbExport)
    // ============================================================

    /**
     * Load code from a string, deserializing into a new PotatnoCodeFile.
     *
     * @param pCode - The code string containing embedded metadata markers.
     */
    @PwbExport
    public loadCode(pCode: string): void {
        const lProject: PotatnoProject = this.mProject!;
        const lDeserializer: PotatnoDeserializer = new PotatnoDeserializer(lProject);
        const lNewFile: PotatnoCodeFile = lDeserializer.deserialize(pCode);
        this.mFile = lNewFile;
        this.mInternals.history.clear();
        this.mSelectedIds.clear();
        this.mInternals.previewInitialized = false;
        this.rebuildCachedData();
        this.renderConnections();
        this.initializePreview();
        this.updatePreview();
    }

    /**
     * Generate the code string from the current file.
     *
     * @returns The serialized code string with embedded metadata.
     */
    @PwbExport
    public generateCode(): string {
        const lProject: PotatnoProject = this.mProject!;
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        if (!lFile) {
            return '';
        }
        const lSerializer: PotatnoSerializer = new PotatnoSerializer(lProject);
        return lSerializer.serialize(lFile);
    }

    // ============================================================
    // Lifecycle
    // ============================================================

    /**
     * Called when the component is connected to the DOM.
     */
    public onConnect(): void {
        this.mKeyboardHandler = (pEvent: KeyboardEvent) => this.onKeyDown(pEvent);
        document.addEventListener('keydown', this.mKeyboardHandler);
    }

    /**
     * Called when the component is deconstructed.
     */
    public onDeconstruct(): void {
        if (this.mKeyboardHandler) {
            document.removeEventListener('keydown', this.mKeyboardHandler);
        }
    }

    // ============================================================
    // Event Handlers: Left Panel
    // ============================================================

    /**
     * Handle a node being dragged from the library to the canvas.
     *
     * @param pEvent - The drag event containing the node definition name.
     */
    public onNodeDragFromLibrary(pEvent: any): void {
        const lDefName: string = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        const lProject: PotatnoProject = this.mProject!;
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        if (!lFile) {
            return;
        }

        let lDefinition: PotatnoNodeDefinition | undefined = lProject.nodeDefinitions.get(lDefName);

        // Check if it's a user-defined function rather than a built-in node definition.
        if (!lDefinition) {
            for (const lFunc of lFile.functions.values()) {
                if (lFunc.name === lDefName && !lFunc.system) {
                    lDefinition = PotatnoNodeDefinition.create({
                        id: lFunc.name,
                        category: NodeCategory.Function,
                        inputs: { ...lFunc.inputs },
                        outputs: { ...lFunc.outputs },
                        codeGenerator: () => ''
                    });
                    break;
                }
            }
        }

        // Check import-scoped node definitions based on active function's imports.
        if (!lDefinition) {
            const lActiveFunc: PotatnoFunction | undefined = lFile.activeFunction;
            if (lActiveFunc) {
                const lEnabledImports: Set<string> = new Set<string>(lActiveFunc.imports);
                for (const lImport of lProject.imports) {
                    if (lEnabledImports.has(lImport.name)) {
                        for (const lNodeDef of lImport.nodes) {
                            if (lNodeDef.id === lDefName) {
                                lDefinition = lNodeDef;
                                break;
                            }
                        }
                        if (lDefinition) {
                            break;
                        }
                    }
                }
            }
        }

        if (!lDefinition) {
            return;
        }

        const lGraph: PotatnoGraph | undefined = lFile.activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        // Place at center of visible area.
        const lInternals: EditorInternals = this.mInternals;
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

    /**
     * Handle function selection from the function list.
     *
     * @param pEvent - The event containing the function identifier.
     */
    public onFunctionSelect(pEvent: any): void {
        const lFuncId: string = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        if (!lFile) {
            return;
        }
        lFile.setActiveFunction(lFuncId);
        this.mSelectedIds.clear();
        this.rebuildCachedData();
        this.renderConnections();
    }

    /**
     * Handle adding a new user function.
     */
    public onFunctionAdd(): void {
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        if (!lFile) {
            return;
        }
        const lCount: number = this.mCachedData.functionList.length;
        const lFunc: PotatnoFunction = new PotatnoFunction(
            crypto.randomUUID(),
            `function_${lCount}`,
            `Function ${lCount}`,
            false
        );
        lFile.addFunction(lFunc);
        lFile.setActiveFunction(lFunc.id);
        this.mSelectedIds.clear();
        this.rebuildCachedData();
        this.renderConnections();
    }

    /**
     * Handle deleting a user function.
     *
     * @param pEvent - The event containing the function identifier.
     */
    public onFunctionDelete(pEvent: any): void {
        const lFuncId: string = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        if (!lFile) {
            return;
        }
        lFile.removeFunction(lFuncId);
        this.mSelectedIds.clear();
        this.rebuildCachedData();
        this.renderConnections();
        this.updatePreview();
    }

    // ============================================================
    // Event Handlers: Properties Panel
    // ============================================================

    /**
     * Handle property changes from the properties panel.
     *
     * @param pEvent - The event containing updated property data.
     */
    public onPropertiesChange(pEvent: any): void {
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        if (!lFile) {
            return;
        }
        const lFunc: PotatnoFunction | undefined = lFile.activeFunction;
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

    /**
     * Handle pointer down on the canvas background.
     *
     * @param pEvent - The pointer event.
     */
    public onCanvasPointerDown(pEvent: PointerEvent): void {
        const lInternals: EditorInternals = this.mInternals;

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
                this.mSelectedIds.clear();
                this.rebuildCachedData();
            }
            const lRect: DOMRect = this.canvasWrapper.getBoundingClientRect();
            const lX: number = pEvent.clientX - lRect.left;
            const lY: number = pEvent.clientY - lRect.top;
            lInternals.interactionState = { mode: 'selecting', startX: lX, startY: lY };
            this.mSelectionBoxScreen = { x1: lX, y1: lY, x2: lX, y2: lY };
            this.mShowSelectionBox = false;
            (pEvent.currentTarget as HTMLElement).setPointerCapture(pEvent.pointerId);
        }
    }

    /**
     * Handle pointer move on the canvas.
     *
     * @param pEvent - The pointer event.
     */
    public onCanvasPointerMove(pEvent: PointerEvent): void {
        const lInternals: EditorInternals = this.mInternals;
        const lState: InteractionState = lInternals.interactionState;

        if (lState.mode === 'panning') {
            const lDx: number = pEvent.clientX - lState.startX;
            const lDy: number = pEvent.clientY - lState.startY;
            lInternals.interaction.pan(lDx, lDy);
            lState.startX = pEvent.clientX;
            lState.startY = pEvent.clientY;
            this.mTransformVersion++;
            this.renderConnections();
            return;
        }

        if (lState.mode === 'dragging-node') {
            const lFile: PotatnoCodeFile | undefined = this.mFile;
            if (!lFile) {
                return;
            }
            const lDx: number = (pEvent.clientX - lState.startX) / lInternals.interaction.zoom;
            const lDy: number = (pEvent.clientY - lState.startY) / lInternals.interaction.zoom;

            for (const lOrigin of lState.origins) {
                const lNewX: number = lOrigin.originX + lDx;
                const lNewY: number = lOrigin.originY + lDy;
                const lSnapped = lInternals.interaction.snapToGrid(lNewX, lNewY);

                const lNode: PotatnoNode | undefined = lFile.activeFunction?.graph.getNode(lOrigin.nodeId);
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
            const lFile: PotatnoCodeFile | undefined = this.mFile;
            if (!lFile) {
                return;
            }
            const lDx: number = (pEvent.clientX - lState.startX) / lInternals.interaction.zoom;
            const lDy: number = (pEvent.clientY - lState.startY) / lInternals.interaction.zoom;
            const lGridSize: number = lInternals.interaction.gridSize;
            const lNewW: number = lState.originalW + Math.round(lDx / lGridSize);
            const lNewH: number = lState.originalH + Math.round(lDy / lGridSize);
            const lNode: PotatnoNode | undefined = lFile.activeFunction?.graph.getNode(lState.nodeId);
            if (lNode) {
                lNode.resizeTo(lNewW, lNewH);
                this.updateNodeSize(lState.nodeId);
            }
            return;
        }
    }

    /**
     * Handle pointer up on the canvas.
     *
     * @param pEvent - The pointer event.
     */
    public onCanvasPointerUp(pEvent: PointerEvent): void {
        const lInternals: EditorInternals = this.mInternals;

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

                    const lFile: PotatnoCodeFile | undefined = this.mFile;
                    const lGraph: PotatnoGraph | undefined = lFile?.activeFunction?.graph;
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
            this.selectNodesInBox();
        }

        if (lInternals.interactionState.mode === 'resizing-comment') {
            this.rebuildCachedData();
        }

        lInternals.interactionState = { mode: 'idle' };
        (pEvent.currentTarget as HTMLElement).releasePointerCapture(pEvent.pointerId);
    }

    /**
     * Handle mouse wheel for zooming.
     *
     * @param pEvent - The wheel event.
     */
    public onCanvasWheel(pEvent: WheelEvent): void {
        pEvent.preventDefault();
        const lRect: DOMRect = this.canvasWrapper.getBoundingClientRect();
        const lMouseX: number = pEvent.clientX - lRect.left;
        const lMouseY: number = pEvent.clientY - lRect.top;
        this.mInternals.interaction.zoomAt(lMouseX, lMouseY, pEvent.deltaY > 0 ? -0.1 : 0.1);
        this.mTransformVersion++;
        this.renderConnections();
    }

    /**
     * Prevent the browser context menu on the canvas.
     * When right-clicking a connection hit-area path, delete the connection.
     *
     * @param pEvent - The context menu event.
     */
    public onContextMenu(pEvent: Event): void {
        pEvent.preventDefault();

        // Check if the click target is a connection hit-area path.
        const lTarget: Element = pEvent.target as Element;
        if (lTarget.hasAttribute?.('data-hit-area')) {
            const lConnectionId: string | null = lTarget.getAttribute('data-connection-id');
            if (lConnectionId) {
                const lFile: PotatnoCodeFile | undefined = this.mFile;
                const lGraph: PotatnoGraph | undefined = lFile?.activeFunction?.graph;
                if (lGraph) {
                    lGraph.removeConnection(lConnectionId);
                    this.rebuildCachedData();
                    this.renderConnections();
                    this.updatePreview();
                }
            }
        }
    }

    // ============================================================
    // Event Handlers: Node Interaction
    // ============================================================

    /**
     * Handle pointer down on a node.
     *
     * @param pEvent - The pointer event.
     * @param pNodeRender - The cached node render data.
     */
    public onNodePointerDown(pEvent: PointerEvent, pNodeRender: any): void {
        const lPath: Array<EventTarget> = pEvent.composedPath();
        for (const lEl of lPath) {
            if ((lEl as HTMLElement).tagName?.toLowerCase() === 'potatno-port') {
                return;
            }
        }

        pEvent.stopPropagation();

        if (pEvent.button !== 0) {
            return;
        }

        const lNodeId: string = pNodeRender.id;
        const lInternals: EditorInternals = this.mInternals;
        const lSelectedIds: Set<string> = this.mSelectedIds;
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        if (!lFile) {
            return;
        }

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
        const lOrigins: Array<{ nodeId: string; originX: number; originY: number; }> = [];
        const lGraph: PotatnoGraph | undefined = lFile.activeFunction?.graph;

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
                        continue;
                    }
                    if (lNode.category === NodeCategory.Comment) {
                        continue;
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

    /**
     * Handle the start of a wire drag from a port.
     *
     * @param pEvent - The event containing port data.
     */
    public onPortDragStart(pEvent: any): void {
        const lData = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        const lGraph: PotatnoGraph | undefined = lFile?.activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        const lNode: PotatnoNode | undefined = lGraph.getNode(lData.nodeId);
        if (!lNode) {
            return;
        }

        const lInternals: EditorInternals = this.mInternals;
        const lGridSize: number = lInternals.interaction.gridSize;
        const lNodeX: number = lNode.position.x * lGridSize;
        const lNodeY: number = lNode.position.y * lGridSize;
        const lNodeW: number = lNode.size.w * lGridSize;
        const lHeaderHeight: number = 28;
        const lPortGap: number = 24;
        const lBodyPadding: number = 4;

        let lStartX: number;
        let lStartY: number;

        if (lData.portKind === 'flow') {
            lStartX = lData.direction === 'output' ? lNodeX + lNodeW : lNodeX;
            lStartY = lNodeY + lHeaderHeight / 2;
        } else {
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
            lStartY = lNodeY + lHeaderHeight + lBodyPadding + (lPortIndex + 0.5) * lPortGap;
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
     *
     * @param pEvent - The event containing port hover data.
     */
    public onPortHover(pEvent: any): void {
        const lData = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        this.mInternals.hoveredPort = {
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
        this.mInternals.hoveredPort = null;
    }

    /**
     * Handle resize-start event from comment nodes.
     *
     * @param pEvent - The event containing resize start data.
     * @param _pNodeRender - Unused node render data.
     */
    public onNodeResizeStart(pEvent: any, _pNodeRender: any): void {
        const lData = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        const lNode: PotatnoNode | undefined = lFile?.activeFunction?.graph.getNode(lData.nodeId);
        if (!lNode) {
            return;
        }

        this.mInternals.interactionState = {
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
     *
     * @param pEvent - The event containing the new comment text.
     */
    public onCommentChange(pEvent: any): void {
        const lData = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        const lNode: PotatnoNode | undefined = lFile?.activeFunction?.graph.getNode(lData.nodeId);
        if (lNode) {
            const lAction: PropertyChangeAction = new PropertyChangeAction(lNode, 'comment', lData.text);
            this.mInternals.history.push(lAction);
            this.rebuildCachedData();
        }
    }

    /**
     * Handle value changes from value nodes.
     *
     * @param pEvent - The event containing the property change data.
     */
    public onValueChange(pEvent: any): void {
        const lData = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        const lNode: PotatnoNode | undefined = lFile?.activeFunction?.graph.getNode(lData.nodeId);
        if (lNode) {
            const lAction: PropertyChangeAction = new PropertyChangeAction(lNode, lData.property, lData.value);
            this.mInternals.history.push(lAction);
            this.rebuildCachedData();
            this.updatePreview();
        }
    }

    // ============================================================
    // Event Handlers: Keyboard
    // ============================================================

    /**
     * Handle keyboard shortcuts.
     *
     * @param pEvent - The keyboard event.
     */
    private onKeyDown(pEvent: KeyboardEvent): void {
        if (pEvent.key === 'Delete') {
            this.deleteSelectedNodes();
            return;
        }

        if (pEvent.ctrlKey && pEvent.key === 'z') {
            pEvent.preventDefault();
            this.mInternals.history.undo();
            this.rebuildCachedData();
            this.renderConnections();
            this.updatePreview();
            return;
        }

        if (pEvent.ctrlKey && (pEvent.key === 'y' || (pEvent.shiftKey && pEvent.key === 'z'))) {
            pEvent.preventDefault();
            this.mInternals.history.redo();
            this.rebuildCachedData();
            this.renderConnections();
            this.updatePreview();
            return;
        }

        if (pEvent.ctrlKey && pEvent.key === 'c') {
            const lFile: PotatnoCodeFile | undefined = this.mFile;
            const lGraph: PotatnoGraph | undefined = lFile?.activeFunction?.graph;
            if (lGraph) {
                this.mInternals.clipboard.copy(lGraph, this.mSelectedIds);
            }
            return;
        }

        if (pEvent.ctrlKey && pEvent.key === 'v') {
            this.pasteFromClipboard();
            return;
        }
    }

    // ============================================================
    // Panel Resize
    // ============================================================

    /**
     * Handle resize start for the left panel.
     *
     * @param pEvent - The pointer event.
     */
    public onResizeLeftStart(pEvent: PointerEvent): void {
        pEvent.preventDefault();
        this.startPanelResize('left', pEvent);
    }

    /**
     * Handle resize start for the right panel.
     *
     * @param pEvent - The pointer event.
     */
    public onResizeRightStart(pEvent: PointerEvent): void {
        pEvent.preventDefault();
        this.startPanelResize('right', pEvent);
    }

    /**
     * Start tracking a panel resize operation.
     *
     * @param pPanel - Which panel is being resized.
     * @param pEvent - The initiating pointer event.
     */
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

    /**
     * Initialize main functions from the project's entry point definition into a file.
     *
     * @param pFile - The file to initialize.
     * @param pProject - The project configuration providing the entry point definition.
     */
    private initializeMainFunctions(pFile: PotatnoCodeFile, pProject: PotatnoProject): void {
        const lEntryPoint = pProject.entryPoint;
        if (!lEntryPoint) {
            return;
        }

        // Create the entry point function.
        const lFunc: PotatnoFunction = new PotatnoFunction(
            crypto.randomUUID(),
            lEntryPoint.id,
            'Main or something',
            true,
            lEntryPoint.statics.inputs || lEntryPoint.statics.outputs
        );

        // Add static nodes from the entry point definition to the graph.
        const lStaticNodes = lEntryPoint.nodes.static;
        for (let lIdx = 0; lIdx < lStaticNodes.length; lIdx++) {
            const lStaticDef = lStaticNodes[lIdx];
            lFunc.graph.addNode(lStaticDef, { x: 2 + lIdx * 12, y: 2 }, true);

            // Register the static node definition in the project so it can be looked up by definitionId.
            if (!pProject.nodeDefinitions.has(lStaticDef.id)) {
                pProject.addNodeDefinition(lStaticDef);
            }
        }

        // Add dynamic nodes from the entry point as available node definitions.
        const lDynamicNodes = lEntryPoint.nodes.dynamic;
        for (const lDynamicDef of lDynamicNodes) {
            if (!pProject.nodeDefinitions.has(lDynamicDef.id)) {
                pProject.addNodeDefinition(lDynamicDef);
            }
        }

        // Auto-enable all project imports if the entry point requests static imports.
        if (lEntryPoint.statics.imports) {
            for (const lImport of pProject.imports) {
                lFunc.addImport(lImport.name);
            }
        }

        pFile.addFunction(lFunc);
    }

    /**
     * Delete all currently selected nodes.
     */
    private deleteSelectedNodes(): void {
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        const lGraph: PotatnoGraph | undefined = lFile?.activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        const lActions: Array<PotatnoHistoryAction> = [];
        for (const lNodeId of this.mSelectedIds) {
            const lNode: PotatnoNode | undefined = lGraph.getNode(lNodeId);
            if (lNode && !lNode.system) {
                lActions.push(new NodeRemoveAction(lGraph, lNodeId));
            }
        }

        if (lActions.length > 0) {
            this.mInternals.history.push(new CompositeAction('Delete nodes', lActions));
            this.mSelectedIds.clear();
            this.rebuildCachedData();
            this.renderConnections();
            this.updatePreview();
        }
    }

    /**
     * Paste nodes from the clipboard into the active function's graph.
     */
    private pasteFromClipboard(): void {
        const lInternals: EditorInternals = this.mInternals;
        const lData = lInternals.clipboard.getData();
        if (!lData) {
            return;
        }

        const lProject: PotatnoProject = this.mProject!;
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        const lGraph: PotatnoGraph | undefined = lFile?.activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        const lActions: Array<PotatnoHistoryAction> = [];
        const lAddActions: Array<NodeAddAction> = [];
        for (const lNodeData of lData.nodes) {
            const lDef: PotatnoNodeDefinition | undefined = lProject.nodeDefinitions.get(lNodeData.definitionName);
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

            // Restore properties.
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
            this.mSelectedIds.clear();
            for (const lAction of lAddActions) {
                if (lAction.node) {
                    this.mSelectedIds.add(lAction.node.id);
                }
            }

            this.rebuildCachedData();
            this.renderConnections();
            this.updatePreview();
        }
    }

    /**
     * Select all nodes that fall within the current selection box.
     */
    private selectNodesInBox(): void {
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        const lGraph: PotatnoGraph | undefined = lFile?.activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        const lInternals: EditorInternals = this.mInternals;

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

            if (lNodeX < lBottomRight.x && lNodeRight > lTopLeft.x && lNodeY < lBottomRight.y && lNodeBottom > lTopLeft.y) {
                this.mSelectedIds.add(lNode.id);
            }
        }
        this.rebuildCachedData();
    }

    /**
     * Render all connections in the SVG layer.
     */
    private renderConnections(): void {
        if (!this.svgLayer) {
            return;
        }

        const lFile: PotatnoCodeFile | undefined = this.mFile;
        const lGraph: PotatnoGraph | undefined = lFile?.activeFunction?.graph;
        if (!lGraph) {
            this.mInternals.renderer.clearAll(this.svgLayer);
            return;
        }

        const lInternals: EditorInternals = this.mInternals;
        const lGridSize: number = lInternals.interaction.gridSize;
        const lHeaderHeight: number = 28;
        const lPortGap: number = 24;
        const lBodyPadding: number = 4;

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
                let lSourceIdx: number = 0;
                let lIdx: number = 0;
                for (const lPort of lSourceNode.outputs.values()) {
                    if (lPort.id === lConn.sourcePortId) {
                        lSourceIdx = lIdx;
                        break;
                    }
                    lIdx++;
                }

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
                lSourceY = lSourceNodeY + lHeaderHeight + lBodyPadding + (lSourceIdx + 0.5) * lPortGap;
                lTargetX = lTargetNodeX;
                lTargetY = lTargetNodeY + lHeaderHeight + lBodyPadding + (lTargetIdx + 0.5) * lPortGap;
            } else {
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

    /**
     * Initialize the preview container. Called once when a file is loaded
     * and the project has a createPreview callback.
     */
    private initializePreview(): void {
        const lProject: PotatnoProject | undefined = this.mProject;
        if (!lProject) {
            return;
        }

        const lPreviewConfig = lProject.entryPoint.preview;
        if (!lPreviewConfig) {
            return;
        }

        const lInternals: EditorInternals = this.mInternals;
        if (lInternals.previewInitialized) {
            return;
        }

        // Create the entry point preview element.
        const lPreviewElement: Element = lPreviewConfig.generatePreview();
        lInternals.entryPointPreviewElement = lPreviewElement;

        // Append it to the preview container if available.
        const lPreviewEl: any = (this as any).previewEl;
        if (lPreviewEl && typeof lPreviewEl.getContainer === 'function') {
            const lContainer: HTMLElement = lPreviewEl.getContainer();
            lContainer.appendChild(lPreviewElement);
            lInternals.previewInitialized = true;
        }
    }

    /**
     * Update the preview with newly generated code.
     * Generates code with intermediate snapshots and calls entry point and node preview callbacks.
     */
    private updatePreview(): void {
        const lProject: PotatnoProject | undefined = this.mProject;
        if (!lProject) {
            return;
        }

        const lFile: PotatnoCodeFile | undefined = this.mFile;
        if (!lFile) {
            return;
        }

        // Mark preview as dirty so the next evaluatePreview call regenerates code.
        this.mInternals.previewDirty = true;

        // Debounce the update.
        clearTimeout(this.mPreviewDebounceTimer);
        this.mPreviewDebounceTimer = setTimeout(() => {
            this.evaluatePreview({});
        }, 300) as unknown as number;
    }

    /**
     * Update only a single node's pixel position in the cached visible nodes array.
     *
     * @param pNodeId - The identifier of the node to update.
     */
    private updateNodePosition(pNodeId: string): void {
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        const lNode: PotatnoNode | undefined = lFile?.activeFunction?.graph.getNode(pNodeId);
        if (!lNode) {
            return;
        }
        const lGridSize: number = this.mInternals.interaction.gridSize;
        for (const lCachedNode of this.mCachedData.visibleNodes) {
            if (lCachedNode.id === pNodeId) {
                lCachedNode.position = { x: lNode.position.x, y: lNode.position.y };
                lCachedNode.pixelX = lNode.position.x * lGridSize;
                lCachedNode.pixelY = lNode.position.y * lGridSize;
                break;
            }
        }
        // Trigger re-render with updated node position.
        this.mCachedData = this.mCachedData;
    }

    /**
     * Update only a single node's size in the cached visible nodes array.
     *
     * @param pNodeId - The identifier of the node to update.
     */
    private updateNodeSize(pNodeId: string): void {
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        const lNode: PotatnoNode | undefined = lFile?.activeFunction?.graph.getNode(pNodeId);
        if (!lNode) {
            return;
        }
        for (const lCachedNode of this.mCachedData.visibleNodes) {
            if (lCachedNode.id === pNodeId) {
                lCachedNode.size = { w: lNode.size.w, h: lNode.size.h };
                break;
            }
        }
        // Trigger re-render with updated node size.
        this.mCachedData = this.mCachedData;
    }

    /**
     * Validate the current project and return a list of errors.
     *
     * @returns An array of error objects with message and location.
     */
    private validateProject(): Array<{ message: string; location: string; }> {
        const lErrors: Array<{ message: string; location: string; }> = [];
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        if (!lFile) {
            return lErrors;
        }

        const lNameRegex: RegExp = /^[a-zA-Z][a-zA-Z0-9_]*$/;
        const lFunctionNames: Set<string> = new Set<string>();

        for (const lFunc of lFile.functions.values()) {
            if (lFunctionNames.has(lFunc.name)) {
                lErrors.push({ message: `Duplicate function name "${lFunc.name}".`, location: `Function "${lFunc.name}"` });
            }
            lFunctionNames.add(lFunc.name);

            if (!lNameRegex.test(lFunc.name)) {
                lErrors.push({ message: `Invalid function name "${lFunc.name}". Must start with a letter and contain only letters, digits, and underscores.`, location: `Function "${lFunc.name}"` });
            }

            const lPortNames: Set<string> = new Set<string>();
            for (const lInputName of Object.keys(lFunc.inputs)) {
                if (!lNameRegex.test(lInputName)) {
                    lErrors.push({ message: `Invalid input name "${lInputName}".`, location: `Function "${lFunc.name}" > Inputs` });
                }
                if (lPortNames.has(lInputName)) {
                    lErrors.push({ message: `Duplicate input/output name "${lInputName}".`, location: `Function "${lFunc.name}" > Inputs` });
                }
                lPortNames.add(lInputName);
            }

            for (const lOutputName of Object.keys(lFunc.outputs)) {
                if (!lNameRegex.test(lOutputName)) {
                    lErrors.push({ message: `Invalid output name "${lOutputName}".`, location: `Function "${lFunc.name}" > Outputs` });
                }
                if (lPortNames.has(lOutputName)) {
                    lErrors.push({ message: `Duplicate input/output name "${lOutputName}".`, location: `Function "${lFunc.name}" > Outputs` });
                }
                lPortNames.add(lOutputName);
            }
        }

        const lFunc: PotatnoFunction | undefined = lFile.activeFunction;
        if (!lFunc) {
            lErrors.push({ message: 'No active function selected.', location: 'Editor' });
            return lErrors;
        }

        for (const lNode of lFunc.graph.nodes.values()) {
            for (const lInput of lNode.inputs.values()) {
                if (!lInput.connectedTo && !lNode.system) {
                    lErrors.push({
                        message: `Input "${lInput.name}" on node "${lNode.definitionId}" is not connected.`,
                        location: `Function "${lFunc.name}" > Node "${lNode.definitionId}"`,
                        blocking: false
                    } as any);
                }
            }
        }

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
     * Rebuild all cached view data and assign to the state property
     * to trigger exactly one re-render.
     */
    private rebuildCachedData(): void {
        const lProject: PotatnoProject | undefined = this.mProject;
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        const lPreviousVisibleNodeMap: Map<string, NodeRenderData> = new Map<string, NodeRenderData>(
            this.mCachedData.visibleNodes.map((pNode: NodeRenderData) => [pNode.id, pNode])
        );
        const lCached: CachedViewData = {
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
        };

        // Active function ID.
        lCached.activeFunctionId = lFile?.activeFunctionId ?? '';

        // Preview availability.
        lCached.hasPreview = !!lProject?.entryPoint.preview;

        // Validate and cache errors.
        lCached.errors = this.validateProject();

        // Node definitions.
        const lNodeDefs: Array<{ name: string; category: string; }> = [];
        if (lProject) {
            for (const lDef of lProject.nodeDefinitions.values()) {
                lNodeDefs.push({ name: lDef.id, category: lDef.category });
            }
        }
        // Add user-defined (non-system) functions as callable nodes.
        if (lFile) {
            for (const lFunc of lFile.functions.values()) {
                if (!lFunc.system) {
                    lNodeDefs.push({ name: lFunc.name, category: NodeCategory.Function });
                }
            }
        }
        lCached.nodeDefinitionList = lNodeDefs;

        // Function list.
        const lFuncs: Array<{ id: string; name: string; label: string; system: boolean; }> = [];
        if (lFile) {
            for (const lFunc of lFile.functions.values()) {
                lFuncs.push({ id: lFunc.id, name: lFunc.name, label: lFunc.label, system: lFunc.system });
            }
        }
        lCached.functionList = lFuncs;

        // Add import-scoped nodes based on active function's enabled imports.
        if (lProject && lFile) {
            const lActiveFunc: PotatnoFunction | undefined = lFile.activeFunction;
            if (lActiveFunc) {
                const lEnabledImports: Set<string> = new Set<string>(lActiveFunc.imports);
                for (const lImport of lProject.imports) {
                    if (lEnabledImports.has(lImport.name)) {
                        for (const lNodeDef of lImport.nodes) {
                            lNodeDefs.push({ name: lNodeDef.id, category: lNodeDef.category });
                        }
                    }
                }
            }
        }

        // Available imports.
        lCached.availableImports = lProject?.imports.map((lImport) => lImport.name) ?? [];

        // Available types.
        const lTypeSet: Set<string> = new Set<string>();
        if (lProject) {
            for (const lDef of lProject.nodeDefinitions.values()) {
                const lDefData: PotatnoNodeDefinition = lDef;
                for (const lInput of Object.values<PotatnoNodeDefinitionPort>(lDefData.inputs)) {
                    if (lInput.nodeType === 'value' || lInput.nodeType === 'input') {
                        lTypeSet.add(lInput.dataType);
                    }
                }
                for (const lOutput of Object.values<PotatnoNodeDefinitionPort>(lDefData.outputs)) {
                    if (lOutput.nodeType === 'value' || lOutput.nodeType === 'input') {
                        lTypeSet.add(lOutput.dataType);
                    }
                }
            }
        }
        lCached.availableTypes = [...lTypeSet].sort();

        // Active function data.
        const lActiveFunc: PotatnoFunction | undefined = lFile?.activeFunction;
        lCached.activeFunctionName = lActiveFunc?.name ?? '';
        lCached.activeFunctionIsSystem = lActiveFunc?.system ?? false;
        lCached.activeFunctionEditableByUser = lActiveFunc?.editableByUser ?? false;
        lCached.activeFunctionInputs = lActiveFunc ? Object.entries(lActiveFunc.inputs).map(([lName, lPort]) => ({ name: lName, type: lPort.nodeType === 'value' || lPort.nodeType === 'input' ? lPort.dataType : '' })) : [];
        lCached.activeFunctionOutputs = lActiveFunc ? Object.entries(lActiveFunc.outputs).map(([lName, lPort]) => ({ name: lName, type: lPort.nodeType === 'value' || lPort.nodeType === 'input' ? lPort.dataType : '' })) : [];
        lCached.activeFunctionImports = [...(lActiveFunc?.imports ?? [])];

        // Visible nodes.
        if (lActiveFunc) {
            const lConnectedOutputPortIds: Set<string> = new Set<string>();
            const lConnectedFlowPortIds: Set<string> = new Set<string>();
            for (const lConn of lActiveFunc.graph.connections.values()) {
                lConnectedOutputPortIds.add(lConn.sourcePortId);
                lConnectedFlowPortIds.add(lConn.sourcePortId);
                lConnectedFlowPortIds.add(lConn.targetPortId);
            }

            const lNodes: Array<NodeRenderData> = [];
            for (const lNode of lActiveFunc.graph.nodes.values()) {
                const lDef = lProject?.nodeDefinitions.get(lNode.definitionId);
                const lCategoryMeta = NodeCategoryMeta.get(lNode.category);
                const lInputs: Array<{ id: string; name: string; type: string; direction: string; connectedTo: string | null; }> = [];
                for (const lPort of lNode.inputs.values()) {
                    lInputs.push({ id: lPort.id, name: lPort.name, type: lPort.type, direction: lPort.direction, connectedTo: lPort.connectedTo });
                }
                const lOutputs: Array<{ id: string; name: string; type: string; direction: string; connectedTo: string | null; }> = [];
                for (const lPort of lNode.outputs.values()) {
                    const lIsConnected: boolean = lConnectedOutputPortIds.has(lPort.id);
                    lOutputs.push({ id: lPort.id, name: lPort.name, type: lPort.type, direction: lPort.direction, connectedTo: lIsConnected ? 'connected' : null });
                }
                const lFlowIns: Array<{ id: string; name: string; direction: string; connectedTo: string | null; }> = [];
                for (const lPort of lNode.flowInputs.values()) {
                    lFlowIns.push({ id: lPort.id, name: lPort.name, direction: lPort.direction, connectedTo: lConnectedFlowPortIds.has(lPort.id) ? 'connected' : null });
                }
                const lFlowOuts: Array<{ id: string; name: string; direction: string; connectedTo: string | null; }> = [];
                for (const lPort of lNode.flowOutputs.values()) {
                    lFlowOuts.push({ id: lPort.id, name: lPort.name, direction: lPort.direction, connectedTo: lConnectedFlowPortIds.has(lPort.id) ? 'connected' : null });
                }

                const lNextNodeRender: NodeRenderData = {
                    id: lNode.id,
                    definitionName: lNode.definitionId,
                    category: lNode.category,
                    categoryColor: lCategoryMeta.cssColor,
                    categoryIcon: lCategoryMeta.icon,
                    label: lNode.definitionId,
                    position: { x: lNode.position.x, y: lNode.position.y },
                    size: { w: lNode.size.w, h: lNode.size.h },
                    system: lNode.system,
                    selected: this.mSelectedIds.has(lNode.id),
                    inputs: lInputs,
                    outputs: lOutputs,
                    flowInputs: lFlowIns,
                    flowOutputs: lFlowOuts,
                    valueText: lNode.properties.get('value') ?? '',
                    commentText: lNode.properties.get('comment') ?? '',
                    hasDefinition: !!lDef,
                    pixelX: lNode.position.x * this.mInternals.interaction.gridSize,
                    pixelY: lNode.position.y * this.mInternals.interaction.gridSize,
                };

                lNodes.push(this.reuseNodeRenderData(lPreviousVisibleNodeMap.get(lNode.id), lNextNodeRender));

                // Store preview element for the node component to pick up via template binding.
                this.getOrCreatePreviewElement(lNode.id, lDef);
            }
            lCached.visibleNodes = lNodes;
        }

        // Assign to state property to trigger re-render.
        this.mCachedData = lCached;
    }

    /**
     * Keep render object identities stable for nodes whose visible data did not change.
     */
    private reuseNodeRenderData(pPrevious: NodeRenderData | undefined, pNext: NodeRenderData): NodeRenderData {
        if (!pPrevious) {
            return pNext;
        }

        if (
            pPrevious.definitionName !== pNext.definitionName ||
            pPrevious.category !== pNext.category ||
            pPrevious.categoryColor !== pNext.categoryColor ||
            pPrevious.categoryIcon !== pNext.categoryIcon ||
            pPrevious.label !== pNext.label ||
            pPrevious.system !== pNext.system ||
            pPrevious.selected !== pNext.selected ||
            pPrevious.hasDefinition !== pNext.hasDefinition ||
            pPrevious.valueText !== pNext.valueText ||
            pPrevious.commentText !== pNext.commentText ||
            pPrevious.pixelX !== pNext.pixelX ||
            pPrevious.pixelY !== pNext.pixelY ||
            pPrevious.position.x !== pNext.position.x ||
            pPrevious.position.y !== pNext.position.y ||
            pPrevious.size.w !== pNext.size.w ||
            pPrevious.size.h !== pNext.size.h ||
            !this.areDataPortsEqual(pPrevious.inputs, pNext.inputs) ||
            !this.areDataPortsEqual(pPrevious.outputs, pNext.outputs) ||
            !this.areFlowPortsEqual(pPrevious.flowInputs, pNext.flowInputs) ||
            !this.areFlowPortsEqual(pPrevious.flowOutputs, pNext.flowOutputs)
        ) {
            return pNext;
        }

        return pPrevious;
    }

    /**
     * Compare cached data-port arrays.
     */
    private areDataPortsEqual(
        pLeft: NodeRenderData['inputs'] | NodeRenderData['outputs'],
        pRight: NodeRenderData['inputs'] | NodeRenderData['outputs']
    ): boolean {
        if (pLeft.length !== pRight.length) {
            return false;
        }

        for (let lIndex: number = 0; lIndex < pLeft.length; lIndex++) {
            const lLeft = pLeft[lIndex];
            const lRight = pRight[lIndex];

            if (
                lLeft.id !== lRight.id ||
                lLeft.name !== lRight.name ||
                lLeft.type !== lRight.type ||
                lLeft.direction !== lRight.direction ||
                lLeft.connectedTo !== lRight.connectedTo
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Compare cached flow-port arrays.
     */
    private areFlowPortsEqual(
        pLeft: NodeRenderData['flowInputs'] | NodeRenderData['flowOutputs'],
        pRight: NodeRenderData['flowInputs'] | NodeRenderData['flowOutputs']
    ): boolean {
        if (pLeft.length !== pRight.length) {
            return false;
        }

        for (let lIndex: number = 0; lIndex < pLeft.length; lIndex++) {
            const lLeft = pLeft[lIndex];
            const lRight = pRight[lIndex];

            if (
                lLeft.id !== lRight.id ||
                lLeft.name !== lRight.name ||
                lLeft.direction !== lRight.direction ||
                lLeft.connectedTo !== lRight.connectedTo
            ) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get or create a preview element for a node. Returns null if the node
     * definition does not define a preview.
     *
     * @param pNodeId - The node's unique identifier.
     * @param pDefinition - The node's definition (may be undefined).
     *
     * @returns The cached or newly created preview HTMLElement, or null.
     */
    private getOrCreatePreviewElement(pNodeId: string, pDefinition: PotatnoNodeDefinition | undefined): HTMLElement | null {
        if (!pDefinition?.preview) {
            return null;
        }

        const lInternals: EditorInternals = this.mInternals;
        const lExisting: HTMLElement | undefined = lInternals.previewElements.get(pNodeId);
        if (lExisting) {
            return lExisting;
        }

        const lElement: Element = pDefinition.preview.generatePreview();
        if (lElement instanceof HTMLElement) {
            lInternals.previewElements.set(pNodeId, lElement);
            return lElement;
        }

        return null;
    }

    /**
     * Evaluate preview for all nodes in the active graph using code-based preview generation.
     * Generates code with intermediate snapshots and calls entry point and node preview callbacks.
     *
     * @param pPreviewInputData - Preview input data passed to preview callbacks.
     *
     * @returns null (return type kept for API compatibility).
     */
    public evaluatePreview(pPreviewInputData: Record<string, Record<string, unknown>>): Map<string, NodePreviewData> | null {
        const lProject: PotatnoProject | undefined = this.mProject;
        const lFile: PotatnoCodeFile | undefined = this.mFile;
        const lInternals: EditorInternals = this.mInternals;

        if (!lProject || !lFile) {
            return null;
        }

        // Only regenerate code when dirty.
        if (!lInternals.previewDirty) {
            return null;
        }
        lInternals.previewDirty = false;

        // Check if there are blocking errors.
        const lCachedData: CachedViewData = this.mCachedData;
        const lHasBlockingErrors: boolean = lCachedData.errors.some(
            (e: { message: string; location: string; blocking?: boolean; }) => (e as any).blocking !== false
        );
        if (lHasBlockingErrors) {
            return null;
        }

        // Find the entry point function (system function).
        let lEntryFunction: PotatnoFunction | undefined;
        for (const lFunc of lFile.functions.values()) {
            if (lFunc.system) {
                lEntryFunction = lFunc;
                break;
            }
        }

        if (!lEntryFunction) {
            return null;
        }

        // Collect node IDs that have previews.
        const lPreviewNodeIds: Set<string> = new Set<string>();
        const lGraph = lEntryFunction.graph;
        for (const lNode of lGraph.nodes.values()) {
            const lDef = lProject.nodeDefinitions.get(lNode.definitionId);
            if (lDef?.preview) {
                lPreviewNodeIds.add(lNode.id);
            }
        }

        // Generate code with intermediate snapshots.
        let lCodeResult: FunctionCodeWithIntermediates;
        try {
            const lGenerator: PotatnoCodeGenerator = new PotatnoCodeGenerator(lProject);
            lCodeResult = lGenerator.generateFunctionCodeWithIntermediates(lEntryFunction, lPreviewNodeIds);
        } catch {
            return null;
        }

        lInternals.cachedCodeResult = lCodeResult;

        // Call entry point preview callback.
        const lEntryPointPreview = lProject.entryPoint.preview;
        if (lEntryPointPreview && lInternals.entryPointPreviewElement) {
            try {
                lEntryPointPreview.updatePreview(
                    lInternals.entryPointPreviewElement,
                    lCodeResult.codeFunction,
                    pPreviewInputData,
                    lCodeResult.fullCode
                );
            } catch {
                // Silently ignore entry point preview errors.
            }
        }

        // Call node preview callbacks with intermediate code.
        for (const [lNodeId, lIntermediateData] of lCodeResult.nodeIntermediates) {
            const lElement: HTMLElement | undefined = lInternals.previewElements.get(lNodeId);
            if (!lElement) {
                continue;
            }

            const lNode = lGraph.getNode(lNodeId);
            if (!lNode) {
                continue;
            }

            const lDef = lProject.nodeDefinitions.get(lNode.definitionId);
            if (lDef?.preview) {
                try {
                    lDef.preview.updatePreview(
                        lElement,
                        lIntermediateData.context as any,
                        lIntermediateData.codeFunction,
                        pPreviewInputData,
                        lIntermediateData.intermediateCode
                    );
                } catch {
                    // Silently ignore node preview errors.
                }
            }
        }

        return null;
    }
}
