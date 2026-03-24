import { Processor, PwbChild, PwbComponent, PwbExport, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import { PotatnoCodeFile } from '../../../document/potatno-code-file.ts';
import type { PotatnoGraph } from '../../../document/potatno-graph.ts';
import type { PotatnoNode } from '../../../document/potatno-node.ts';
import { NodeCategory, NodeCategoryMeta } from '../../../node/node-category.enum.ts';
import { PortKind } from '../../../node/port-kind.enum.ts';
import type { PotatnoPortDefinition } from '../../../node/potatno-port-definition.ts';
import { PotatnoDeserializer } from '../../../parser/potatno-deserializer.ts';
import { PotatnoSerializer } from '../../../parser/potatno-serializer.ts';
import { PotatnoFunction } from '../../../project/potatno-function.ts';
import type { PotatnoImportDefinition } from '../../../project/potatno-import-definition.ts';
import type { PotatnoProject, PotatnoProjectNodeDefinition } from '../../../project/potatno-project.ts';
import { PotatnoCanvasInteraction } from '../../potatno-canvas-interaction.ts';
import { PotatnoCanvasRenderer } from '../../potatno-canvas-renderer.ts';
import { PotatnoClipboard } from '../../potatno-clipboard.ts';
import { CompositeAction } from '../../potatno-composite-action.ts';
import type { PotatnoHistoryAction } from '../../potatno-history-action.ts';
import { PotatnoHistory } from '../../potatno-history.ts';
import { NodeAddAction, NodeRemoveAction } from '../../potatno-node-actions.ts';
import { PropertyChangeAction } from '../../potatno-property-change-action.ts';
import editorCss from './potatno-code-editor.css';
import editorTemplate from './potatno-code-editor.html';

// Import child components to ensure they're registered.
import '../potatno_canvas/potatno-canvas.ts';
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
    | { mode: 'idle' }
    | { mode: 'panning'; startX: number; startY: number }
    | { mode: 'dragging-node'; nodeId: string; startX: number; startY: number; origins: Array<{ nodeId: string; originX: number; originY: number }> }
    | { mode: 'dragging-wire'; sourceNodeId: string; sourcePortId: string; portKind: string; direction: string; type: string; startX: number; startY: number }
    | { mode: 'selecting'; startX: number; startY: number }
    | { mode: 'resizing-comment'; nodeId: string; startX: number; startY: number; originalW: number; originalH: number };

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
    previewInitialized: boolean;
}

/**
 * Centralized store for editor state. Keeps all mutable data outside
 * PWB's deep proxy to ensure Map/Set operations work correctly.
 * Instantiated as a module-level singleton (class instances are acceptable).
 */
class EditorStateStore {
    private readonly mFiles: Map<string, PotatnoCodeFile> = new Map();
    private readonly mInternals: Map<string, EditorInternals> = new Map();
    private readonly mProjects: Map<string, PotatnoProject> = new Map();
    private readonly mSelections: Map<string, Set<string>> = new Map();

    public deleteAll(pKey: string): void {
        this.mProjects.delete(pKey);
        this.mFiles.delete(pKey);
        this.mSelections.delete(pKey);
        this.mInternals.delete(pKey);
    }

    public deleteFile(pKey: string): void {
        this.mFiles.delete(pKey);
    }

    public getFile(pKey: string): PotatnoCodeFile | undefined {
        return this.mFiles.get(pKey);
    }

    public getInternals(pKey: string): EditorInternals | undefined {
        return this.mInternals.get(pKey);
    }

    public getProject(pKey: string): PotatnoProject | undefined {
        return this.mProjects.get(pKey);
    }

    public getSelection(pKey: string): Set<string> | undefined {
        return this.mSelections.get(pKey);
    }

    public setFile(pKey: string, pFile: PotatnoCodeFile): void {
        this.mFiles.set(pKey, pFile);
    }

    public setInternals(pKey: string, pInternals: EditorInternals): void {
        this.mInternals.set(pKey, pInternals);
    }

    public setProject(pKey: string, pProject: PotatnoProject): void {
        this.mProjects.set(pKey, pProject);
    }

    public setSelection(pKey: string, pSelection: Set<string>): void {
        this.mSelections.set(pKey, pSelection);
    }
}

const gStore: EditorStateStore = new EditorStateStore();

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
export class PotatnoCodeEditor extends Processor implements IComponentOnConnect, IComponentOnDeconstruct {
    private mInstanceKey: string;
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
     * gStore internals cachedData.
     */
    private mCacheVersion: number;

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
        return this.getProject();
    }

    /**
     * Set the project configuration.
     */
    @PwbExport
    public set project(pProject: PotatnoProject) {
        gStore.setProject(this.mInstanceKey, pProject);
        this.rebuildCachedData();
    }

    /**
     * Get the current code file (document state).
     */
    public get file(): PotatnoCodeFile | null {
        return gStore.getFile(this.mInstanceKey) ?? null;
    }

    /**
     * Set the code file (document state).
     * Automatically initializes main functions if the file has no functions.
     */
    @PwbExport
    public set file(pFile: PotatnoCodeFile | null) {
        if (pFile) {
            gStore.setFile(this.mInstanceKey, pFile);

            // Auto-initialize main functions if the file is empty and project has main function definitions.
            const lProject: PotatnoProject | undefined = gStore.getProject(this.mInstanceKey);
            if (lProject && pFile.functions.size === 0) {
                this.initializeMainFunctions(pFile, lProject);
            }
        } else {
            gStore.deleteFile(this.mInstanceKey);
        }

        this.getSelectedIds().clear();
        this.getInternals().history.clear();
        this.getInternals().previewInitialized = false;
        this.rebuildCachedData();
        this.renderConnections();
        this.initializePreview();
        this.updatePreview();
    }

    /**
     * Get the active function identifier.
     */
    public get activeFunctionId(): string {
        void this.mCacheVersion;
        return this.getInternals().cachedData.activeFunctionId;
    }

    /**
     * Get the canvas interaction helper.
     */
    public get interaction(): PotatnoCanvasInteraction {
        return this.getInternals().interaction;
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
        void this.mCacheVersion;
        return this.getInternals().cachedData.hasPreview;
    }

    /**
     * Get the current list of validation errors.
     */
    public get editorErrors(): Array<{ message: string; location: string }> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.errors;
    }

    /**
     * Get the CSS for the grid background.
     */
    public get gridBackgroundStyle(): string {
        return this.getInternals().interaction.getGridBackgroundCss();
    }

    /**
     * Get the CSS transform for the canvas content layer.
     */
    public get gridTransformStyle(): string {
        return 'transform: ' + this.getInternals().interaction.getTransformCss();
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
    public get visibleNodes(): Array<any> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.visibleNodes;
    }

    /**
     * Get the cached list of node definitions for the library panel.
     */
    public get nodeDefinitionList(): Array<{ name: string; category: string }> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.nodeDefinitionList;
    }

    /**
     * Get the cached list of functions for the function list panel.
     */
    public get functionList(): Array<{ id: string; name: string; label: string; system: boolean }> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.functionList;
    }

    /**
     * Get the name of the active function.
     */
    public get activeFunctionName(): string {
        void this.mCacheVersion;
        return this.getInternals().cachedData.activeFunctionName;
    }

    /**
     * Get the active function's input port definitions.
     */
    public get activeFunctionInputs(): Array<{ name: string; type: string }> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.activeFunctionInputs;
    }

    /**
     * Get the active function's output port definitions.
     */
    public get activeFunctionOutputs(): Array<{ name: string; type: string }> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.activeFunctionOutputs;
    }

    /**
     * Get the active function's import list.
     */
    public get activeFunctionImports(): Array<string> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.activeFunctionImports;
    }

    /**
     * Whether the active function is a system function.
     */
    public get activeFunctionIsSystem(): boolean {
        void this.mCacheVersion;
        return this.getInternals().cachedData.activeFunctionIsSystem;
    }

    /**
     * Whether the active function's definition is editable by the user.
     */
    public get activeFunctionEditableByUser(): boolean {
        void this.mCacheVersion;
        return this.getInternals().cachedData.activeFunctionEditableByUser;
    }

    /**
     * Get the list of available import names.
     */
    public get availableImportsList(): Array<string> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.availableImports;
    }

    /**
     * Get the list of all available port types.
     */
    public get availableTypes(): Array<string> {
        void this.mCacheVersion;
        return this.getInternals().cachedData.availableTypes;
    }

    // ============================================================
    // Private Store Helpers
    // ============================================================

    /**
     * Get the raw (non-proxied) project instance from the module-level store.
     */
    private getProject(): PotatnoProject {
        return gStore.getProject(this.mInstanceKey)!;
    }

    /**
     * Get the raw (non-proxied) file instance from the module-level store.
     */
    private getFile(): PotatnoCodeFile {
        return gStore.getFile(this.mInstanceKey)!;
    }

    /**
     * Get the raw (non-proxied) selection set from the module-level store.
     */
    private getSelectedIds(): Set<string> {
        return gStore.getSelection(this.mInstanceKey)!;
    }

    /**
     * Get the raw (non-proxied) internals from the module-level store.
     */
    private getInternals(): EditorInternals {
        return gStore.getInternals(this.mInstanceKey)!;
    }

    /**
     * Constructor. Initializes internal stores and default state.
     */
    public constructor() {
        super();
        this.mInstanceKey = crypto.randomUUID();
        gStore.setSelection(this.mInstanceKey, new Set<string>());
        gStore.setInternals(this.mInstanceKey, {
            history: new PotatnoHistory(),
            clipboard: new PotatnoClipboard(),
            interaction: new PotatnoCanvasInteraction(20),
            renderer: new PotatnoCanvasRenderer(),
            hoveredPort: null,
            interactionState: { mode: 'idle' },
            previewInitialized: false,
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
    // Public API (exposed on the HTML element via @PwbExport)
    // ============================================================

    /**
     * Load code from a string, deserializing into a new PotatnoCodeFile.
     *
     * @param pCode - The code string containing embedded metadata markers.
     */
    @PwbExport
    public loadCode(pCode: string): void {
        const lProject: PotatnoProject = this.getProject();
        const lDeserializer: PotatnoDeserializer = new PotatnoDeserializer(lProject);
        const lNewFile: PotatnoCodeFile = lDeserializer.deserialize(pCode);
        gStore.setFile(this.mInstanceKey, lNewFile);
        this.getInternals().history.clear();
        this.getSelectedIds().clear();
        this.getInternals().previewInitialized = false;
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
        const lProject: PotatnoProject = this.getProject();
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
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
        gStore.deleteAll(this.mInstanceKey);
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
        const lProject: PotatnoProject = this.getProject();
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        if (!lFile) {
            return;
        }

        let lDefinition: PotatnoProjectNodeDefinition | undefined = lProject.nodeDefinitions.get(lDefName);

        // Check if it's a user-defined function rather than a built-in node definition.
        if (!lDefinition) {
            for (const lFunc of lFile.functions.values()) {
                if (lFunc.name === lDefName && !lFunc.system) {
                    lDefinition = {
                        name: lFunc.name,
                        category: NodeCategory.Function,
                        inputs: [...lFunc.inputs],
                        outputs: [...lFunc.outputs]
                    };
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
                            if (lNodeDef.name === lDefName) {
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

        // Check global input getter nodes.
        if (!lDefinition) {
            for (const lGlobalInput of lProject.globalInputs) {
                if (lDefName === `Get ${lGlobalInput.name}`) {
                    lDefinition = {
                        name: lDefName,
                        category: NodeCategory.Value,
                        inputs: [],
                        outputs: [{ name: lGlobalInput.name, type: lGlobalInput.type }]
                    };
                    break;
                }
            }
        }

        // Check global output setter nodes.
        if (!lDefinition) {
            for (const lGlobalOutput of lProject.globalOutputs) {
                if (lDefName === `Set ${lGlobalOutput.name}`) {
                    lDefinition = {
                        name: lDefName,
                        category: NodeCategory.Value,
                        inputs: [{ name: lGlobalOutput.name, type: lGlobalOutput.type }],
                        outputs: []
                    };
                    break;
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

    /**
     * Handle function selection from the function list.
     *
     * @param pEvent - The event containing the function identifier.
     */
    public onFunctionSelect(pEvent: any): void {
        const lFuncId: string = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        if (!lFile) {
            return;
        }
        lFile.setActiveFunction(lFuncId);
        this.getSelectedIds().clear();
        this.rebuildCachedData();
        this.renderConnections();
    }

    /**
     * Handle adding a new user function.
     */
    public onFunctionAdd(): void {
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        if (!lFile) {
            return;
        }
        const lCount: number = this.getInternals().cachedData.functionList.length;
        const lFunc: PotatnoFunction = new PotatnoFunction(
            crypto.randomUUID(),
            `function_${lCount}`,
            `Function ${lCount}`,
            false
        );
        lFile.addFunction(lFunc);
        lFile.setActiveFunction(lFunc.id);
        this.getSelectedIds().clear();
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
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        if (!lFile) {
            return;
        }
        lFile.removeFunction(lFuncId);
        this.getSelectedIds().clear();
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
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
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
            const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
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
            const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
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

                    const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
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
        this.getInternals().interaction.zoomAt(lMouseX, lMouseY, pEvent.deltaY > 0 ? -0.1 : 0.1);
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
                const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
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
        const lInternals: EditorInternals = this.getInternals();
        const lSelectedIds: Set<string> = this.getSelectedIds();
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
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
        const lOrigins: Array<{ nodeId: string; originX: number; originY: number }> = [];
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
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        const lGraph: PotatnoGraph | undefined = lFile?.activeFunction?.graph;
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
     *
     * @param pEvent - The event containing resize start data.
     * @param _pNodeRender - Unused node render data.
     */
    public onNodeResizeStart(pEvent: any, _pNodeRender: any): void {
        const lData = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        const lNode: PotatnoNode | undefined = lFile?.activeFunction?.graph.getNode(lData.nodeId);
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
     *
     * @param pEvent - The event containing the new comment text.
     */
    public onCommentChange(pEvent: any): void {
        const lData = pEvent.value ?? pEvent.detail?.value ?? pEvent;
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        const lNode: PotatnoNode | undefined = lFile?.activeFunction?.graph.getNode(lData.nodeId);
        if (lNode) {
            const lAction: PropertyChangeAction = new PropertyChangeAction(lNode, 'comment', lData.text);
            this.getInternals().history.push(lAction);
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
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        const lNode: PotatnoNode | undefined = lFile?.activeFunction?.graph.getNode(lData.nodeId);
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
            this.getInternals().history.undo();
            this.rebuildCachedData();
            this.renderConnections();
            this.updatePreview();
            return;
        }

        if (pEvent.ctrlKey && (pEvent.key === 'y' || (pEvent.shiftKey && pEvent.key === 'z'))) {
            pEvent.preventDefault();
            this.getInternals().history.redo();
            this.rebuildCachedData();
            this.renderConnections();
            this.updatePreview();
            return;
        }

        if (pEvent.ctrlKey && pEvent.key === 'c') {
            const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
            const lGraph: PotatnoGraph | undefined = lFile?.activeFunction?.graph;
            if (lGraph) {
                this.getInternals().clipboard.copy(lGraph, this.getSelectedIds());
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
     * Initialize main functions from the project configuration into a file.
     *
     * @param pFile - The file to initialize.
     * @param pConfig - The project configuration providing main function definitions.
     */
    private initializeMainFunctions(pFile: PotatnoCodeFile, pConfig: PotatnoProject): void {
        for (const lMainDef of pConfig.mainFunctions) {
            const lFunc: PotatnoFunction = new PotatnoFunction(
                crypto.randomUUID(),
                lMainDef.name,
                lMainDef.label,
                true,
                lMainDef.editableByUser ?? false
            );

            // Convert Record<string, string> inputs/outputs to Array<PotatnoPortDefinition>.
            const lInputs: Array<PotatnoPortDefinition> = lMainDef.inputs
                ? Object.entries(lMainDef.inputs).map(([lName, lType]) => ({ name: lName, type: lType }))
                : [];
            const lOutputs: Array<PotatnoPortDefinition> = lMainDef.outputs
                ? Object.entries(lMainDef.outputs).map(([lName, lType]) => ({ name: lName, type: lType }))
                : [];

            lFunc.setInputs(lInputs);
            lFunc.setOutputs(lOutputs);

            // Create fixed input nodes for the function's inputs.
            for (let lIdx = 0; lIdx < lInputs.length; lIdx++) {
                const lInput: PotatnoPortDefinition = lInputs[lIdx];
                const lInputNodeDef: PotatnoProjectNodeDefinition = {
                    name: lInput.name,
                    category: NodeCategory.Input,
                    inputs: [],
                    outputs: [{ name: lInput.name, type: lInput.type }]
                };
                lFunc.graph.addNode(lInputNodeDef, { x: 2, y: 2 + lIdx * 3 }, true);
            }

            // Create fixed output nodes for the function's outputs.
            for (let lIdx = 0; lIdx < lOutputs.length; lIdx++) {
                const lOutput: PotatnoPortDefinition = lOutputs[lIdx];
                const lOutputNodeDef: PotatnoProjectNodeDefinition = {
                    name: lOutput.name,
                    category: NodeCategory.Output,
                    inputs: [{ name: lOutput.name, type: lOutput.type }],
                    outputs: []
                };
                lFunc.graph.addNode(lOutputNodeDef, { x: 30, y: 2 + lIdx * 3 }, true);
            }

            // Create fixed event nodes for the function's events.
            if (lMainDef.events) {
                for (let lIdx = 0; lIdx < lMainDef.events.length; lIdx++) {
                    const lEvent = lMainDef.events[lIdx];
                    const lEventNodeDef: PotatnoProjectNodeDefinition = {
                        name: lEvent.name,
                        category: NodeCategory.Event,
                        inputs: [],
                        outputs: [...lEvent.outputs]
                    };
                    lFunc.graph.addNode(lEventNodeDef, { x: 2 + lIdx * 10, y: -4 }, true);
                }
            }

            pFile.addFunction(lFunc);
        }
    }

    /**
     * Delete all currently selected nodes.
     */
    private deleteSelectedNodes(): void {
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        const lGraph: PotatnoGraph | undefined = lFile?.activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        const lActions: Array<PotatnoHistoryAction> = [];
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

    /**
     * Paste nodes from the clipboard into the active function's graph.
     */
    private pasteFromClipboard(): void {
        const lInternals: EditorInternals = this.getInternals();
        const lData = lInternals.clipboard.getData();
        if (!lData) {
            return;
        }

        const lProject: PotatnoProject = this.getProject();
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        const lGraph: PotatnoGraph | undefined = lFile?.activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        const lActions: Array<PotatnoHistoryAction> = [];
        const lAddActions: Array<NodeAddAction> = [];
        for (const lNodeData of lData.nodes) {
            const lDef: PotatnoProjectNodeDefinition | undefined = lProject.nodeDefinitions.get(lNodeData.definitionName);
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

    /**
     * Select all nodes that fall within the current selection box.
     */
    private selectNodesInBox(): void {
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        const lGraph: PotatnoGraph | undefined = lFile?.activeFunction?.graph;
        if (!lGraph) {
            return;
        }

        const lInternals: EditorInternals = this.getInternals();

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
                this.getSelectedIds().add(lNode.id);
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

        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        const lGraph: PotatnoGraph | undefined = lFile?.activeFunction?.graph;
        if (!lGraph) {
            this.getInternals().renderer.clearAll(this.svgLayer);
            return;
        }

        const lInternals: EditorInternals = this.getInternals();
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
        const lProject: PotatnoProject | undefined = gStore.getProject(this.mInstanceKey);
        if (!lProject) {
            return;
        }

        const lCreateCallback = lProject.createPreview;
        if (!lCreateCallback) {
            return;
        }

        const lInternals: EditorInternals = this.getInternals();
        if (lInternals.previewInitialized) {
            return;
        }

        const lPreviewEl: any = (this as any).previewEl;
        if (lPreviewEl && typeof lPreviewEl.getContainer === 'function') {
            const lContainer: HTMLElement = lPreviewEl.getContainer();
            lCreateCallback(lContainer);
            lInternals.previewInitialized = true;
        }
    }

    /**
     * Update the preview with newly generated code.
     * Uses the updatePreview callback from the project configuration.
     */
    private updatePreview(): void {
        const lProject: PotatnoProject | undefined = gStore.getProject(this.mInstanceKey);
        if (!lProject) {
            return;
        }

        const lUpdateCallback = lProject.updatePreview;
        if (!lUpdateCallback) {
            return;
        }

        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        if (!lFile) {
            return;
        }

        // Check if there are errors, don't generate code.
        // Note: unconnected input warnings are not blocking errors.
        const lCachedData: CachedViewData = this.getInternals().cachedData;
        const lHasBlockingErrors: boolean = lCachedData.errors.some(
            (e: { message: string; location: string; blocking?: boolean }) => (e as any).blocking !== false
        );
        if (lHasBlockingErrors) {
            return;
        }

        // Generate code.
        let lCleanCode: string;
        try {
            const lSerializer: PotatnoSerializer = new PotatnoSerializer(lProject);
            const lCode: string = lSerializer.serialize(lFile);
            lCleanCode = this.stripMetadataComments(lCode, lProject.commentToken);
        } catch {
            return;
        }

        // Debounce the update.
        clearTimeout(this.mPreviewDebounceTimer);
        this.mPreviewDebounceTimer = setTimeout(() => {
            try {
                lUpdateCallback(lCleanCode);
            } catch {
                // Silently ignore preview errors.
            }
        }, 300) as unknown as number;
    }

    /**
     * Strip the trailing #potatno metadata comment from generated code.
     *
     * @param pCode - The code string to strip.
     * @param pToken - The comment token.
     *
     * @returns The code string with the metadata comment removed.
     */
    private stripMetadataComments(pCode: string, pToken: string): string {
        const lLines: Array<string> = pCode.split('\n');
        const lPrefix: string = `${pToken} #potatno `;
        const lFiltered: Array<string> = lLines.filter((lLine) => {
            return !lLine.trim().startsWith(lPrefix);
        });
        return lFiltered.join('\n');
    }

    /**
     * Update only a single node's pixel position in the cached visible nodes array.
     *
     * @param pNodeId - The identifier of the node to update.
     */
    private updateNodePosition(pNodeId: string): void {
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        const lNode: PotatnoNode | undefined = lFile?.activeFunction?.graph.getNode(pNodeId);
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
     *
     * @param pNodeId - The identifier of the node to update.
     */
    private updateNodeSize(pNodeId: string): void {
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        const lNode: PotatnoNode | undefined = lFile?.activeFunction?.graph.getNode(pNodeId);
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
     *
     * @returns An array of error objects with message and location.
     */
    private validateProject(): Array<{ message: string; location: string }> {
        const lErrors: Array<{ message: string; location: string }> = [];
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
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
            for (const lInput of lFunc.inputs) {
                if (!lNameRegex.test(lInput.name)) {
                    lErrors.push({ message: `Invalid input name "${lInput.name}".`, location: `Function "${lFunc.name}" > Inputs` });
                }
                if (lPortNames.has(lInput.name)) {
                    lErrors.push({ message: `Duplicate input/output name "${lInput.name}".`, location: `Function "${lFunc.name}" > Inputs` });
                }
                lPortNames.add(lInput.name);
            }

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

        const lFunc: PotatnoFunction | undefined = lFile.activeFunction;
        if (!lFunc) {
            lErrors.push({ message: 'No active function selected.', location: 'Editor' });
            return lErrors;
        }

        for (const lNode of lFunc.graph.nodes.values()) {
            for (const lInput of lNode.inputs.values()) {
                if (!lInput.connectedTo && !lNode.system) {
                    lErrors.push({
                        message: `Input "${lInput.name}" on node "${lNode.definitionName}" is not connected.`,
                        location: `Function "${lFunc.name}" > Node "${lNode.definitionName}"`,
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
     * Rebuild all cached view data. Writes to the unproxied module-level
     * store, then increments mCacheVersion ONCE to trigger exactly one
     * PWB update cycle.
     */
    private rebuildCachedData(): void {
        const lProject: PotatnoProject | undefined = gStore.getProject(this.mInstanceKey);
        const lFile: PotatnoCodeFile | undefined = gStore.getFile(this.mInstanceKey);
        const lCached: CachedViewData = this.getInternals().cachedData;

        // Active function ID.
        lCached.activeFunctionId = lFile?.activeFunctionId ?? '';

        // Preview availability.
        lCached.hasPreview = lProject?.hasPreview ?? false;

        // Validate and cache errors.
        lCached.errors = this.validateProject();

        // Node definitions.
        const lNodeDefs: Array<{ name: string; category: string }> = [];
        if (lProject) {
            for (const lDef of lProject.nodeDefinitions.values()) {
                lNodeDefs.push({ name: lDef.name, category: lDef.category });
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
        const lFuncs: Array<{ id: string; name: string; label: string; system: boolean }> = [];
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
                            lNodeDefs.push({ name: lNodeDef.name, category: lNodeDef.category });
                        }
                    }
                }
            }
        }

        // Add global input getter nodes and global output setter nodes.
        if (lProject) {
            for (const lGlobalInput of lProject.globalInputs) {
                lNodeDefs.push({ name: `Get ${lGlobalInput.name}`, category: NodeCategory.Value });
            }
            for (const lGlobalOutput of lProject.globalOutputs) {
                lNodeDefs.push({ name: `Set ${lGlobalOutput.name}`, category: NodeCategory.Value });
            }
        }

        // Available imports.
        lCached.availableImports = lProject?.imports.map((lImport: PotatnoImportDefinition) => lImport.name) ?? [];

        // Available types.
        const lTypeSet: Set<string> = new Set<string>();
        if (lProject) {
            for (const lDef of lProject.nodeDefinitions.values()) {
                for (const lInput of lDef.inputs) {
                    lTypeSet.add(lInput.type);
                }
                for (const lOutput of lDef.outputs) {
                    lTypeSet.add(lOutput.type);
                }
            }
        }
        lCached.availableTypes = [...lTypeSet].sort();

        // Active function data.
        const lActiveFunc: PotatnoFunction | undefined = lFile?.activeFunction;
        lCached.activeFunctionName = lActiveFunc?.name ?? '';
        lCached.activeFunctionIsSystem = lActiveFunc?.system ?? false;
        lCached.activeFunctionEditableByUser = lActiveFunc?.editableByUser ?? false;
        lCached.activeFunctionInputs = [...(lActiveFunc?.inputs ?? [])];
        lCached.activeFunctionOutputs = [...(lActiveFunc?.outputs ?? [])];
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

            const lNodes: Array<any> = [];
            for (const lNode of lActiveFunc.graph.nodes.values()) {
                const lDef = lProject?.nodeDefinitions.get(lNode.definitionName);
                const lCategoryMeta = NodeCategoryMeta.get(lNode.category);
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
