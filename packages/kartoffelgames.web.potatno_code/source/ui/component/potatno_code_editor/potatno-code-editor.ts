import { ComponentState, PwbChild, PwbComponent, PwbExport, type ComponentEvent, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import { PotatnoDocumentFunction as PDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { PotatnoDocument } from '../../../document/potatno-document.ts';
import { NodeCategory } from '../../../parser/node/node-category.enum.ts';
import { PotatnoCodeGenerator, type FunctionCodeWithIntermediates } from '../../../parser/potatno-code-generator.ts';
import type { PotatnoProject } from '../../../project/potatno-project.ts';
import { PotatnoDeserializer } from '../../../serialization/potatno-deserializer.ts';
import type { PotatnoCodeFileSerializationResult } from '../../../serialization/potatno-serialization.type.ts';
import { PotatnoSerializer } from '../../../serialization/potatno-serializer.ts';
import { PotatnoCanvasInteraction } from '../../potatno-canvas-interaction.ts';
import { PotatnoCanvasRenderer } from '../../potatno-canvas-renderer.ts';
import { PotatnoClipboard } from '../../potatno-clipboard.ts';
import { PotatnoHistory } from '../../potatno-history.ts';
import type { CommentChangeDetail, DirectValueChangeDetail, OpenFunctionDetail, ResizeStartDetail } from '../potatno_node_component/potatno-node-component.ts';
import type { PortInteractionDetail } from '../potatno_port/potatno-port.ts';
import editorCss from './potatno-code-editor.css' with { type: 'text' };
import editorTemplate from './potatno-code-editor.html' with { type: 'text' };

// Import child components to ensure they're registered.
import { PotatnoFunctionDefinitionStatics } from "../../../project/potatno-function-definition.ts";
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
 * Main editor component for the potatno-code visual programming environment.
 */
@PwbComponent({
    selector: 'potatno-code-editor',
    template: editorTemplate,
    style: editorCss,
})
export class PotatnoCodeEditor<TProject extends PotatnoProject<any>> implements IComponentOnConnect, IComponentOnDeconstruct {
    private mProject: TProject | undefined;
    private mFile: PotatnoDocument<TProject> | undefined;
    private mActiveFunctionId: string = '';
    private mSelectedNodes: Set<PotatnoDocumentNode<TProject>> = new Set();
    private mInternals!: EditorInternals<TProject>;
    private mSelectionBoxScreen: { x1: number; y1: number; x2: number; y2: number; };
    private mHistoryDebounceTimer: number = 0;
    private mPreviewDebounceTimer: number = 0;
    private mConnectionVersion: number = 0;
    private mKeyboardHandler: ((e: KeyboardEvent) => void) | null;
    private mResizeState: { panel: 'left' | 'right'; startX: number; startWidth: number; } | null;
    private mResizeMoveHandler: ((e: PointerEvent) => void) | null;
    private mResizeUpHandler: ((e: PointerEvent) => void) | null;
    private mConnectionRegistry: Map<string, { sourcePort: PotatnoDocumentPort<TProject>; targetPort: PotatnoDocumentPort<TProject>; }> = new Map();

    @ComponentState.state({ complexValue: true })
    private accessor mCachedData: CachedViewData;

    @ComponentState.state()
    private accessor mShowSelectionBox: boolean = false;

    @ComponentState.state()
    private accessor mTransformVersion: number = 0;

    @ComponentState.state()
    private accessor mEntryPointPreviewElement: Element | null = null;

    @PwbChild('svgLayer')
    public accessor svgLayer!: SVGSVGElement;

    @PwbChild('canvasWrapper')
    public accessor canvasWrapper!: HTMLElement;

    @PwbChild('panelLeft')
    public accessor panelLeft!: HTMLElement;

    @PwbChild('panelRight')
    public accessor panelRight!: HTMLElement;

    // ── Private computed property ────────────────────────────────────────

    private get activeFunction(): PotatnoDocumentFunction<TProject> | null {
        if (!this.mFile) {
            return null;
        }
        for (const lFunc of this.mFile.functions) {
            if (lFunc.id === this.mActiveFunctionId) {
                return lFunc;
            }
        }
        return null;
    }

    // ── Template getters ─────────────────────────────────────────────────

    public get activeFunctionId(): string {
        return this.mActiveFunctionId;
    }

    public get interaction(): PotatnoCanvasInteraction {
        return this.mInternals.interaction;
    }

    public get showSelectionBox(): boolean {
        return this.mShowSelectionBox;
    }

    public get hasPreview(): boolean {
        return this.mCachedData.hasPreview;
    }

    public get entryPreviewElement(): Element | null {
        return this.mEntryPointPreviewElement;
    }

    public get editorErrors(): Array<{ message: string; location: string; }> {
        return this.mCachedData.errors;
    }

    public get gridBackgroundStyle(): string {
        void this.mTransformVersion;
        return this.mInternals.interaction.getGridBackgroundCss();
    }

    public get gridTransformStyle(): string {
        void this.mTransformVersion;
        return 'transform: ' + this.mInternals.interaction.getTransformCss();
    }

    public get selectionBoxStyle(): string {
        const lX: number = Math.min(this.mSelectionBoxScreen.x1, this.mSelectionBoxScreen.x2);
        const lY: number = Math.min(this.mSelectionBoxScreen.y1, this.mSelectionBoxScreen.y2);
        const lW: number = Math.abs(this.mSelectionBoxScreen.x2 - this.mSelectionBoxScreen.x1);
        const lH: number = Math.abs(this.mSelectionBoxScreen.y2 - this.mSelectionBoxScreen.y1);
        return `left: ${lX}px; top: ${lY}px; width: ${lW}px; height: ${lH}px`;
    }

    public get visibleNodes(): Array<NodeViewState> {
        return this.mCachedData.visibleNodes;
    }

    public get nodeDefinitionList(): Array<{ id: string; name: string; category: string; }> {
        return this.mCachedData.nodeDefinitionList;
    }

    public get functionList(): Array<{ id: string; name: string; label: string; system: boolean; }> {
        return this.mCachedData.functionList;
    }

    public get userFunctionDefinitions(): Array<{ id: string; }> {
        const lProject: TProject | undefined = this.mProject;
        if (!lProject) {
            return [];
        }
        return [...lProject.userFunctions.values()].map(lDef => ({ id: lDef.id }));
    }

    public get activeFunctionName(): string {
        return this.mCachedData.activeFunctionName;
    }

    public get activeFunctionInputs(): Array<{ name: string; type: string; }> {
        return this.mCachedData.activeFunctionInputs;
    }

    public get activeFunctionOutputs(): Array<{ name: string; type: string; }> {
        return this.mCachedData.activeFunctionOutputs;
    }

    public get activeFunctionImports(): Array<string> {
        return this.mCachedData.activeFunctionImports;
    }

    public get activeFunctionIsSystem(): boolean {
        return this.mCachedData.activeFunctionIsSystem;
    }

    public get activeFunctionEditableByUser(): boolean {
        return this.mCachedData.activeFunctionEditableByUser;
    }

    public get availableImportsList(): Array<string> {
        return this.mCachedData.availableImports;
    }

    public get availableTypes(): Array<string> {
        return this.mCachedData.availableTypes;
    }

    public getPreviewElementForNode(pNode: PotatnoDocumentNode<TProject>): HTMLElement | null {
        return this.mInternals.previewElements.get(pNode) ?? null;
    }

    // ── Constructor ──────────────────────────────────────────────────────

    public constructor() {
        this.mInternals = {
            history: new PotatnoHistory(),
            clipboard: new PotatnoClipboard(),
            interaction: new PotatnoCanvasInteraction(20),
            renderer: new PotatnoCanvasRenderer(),
            hoveredPort: null,
            interactionState: { mode: 'idle' },
            previewElements: new Map(),
            entryPointPreviewElement: null,
            previewDirty: true,
            cachedCodeResult: null,
        };
        this.mCachedData = this.createEmptyCachedData();
        this.mSelectionBoxScreen = { x1: 0, y1: 0, x2: 0, y2: 0 };
        this.mKeyboardHandler = null;
        this.mResizeState = null;
        this.mResizeMoveHandler = null;
        this.mResizeUpHandler = null;
    }

    // ── Public API ───────────────────────────────────────────────────────

    @PwbExport
    public set project(pProject: TProject) {
        this.mProject = pProject;
        this.rebuildCachedData();
    }

    @PwbExport
    public set file(pFile: PotatnoDocument<TProject> | null) {
        if (pFile) {
            this.mFile = pFile;
            const lProject = this.mProject;
            if (lProject && pFile.functions.size === 0) {
                this.initializeMainFunctions(pFile, lProject);
            }
            this.mActiveFunctionId = [...pFile.functions][0]?.id ?? '';
        } else {
            this.mFile = undefined;
            this.mActiveFunctionId = '';
        }

        this.mSelectedNodes.clear();
        this.mInternals.history.clear();
        this.mInternals.previewElements.clear();
        this.rebuildCachedData();
        try {
            this.renderConnections();
        } catch (pError) {
            console.warn('[Editor] renderConnections skipped (component not yet rendered):', pError);
        }
        this.schedulePreviewUpdate();
    }

    @PwbExport
    public loadCode(pData: PotatnoCodeFileSerializationResult): void {
        const lProject = this.mProject!;
        const lDeserializer = new PotatnoDeserializer(lProject);
        const lNewFile = lDeserializer.deserialize(pData);
        this.mFile = lNewFile;
        this.mActiveFunctionId = [...lNewFile.functions][0]?.id ?? '';
        this.mInternals.history.clear();
        this.mSelectedNodes.clear();
        this.mInternals.previewElements.clear();
        this.rebuildCachedData();
        try {
            this.renderConnections();
        } catch (pError) {
            console.warn('[Editor] renderConnections skipped (component not yet rendered):', pError);
        }
        this.schedulePreviewUpdate();
    }

    @PwbExport
    public generateCode(): PotatnoCodeFileSerializationResult | null {
        if (!this.mFile) {
            return null;
        }
        const lSerializer = new PotatnoSerializer<TProject>();
        return lSerializer.serialize(this.mFile);
    }

    @PwbExport
    public triggerPreviewUpdate(): void {
        // Called every frame from the render loop — only refresh visuals from the
        // cached code result. Full code regeneration is handled by schedulePreviewUpdate
        // on graph changes.
        this.updateNodePreviewsFromCache();
    }

    // ── Lifecycle ────────────────────────────────────────────────────────

    public onConnect(): void {
        this.mKeyboardHandler = (pEvent: KeyboardEvent) => this.onKeyDown(pEvent);
        document.addEventListener('keydown', this.mKeyboardHandler);
    }

    public onDeconstruct(): void {
        if (this.mKeyboardHandler) {
            document.removeEventListener('keydown', this.mKeyboardHandler);
        }
    }

    // ── Left Panel Events ────────────────────────────────────────────────

    public onNodeDragFromLibrary(pEvent: ComponentEvent<string>): void {
        const lDefId: string = pEvent.value;
        const lFile = this.mFile;
        const lProject = this.mProject;
        const lActiveFunc = this.activeFunction;
        if (!lFile || !lProject || !lActiveFunc) {
            return;
        }

        // Look up definition: project nodes first, then user-function nodes from document.
        const lDefinition = lProject.nodeDefinitions.get(lDefId)
            ?? lFile.nodeDefinitions.get(lDefId);
        if (!lDefinition) {
            return;
        }

        // Place at center of visible canvas area.
        const lWrapper = this.canvasWrapper;
        const lW = lWrapper?.clientWidth ?? 800;
        const lH = lWrapper?.clientHeight ?? 600;
        const lCenter = this.mInternals.interaction.screenToWorld(lW / 2, lH / 2);
        const lSnapped = this.mInternals.interaction.snapToGrid(lCenter.x, lCenter.y);
        const lGS = this.mInternals.interaction.gridSize;

        lActiveFunc.newNode(lDefinition, {
            x: Math.round(lSnapped.x / lGS),
            y: Math.round(lSnapped.y / lGS),
            width: 10,
            height: 4
        });

        this.scheduleHistorySnapshot();
        this.rebuildCachedData();
        this.renderConnections();
        this.schedulePreviewUpdate();
    }

    public onFunctionSelect(pEvent: ComponentEvent<string>): void {
        this.mActiveFunctionId = pEvent.value;
        this.mSelectedNodes.clear();
        this.rebuildCachedData();
        this.renderConnections();
    }

    public onFunctionAdd(pEvent: ComponentEvent<string>): void {
        const lDefinitionId: string = pEvent.value;
        const lFile = this.mFile;
        const lProject = this.mProject;
        if (!lFile || !lProject) {
            return;
        }
        const lFuncDef = lProject.userFunctions.get(lDefinitionId);
        if (!lFuncDef) {
            return;
        }

        const lCount = lFile.functions.size;
        const lFunc = new PDocumentFunction(lProject, lFuncDef.id, crypto.randomUUID(), `Function ${lCount}`, false);

        // Add static nodes from the function definition.
        lFuncDef.prefilledNodes.forEach((lStaticDef, lIdx) => {
            lFunc.newNode(lStaticDef, { x: 2 + lIdx * 12, y: 2, width: 10, height: 4 }, true);
            if (!lProject.nodeDefinitions.has(lStaticDef.id)) {
                lProject.addNodeDefinition(lStaticDef);
            }
        });

        // Register dynamic node definitions.
        for (const lDynamicDef of lFuncDef.nodes) {
            if (!lProject.nodeDefinitions.has(lDynamicDef.id)) {
                lProject.addNodeDefinition(lDynamicDef);
            }
        }

        // Auto-enable all imports if the definition requests static imports.
        if ((lFuncDef.statics & PotatnoFunctionDefinitionStatics.imports) !== 0) {
            for (const lImport of lProject.imports) {
                lFunc.addImport(lImport.label);
            }
        }

        lFile.addFunction(lFunc);
        this.mActiveFunctionId = lFunc.id;
        this.mSelectedNodes.clear();
        this.scheduleHistorySnapshot();
        this.rebuildCachedData();
        this.renderConnections();
    }

    public onFunctionDelete(pEvent: ComponentEvent<string>): void {
        const lFuncId: string = pEvent.value;
        const lFile = this.mFile;
        if (!lFile) {
            return;
        }

        for (const lFunc of lFile.functions) {
            if (lFunc.id === lFuncId) {
                lFile.removeFunction(lFunc);
                break;
            }
        }

        if (this.mActiveFunctionId === lFuncId) {
            this.mActiveFunctionId = [...lFile.functions][0]?.id ?? '';
        }

        this.mSelectedNodes.clear();
        this.scheduleHistorySnapshot();
        this.rebuildCachedData();
        this.renderConnections();
        this.schedulePreviewUpdate();
    }

    // ── Properties Panel ─────────────────────────────────────────────────

    public onPropertiesChange(pEvent: ComponentEvent<PropertiesChangeData>): void {
        const lActiveFunc = this.activeFunction;
        if (!lActiveFunc) {
            return;
        }
        const lData = pEvent.value;

        if (lData.name !== undefined) {
            lActiveFunc.label = lData.name;
        }

        if (lData.inputs !== undefined) {
            const lExistingNames = new Set(lActiveFunc.inputs.map(p => p.name));
            const lNewNames = new Set(lData.inputs.map(p => p.name));
            for (const lPort of [...lActiveFunc.inputs]) {
                if (!lNewNames.has(lPort.name)) {
                    lActiveFunc.removeInput(lPort);
                }
            }
            for (const lPortData of lData.inputs) {
                if (!lExistingNames.has(lPortData.name)) {
                    lActiveFunc.addInput({ name: lPortData.name, dataType: lPortData.type });
                }
            }
        }

        if (lData.outputs !== undefined) {
            const lExistingNames = new Set(lActiveFunc.outputs.map(p => p.name));
            const lNewNames = new Set(lData.outputs.map(p => p.name));
            for (const lPort of [...lActiveFunc.outputs]) {
                if (!lNewNames.has(lPort.name)) {
                    lActiveFunc.removeOutput(lPort);
                }
            }
            for (const lPortData of lData.outputs) {
                if (!lExistingNames.has(lPortData.name)) {
                    lActiveFunc.addOutput({ name: lPortData.name, dataType: lPortData.type });
                }
            }
        }

        if (lData.imports !== undefined) {
            const lExistingImports = new Set(lActiveFunc.imports);
            const lNewImports = new Set(lData.imports);
            for (const lImport of [...lActiveFunc.imports]) {
                if (!lNewImports.has(lImport)) {
                    lActiveFunc.removeImport(lImport);
                }
            }
            for (const lImport of lData.imports) {
                if (!lExistingImports.has(lImport)) {
                    lActiveFunc.addImport(lImport);
                }
            }
        }

        this.scheduleHistorySnapshot();
        this.rebuildCachedData();
        this.renderConnections();
        this.schedulePreviewUpdate();
    }

    // ── Canvas Events ────────────────────────────────────────────────────

    public onCanvasPointerDown(pEvent: PointerEvent): void {
        const lInternals = this.mInternals;

        if (pEvent.button === 1) {
            pEvent.preventDefault();
            lInternals.interactionState = { mode: 'panning', startX: pEvent.clientX, startY: pEvent.clientY };
            (pEvent.currentTarget as HTMLElement).setPointerCapture(pEvent.pointerId);
            return;
        }

        if (pEvent.button === 0) {
            if (!pEvent.ctrlKey) {
                this.mSelectedNodes.clear();
                this.rebuildCachedData();
            }
            const lRect = this.canvasWrapper.getBoundingClientRect();
            const lX = pEvent.clientX - lRect.left;
            const lY = pEvent.clientY - lRect.top;
            lInternals.interactionState = { mode: 'selecting', startX: lX, startY: lY };
            this.mSelectionBoxScreen = { x1: lX, y1: lY, x2: lX, y2: lY };
            this.mShowSelectionBox = false;
            (pEvent.currentTarget as HTMLElement).setPointerCapture(pEvent.pointerId);
        }
    }

    public onCanvasPointerMove(pEvent: PointerEvent): void {
        const lInternals = this.mInternals;
        const lState = lInternals.interactionState;

        if (lState.mode === 'panning') {
            const lDx = pEvent.clientX - lState.startX;
            const lDy = pEvent.clientY - lState.startY;
            lInternals.interaction.pan(lDx, lDy);
            lState.startX = pEvent.clientX;
            lState.startY = pEvent.clientY;
            this.mTransformVersion++;
            this.renderConnections();
            return;
        }

        if (lState.mode === 'dragging-node') {
            const lActiveFunc = this.activeFunction;
            if (!lActiveFunc) {
                return;
            }
            const lZoom = lInternals.interaction.zoom;
            const lGS = lInternals.interaction.gridSize;
            const lDx = (pEvent.clientX - lState.startX) / lZoom;
            const lDy = (pEvent.clientY - lState.startY) / lZoom;

            for (const [lNode, lOrigin] of lState.origins) {
                const lSnapped = lInternals.interaction.snapToGrid(lOrigin.originX + lDx, lOrigin.originY + lDy);
                lNode.moveTo(Math.round(lSnapped.x / lGS), Math.round(lSnapped.y / lGS));
            }

            this.rebuildVisibleNodePositions();
            this.renderConnections();
            return;
        }

        if (lState.mode === 'dragging-wire') {
            const lRect = this.canvasWrapper.getBoundingClientRect();
            const lEndX = (pEvent.clientX - lRect.left - lInternals.interaction.panX) / lInternals.interaction.zoom;
            const lEndY = (pEvent.clientY - lRect.top - lInternals.interaction.panY) / lInternals.interaction.zoom;
            lInternals.renderer.renderTempConnection(
                this.svgLayer,
                { x: lState.startX, y: lState.startY },
                { x: lEndX, y: lEndY },
                '#bac2de'
            );
            return;
        }

        if (lState.mode === 'selecting') {
            const lRect = this.canvasWrapper.getBoundingClientRect();
            this.mSelectionBoxScreen.x2 = pEvent.clientX - lRect.left;
            this.mSelectionBoxScreen.y2 = pEvent.clientY - lRect.top;
            const lDx = Math.abs(this.mSelectionBoxScreen.x2 - this.mSelectionBoxScreen.x1);
            const lDy = Math.abs(this.mSelectionBoxScreen.y2 - this.mSelectionBoxScreen.y1);
            if (lDx > 5 || lDy > 5) {
                this.mShowSelectionBox = true;
            }
            return;
        }

        if (lState.mode === 'resizing-comment') {
            const lGS = lInternals.interaction.gridSize;
            const lDx = (pEvent.clientX - lState.startX) / lInternals.interaction.zoom;
            const lDy = (pEvent.clientY - lState.startY) / lInternals.interaction.zoom;
            const lNewW = lState.originalW + Math.round(lDx / lGS);
            const lNewH = lState.originalH + Math.round(lDy / lGS);
            lState.node.resizeTo(lNewW, lNewH);
            this.rebuildVisibleNodePositions();
            return;
        }
    }

    public onCanvasPointerUp(pEvent: PointerEvent): void {
        const lInternals = this.mInternals;

        if (lInternals.interactionState.mode === 'dragging-node') {
            this.scheduleHistorySnapshot();
            this.rebuildCachedData();
            this.renderConnections();
            this.schedulePreviewUpdate();
        }

        if (lInternals.interactionState.mode === 'dragging-wire') {
            lInternals.renderer.clearTempConnection(this.svgLayer);

            const lSource = lInternals.interactionState.sourcePort;
            const lTarget = lInternals.hoveredPort?.port ?? null;

            if (lSource && lTarget && lSource !== lTarget) {
                // Validate: opposite directions, same port type.
                if (lSource.direction !== lTarget.direction && lSource.portType === lTarget.portType) {
                    try {
                        lSource.connect(lTarget);
                        this.mConnectionVersion++;
                        this.scheduleHistorySnapshot();
                        this.rebuildCachedData();
                        this.renderConnections();
                        this.schedulePreviewUpdate();
                    } catch (pError) {
                        console.error('[Editor] Connection failed:', pError);
                    }
                }
            }
        }

        if (lInternals.interactionState.mode === 'selecting') {
            this.mShowSelectionBox = false;
            this.selectNodesInBox();
        }

        if (lInternals.interactionState.mode === 'resizing-comment') {
            this.scheduleHistorySnapshot();
            this.rebuildCachedData();
        }

        lInternals.interactionState = { mode: 'idle' };
        (pEvent.currentTarget as HTMLElement).releasePointerCapture(pEvent.pointerId);
    }

    public onCanvasWheel(pEvent: WheelEvent): void {
        pEvent.preventDefault();
        const lRect = this.canvasWrapper.getBoundingClientRect();
        this.mInternals.interaction.zoomAt(
            pEvent.clientX - lRect.left,
            pEvent.clientY - lRect.top,
            pEvent.deltaY > 0 ? -0.1 : 0.1
        );
        this.mTransformVersion++;
        this.renderConnections();
    }

    public onContextMenu(pEvent: Event): void {
        pEvent.preventDefault();
        const lTarget = pEvent.target as Element;
        if (lTarget.hasAttribute?.('data-hit-area')) {
            const lConnectionId = lTarget.getAttribute('data-connection-id');
            if (lConnectionId) {
                const lConn = this.mConnectionRegistry.get(lConnectionId);
                if (lConn) {
                    lConn.sourcePort.disconnect(lConn.targetPort);
                    this.mConnectionVersion++;
                    this.scheduleHistorySnapshot();
                    this.rebuildCachedData();
                    this.renderConnections();
                    this.schedulePreviewUpdate();
                }
            }
        }
    }

    // ── Node Events ──────────────────────────────────────────────────────

    public onNodePointerDown(pEvent: PointerEvent, pNode: PotatnoDocumentNode<TProject>): void {
        // Skip if a port element is in the composed path.
        for (const lEl of pEvent.composedPath()) {
            if ((lEl as HTMLElement).tagName?.toLowerCase() === 'potatno-port') {
                return;
            }
        }
        pEvent.stopPropagation();
        if (pEvent.button !== 0) {
            return;
        }

        // Selection.
        if (pEvent.ctrlKey) {
            if (this.mSelectedNodes.has(pNode)) {
                this.mSelectedNodes.delete(pNode);
            } else {
                this.mSelectedNodes.add(pNode);
            }
        } else {
            if (!this.mSelectedNodes.has(pNode)) {
                this.mSelectedNodes.clear();
                this.mSelectedNodes.add(pNode);
            }
        }
        this.rebuildCachedData();

        // Build origins for all selected nodes.
        const lGS = this.mInternals.interaction.gridSize;
        const lOrigins = new Map<PotatnoDocumentNode<TProject>, { originX: number; originY: number; }>();

        for (const lNode of this.mSelectedNodes) {
            lOrigins.set(lNode, {
                originX: lNode.transformation.x * lGS,
                originY: lNode.transformation.y * lGS
            });
        }

        // If dragging a comment, also include non-comment nodes inside its bounds.
        if (pNode.category === NodeCategory.Comment) {
            const lActiveFunc = this.activeFunction;
            if (lActiveFunc) {
                const lCL = pNode.transformation.x * lGS;
                const lCT = pNode.transformation.y * lGS;
                const lCR = lCL + pNode.transformation.width * lGS;
                const lCB = lCT + pNode.transformation.height * lGS;

                for (const lOther of lActiveFunc.nodes) {
                    if (lOther === pNode || this.mSelectedNodes.has(lOther)) {
                        continue;
                    }
                    if (lOther.category === NodeCategory.Comment) {
                        continue;
                    }
                    const lNx = lOther.transformation.x * lGS;
                    const lNy = lOther.transformation.y * lGS;
                    if (lNx >= lCL && lNx <= lCR && lNy >= lCT && lNy <= lCB) {
                        lOrigins.set(lOther, { originX: lNx, originY: lNy });
                    }
                }
            }
        }

        this.mInternals.interactionState = {
            mode: 'dragging-node',
            draggedNode: pNode,
            startX: pEvent.clientX,
            startY: pEvent.clientY,
            origins: lOrigins
        };
        this.canvasWrapper.setPointerCapture(pEvent.pointerId);
    }

    public onPortDragStart(pEvent: ComponentEvent<PortInteractionDetail>): void {
        const lData = pEvent.value;
        const lRect = this.canvasWrapper.getBoundingClientRect();
        const lCircleRect = lData.element.getBoundingClientRect();
        const lStartX = (lCircleRect.left + lCircleRect.width / 2 - lRect.left - this.mInternals.interaction.panX) / this.mInternals.interaction.zoom;
        const lStartY = (lCircleRect.top + lCircleRect.height / 2 - lRect.top - this.mInternals.interaction.panY) / this.mInternals.interaction.zoom;

        this.mInternals.interactionState = {
            mode: 'dragging-wire',
            sourcePort: lData.port,
            startX: lStartX,
            startY: lStartY
        };
    }

    public onPortHover(pEvent: ComponentEvent<PortInteractionDetail>): void {
        this.mInternals.hoveredPort = { node: pEvent.value.node, port: pEvent.value.port };
    }

    public onPortLeave(): void {
        this.mInternals.hoveredPort = null;
    }

    public onNodeResizeStart(pEvent: ComponentEvent<ResizeStartDetail>): void {
        const lData = pEvent.value;
        const lGS = this.mInternals.interaction.gridSize;
        this.mInternals.interactionState = {
            mode: 'resizing-comment',
            node: lData.node,
            startX: lData.startX,
            startY: lData.startY,
            originalW: lData.node.transformation.width,
            originalH: lData.node.transformation.height
        };
        this.canvasWrapper.setPointerCapture(lGS);
    }

    public onCommentChange(pEvent: ComponentEvent<CommentChangeDetail>): void {
        // Node label was already updated by the node component. Just take snapshot.
        void pEvent;
        this.scheduleHistorySnapshot();
    }

    public onDirectValueChange(pEvent: ComponentEvent<DirectValueChangeDetail>): void {
        void pEvent;
        this.scheduleHistorySnapshot();
        this.schedulePreviewUpdate();
    }

    public onOpenFunction(pEvent: ComponentEvent<OpenFunctionDetail>): void {
        const lDefinitionId = pEvent.value.node.definitionId;
        const lFunctionId = lDefinitionId.startsWith('USERFUNCTION_') ? lDefinitionId.slice('USERFUNCTION_'.length) : lDefinitionId;
        if (!this.mFile) {
            return;
        }
        for (const lFunc of this.mFile.functions) {
            if (lFunc.id === lFunctionId) {
                this.mActiveFunctionId = lFunctionId;
                this.mSelectedNodes.clear();
                this.rebuildCachedData();
                this.renderConnections();
                return;
            }
        }
    }

    // ── Panel Resize ──────────────────────────────────────────────────────

    public onResizeLeftStart(pEvent: PointerEvent): void {
        pEvent.preventDefault();
        this.startPanelResize('left', pEvent);
    }

    public onResizeRightStart(pEvent: PointerEvent): void {
        pEvent.preventDefault();
        this.startPanelResize('right', pEvent);
    }

    // ── Keyboard ─────────────────────────────────────────────────────────

    private onKeyDown(pEvent: KeyboardEvent): void {
        if (pEvent.key === 'Delete') {
            this.deleteSelectedNodes();
            return;
        }

        if (pEvent.ctrlKey && pEvent.key === 'z') {
            pEvent.preventDefault();
            const lSnapshot = this.mInternals.history.undo();
            if (lSnapshot) {
                this.restoreSnapshot(lSnapshot);
            }
            return;
        }

        if (pEvent.ctrlKey && (pEvent.key === 'y' || (pEvent.shiftKey && pEvent.key === 'z'))) {
            pEvent.preventDefault();
            const lSnapshot = this.mInternals.history.redo();
            if (lSnapshot) {
                this.restoreSnapshot(lSnapshot);
            }
            return;
        }

        if (pEvent.ctrlKey && pEvent.key === 'c') {
            this.mInternals.clipboard.copy(this.mSelectedNodes);
            return;
        }

        if (pEvent.ctrlKey && pEvent.key === 'v') {
            this.pasteFromClipboard();
            return;
        }
    }

    // ── Private helpers ───────────────────────────────────────────────────

    private initializeMainFunctions(pFile: PotatnoDocument<TProject>, pProject: TProject): void {
        const lEntryPoint = pProject.entryPoint;
        if (!lEntryPoint) {
            return;
        }

        const lFunc = new PDocumentFunction(pProject as TProject, lEntryPoint.id, crypto.randomUUID(), 'Main', true);

        lEntryPoint.prefilledNodes.forEach((lStaticDef, lIdx) => {
            lFunc.newNode(lStaticDef, { x: 2 + lIdx * 12, y: 2, width: 10, height: 4 }, true);
            if (!pProject.nodeDefinitions.has(lStaticDef.id)) {
                pProject.addNodeDefinition(lStaticDef);
            }
        });

        for (const lDynamicDef of lEntryPoint.nodes) {
            if (!pProject.nodeDefinitions.has(lDynamicDef.id)) {
                pProject.addNodeDefinition(lDynamicDef);
            }
        }

        if ((lEntryPoint.statics & PotatnoFunctionDefinitionStatics.imports) !== 0) {
            for (const lImport of pProject.imports) {
                lFunc.addImport(lImport.label);
            }
        }

        pFile.addFunction(lFunc);
    }

    private deleteSelectedNodes(): void {
        const lActiveFunc = this.activeFunction;
        if (!lActiveFunc) {
            return;
        }

        let lDeleted = false;
        for (const lNode of [...this.mSelectedNodes]) {
            if (!lNode.isSystem) {
                lActiveFunc.removeNode(lNode);
                this.mSelectedNodes.delete(lNode);
                lDeleted = true;
            }
        }

        if (lDeleted) {
            this.scheduleHistorySnapshot();
            this.rebuildCachedData();
            this.renderConnections();
            this.schedulePreviewUpdate();
        }
    }

    private pasteFromClipboard(): void {
        const lActiveFunc = this.activeFunction;
        const lFile = this.mFile;
        if (!lActiveFunc || !lFile) {
            return;
        }

        const lNewNodes = this.mInternals.clipboard.paste(lActiveFunc, lFile, 2, 2);
        if (lNewNodes.length > 0) {
            this.mSelectedNodes.clear();
            for (const lNode of lNewNodes) {
                this.mSelectedNodes.add(lNode);
            }
            this.scheduleHistorySnapshot();
            this.rebuildCachedData();
            this.renderConnections();
            this.schedulePreviewUpdate();
        }
    }

    private selectNodesInBox(): void {
        const lActiveFunc = this.activeFunction;
        if (!lActiveFunc) {
            return;
        }

        const lInternals = this.mInternals;
        const lTopLeft = lInternals.interaction.screenToWorld(
            Math.min(this.mSelectionBoxScreen.x1, this.mSelectionBoxScreen.x2),
            Math.min(this.mSelectionBoxScreen.y1, this.mSelectionBoxScreen.y2)
        );
        const lBottomRight = lInternals.interaction.screenToWorld(
            Math.max(this.mSelectionBoxScreen.x1, this.mSelectionBoxScreen.x2),
            Math.max(this.mSelectionBoxScreen.y1, this.mSelectionBoxScreen.y2)
        );
        const lGS = lInternals.interaction.gridSize;

        for (const lNode of lActiveFunc.nodes) {
            const lNx = lNode.transformation.x * lGS;
            const lNy = lNode.transformation.y * lGS;
            const lNr = lNx + lNode.transformation.width * lGS;
            const lNb = lNy + lNode.transformation.height * lGS;
            if (lNx < lBottomRight.x && lNr > lTopLeft.x && lNy < lBottomRight.y && lNb > lTopLeft.y) {
                this.mSelectedNodes.add(lNode);
            }
        }
        this.rebuildCachedData();
    }

    private renderConnections(): void {
        if (!this.svgLayer) {
            return;
        }

        const lActiveFunc = this.activeFunction;
        if (!lActiveFunc) {
            this.mInternals.renderer.clearAll(this.svgLayer);
            this.mConnectionRegistry.clear();
            return;
        }

        this.mConnectionRegistry.clear();
        const lConnectionData = [];
        let lConnIdx = 0;

        for (const lNode of lActiveFunc.nodes) {
            for (const lOutputPort of lNode.outputs.values()) {
                for (const lConnectedPort of lOutputPort.connectedPorts) {
                    const lId = `c${lConnIdx++}`;
                    this.mConnectionRegistry.set(lId, { sourcePort: lOutputPort, targetPort: lConnectedPort });

                    const lSourcePos = this.getPortPosition(lOutputPort);
                    const lTargetPos = this.getPortPosition(lConnectedPort);

                    lConnectionData.push({
                        id: lId,
                        sourceX: lSourcePos.x,
                        sourceY: lSourcePos.y,
                        targetX: lTargetPos.x,
                        targetY: lTargetPos.y,
                        color: 'var(--pn-text-secondary)',
                        valid: true
                    });
                }
            }
        }

        this.mInternals.renderer.renderConnections(this.svgLayer, lConnectionData);
    }

    private getPortPosition(pPort: PotatnoDocumentPort<TProject>): { x: number; y: number; } {
        const lNode = pPort.node;
        const lGS = this.mInternals.interaction.gridSize;
        const lNodeX = lNode.transformation.x * lGS;
        const lNodeY = lNode.transformation.y * lGS;
        const lNodeW = lNode.transformation.width * lGS;
        const lHeaderH = 28;
        const lPortGap = 24;
        const lBodyPad = 4;

        if (pPort.portType === 'flow') {
            const lX = pPort.direction === 'output' ? lNodeX + lNodeW : lNodeX;
            return { x: lX, y: lNodeY + lHeaderH / 2 };
        }

        // Value port: find index among value ports of same direction.
        const lPortMap = pPort.direction === 'output' ? lNode.outputs : lNode.inputs;
        let lIdx = 0;
        let lCount = 0;
        for (const lP of lPortMap.values()) {
            if (lP.portType === 'value') {
                if (lP === pPort) {
                    lIdx = lCount;
                    break;
                }
                lCount++;
            }
        }

        const lX = pPort.direction === 'output' ? lNodeX + lNodeW : lNodeX;
        return { x: lX, y: lNodeY + lHeaderH + lBodyPad + (lIdx + 0.5) * lPortGap };
    }

    private scheduleHistorySnapshot(): void {
        clearTimeout(this.mHistoryDebounceTimer);
        this.mHistoryDebounceTimer = setTimeout(() => {
            this.pushHistorySnapshot();
        }, 500) as unknown as number;
    }

    private pushHistorySnapshot(): void {
        if (!this.mFile) {
            return;
        }
        const lSerializer = new PotatnoSerializer<TProject>();
        const lSnapshot = lSerializer.serialize(this.mFile);
        this.mInternals.history.push(lSnapshot);
    }

    private restoreSnapshot(pSnapshot: PotatnoCodeFileSerializationResult): void {
        if (!this.mProject) {
            return;
        }
        const lDeserializer = new PotatnoDeserializer(this.mProject);
        this.mFile = lDeserializer.deserialize(pSnapshot);

        // Try to keep the same active function by ID; fall back to first.
        const lFound = [...this.mFile.functions].find(f => f.id === this.mActiveFunctionId);
        if (!lFound) {
            this.mActiveFunctionId = [...this.mFile.functions][0]?.id ?? '';
        }

        this.mSelectedNodes.clear();
        this.mInternals.previewElements.clear();
        this.rebuildCachedData();
        this.renderConnections();
        this.schedulePreviewUpdate();
    }

    private schedulePreviewUpdate(): void {
        this.mInternals.previewDirty = true;
        clearTimeout(this.mPreviewDebounceTimer);
        this.mPreviewDebounceTimer = setTimeout(() => this.evaluatePreview(), 300) as unknown as number;
    }

    private evaluatePreview(): void {
        const lProject = this.mProject;
        const lFile = this.mFile;
        const lInternals = this.mInternals;

        console.log('[Preview] evaluatePreview called', { hasProject: !!lProject, hasFile: !!lFile, dirty: lInternals.previewDirty });

        if (!lProject || !lFile || !lInternals.previewDirty) {
            console.log('[Preview] early return - missing project/file or not dirty');
            return;
        }
        lInternals.previewDirty = false;

        // Find the system function (entry point).
        let lEntryFunc: PotatnoDocumentFunction<TProject> | undefined;
        for (const lFunc of lFile.functions) {
            if (lFunc.isSystem) {
                lEntryFunc = lFunc;
                break;
            }
        }
        if (!lEntryFunc) {
            console.log('[Preview] no system (entry) function found');
            return;
        }

        // Collect preview nodes.
        const lPreviewNodes = new Set<PotatnoDocumentNode<TProject>>();
        for (const lNode of lEntryFunc.nodes) {
            if (lProject.nodeDefinitions.get(lNode.definitionId)?.preview) {
                lPreviewNodes.add(lNode);
            }
        }

        // Generate preview elements for nodes that need them.
        for (const lNode of lPreviewNodes) {
            if (!lInternals.previewElements.has(lNode)) {
                const lDef = lProject.nodeDefinitions.get(lNode.definitionId);
                if (lDef?.preview) {
                    const lEl = lDef.preview.generate();
                    if (lEl instanceof HTMLElement) {
                        lInternals.previewElements.set(lNode, lEl);
                    }
                }
            }
        }

        // Create the entry-point preview element early and hand it to the preview
        // component so it is always attached — even when code generation fails.
        const lEntryPreview = lProject.entryPoint.preview;
        console.log('[Preview] entryPoint.preview:', lEntryPreview);
        if (lEntryPreview) {
            if (!lInternals.entryPointPreviewElement) {
                lInternals.entryPointPreviewElement = lEntryPreview.generate();
                console.log('[Preview] generated entry preview element:', lInternals.entryPointPreviewElement);
                // Publish to template so the [previewContent] binding fires (null → element).
                this.mEntryPointPreviewElement = lInternals.entryPointPreviewElement;
                console.log('[Preview] mEntryPointPreviewElement set');
            }
        }

        // Generate code with intermediates.
        let lCodeResult: FunctionCodeWithIntermediates;
        try {
            const lGenerator = new PotatnoCodeGenerator<TProject>(lProject);
            lCodeResult = lGenerator.generateFunctionCodeWithIntermediates(lEntryFunc, lPreviewNodes);
        } catch (pError) {
            console.error('[Preview] Code generation failed:', pError);
            return;
        }

        lInternals.cachedCodeResult = lCodeResult;

        // Refresh all preview visuals from the new code result.
        this.updateNodePreviewsFromCache();
    }

    /**
     * Refresh all preview visuals using the cached code result.
     * Safe to call every frame — never regenerates code.
     */
    private updateNodePreviewsFromCache(): void {
        const lProject = this.mProject;
        const lInternals = this.mInternals;
        const lCodeResult = lInternals.cachedCodeResult;

        if (!lProject || !lCodeResult) {
            return;
        }

        // Update entry point preview.
        const lEntryPreview = lProject.entryPoint.preview;
        if (lEntryPreview && lInternals.entryPointPreviewElement) {
            try {
                lEntryPreview.update(
                    lInternals.entryPointPreviewElement as any,
                    lCodeResult.codeFunction,
                    {},
                    lCodeResult.fullCode
                );
            } catch (pError) {
                console.error('[Preview] updatePreview (entry point) failed:', pError);
            }
        }

        // Update per-node previews.
        for (const [lNode, lIntermediateData] of lCodeResult.nodeIntermediates) {
            const lElement = lInternals.previewElements.get(lNode);
            if (!lElement) {
                continue;
            }
            const lDef = lProject.nodeDefinitions.get(lNode.definitionId);
            if (lDef?.preview) {
                try {
                    lDef.preview.update(
                        lElement as any,
                        lIntermediateData.context,
                        lIntermediateData.codeFunction,
                        {},
                        lIntermediateData.intermediateCode
                    );
                } catch (pError) {
                    console.error('[Preview] updatePreview (node) failed:', pError);
                }
            }
        }
    }

    private startPanelResize(pPanel: 'left' | 'right', pEvent: PointerEvent): void {
        const lPanelEl = pPanel === 'left' ? this.panelLeft : this.panelRight;
        this.mResizeState = { panel: pPanel, startX: pEvent.clientX, startWidth: lPanelEl.offsetWidth };

        this.mResizeMoveHandler = (e: PointerEvent) => {
            if (!this.mResizeState) {
                return;
            }
            const lDelta = pPanel === 'left'
                ? e.clientX - this.mResizeState.startX
                : this.mResizeState.startX - e.clientX;
            lPanelEl.style.width = `${Math.max(200, Math.min(500, this.mResizeState.startWidth + lDelta))}px`;
        };

        this.mResizeUpHandler = () => {
            document.removeEventListener('pointermove', this.mResizeMoveHandler!);
            document.removeEventListener('pointerup', this.mResizeUpHandler!);
            this.mResizeState = null;
        };

        document.addEventListener('pointermove', this.mResizeMoveHandler);
        document.addEventListener('pointerup', this.mResizeUpHandler);
    }

    private rebuildCachedData(): void {
        const lProject = this.mProject;
        const lFile = this.mFile;
        const lActiveFunc = this.activeFunction;
        const lCached = this.createEmptyCachedData();

        lCached.activeFunctionId = this.mActiveFunctionId;
        lCached.hasPreview = !!lProject?.entryPoint.preview;

        // Validate.
        if (lFile) {
            for (const lError of lFile.validate()) {
                lCached.errors.push({ message: lError.message, location: `Node "${lError.port.node.name}"` });
            }
        }

        // Node definition list.
        if (lProject) {
            for (const lDef of lProject.nodeDefinitions.values()) {
                lCached.nodeDefinitionList.push({ id: lDef.id, name: lDef.label, category: lDef.category });
            }
        }
        if (lFile) {
            for (const lDef of lFile.nodeDefinitions.values()) {
                lCached.nodeDefinitionList.push({ id: lDef.id, name: lDef.label, category: lDef.category });
            }
        }
        // Add import-scoped nodes based on active function imports.
        if (lProject && lActiveFunc) {
            const lEnabledImports = new Set(lActiveFunc.imports);
            for (const lImport of lProject.imports) {
                if (lEnabledImports.has(lImport.label)) {
                    for (const lNodeDef of lImport.nodes) {
                        lCached.nodeDefinitionList.push({ id: lNodeDef.id, name: lNodeDef.label, category: lNodeDef.category });
                    }
                }
            }
        }

        // Function list.
        if (lFile) {
            for (const lFunc of lFile.functions) {
                lCached.functionList.push({ id: lFunc.id, name: lFunc.label, label: lFunc.label, system: lFunc.isSystem });
            }
        }

        // Available imports.
        lCached.availableImports = lProject?.imports.map(i => i.label) ?? [];

        // Available types.
        if (lProject) {
            const lTypeSet = new Set<string>();
            for (const [lTypeName] of lProject.types.types) {
                lTypeSet.add(lTypeName);
            }
            lCached.availableTypes = [...lTypeSet].sort();
        }

        // Active function data.
        if (lActiveFunc) {
            lCached.activeFunctionName = lActiveFunc.label;
            lCached.activeFunctionIsSystem = lActiveFunc.isSystem;
            lCached.activeFunctionEditableByUser = !lActiveFunc.isSystem;
            lCached.activeFunctionInputs = lActiveFunc.inputs.map(p => ({ name: p.name, type: p.dataType }));
            lCached.activeFunctionOutputs = lActiveFunc.outputs.map(p => ({ name: p.name, type: p.dataType }));
            lCached.activeFunctionImports = [...lActiveFunc.imports];

            // Visible nodes.
            const lGS = this.mInternals.interaction.gridSize;
            for (const lNode of lActiveFunc.nodes) {
                // Create or reuse preview element.
                if (lProject) {
                    const lDef = lProject.nodeDefinitions.get(lNode.definitionId);
                    if (lDef?.preview && !this.mInternals.previewElements.has(lNode)) {
                        const lEl = lDef.preview.generate();
                        if (lEl instanceof HTMLElement) {
                            this.mInternals.previewElements.set(lNode, lEl);
                        }
                    }
                }

                lCached.visibleNodes.push({
                    node: lNode,
                    selected: this.mSelectedNodes.has(lNode),
                    pixelX: lNode.transformation.x * lGS,
                    pixelY: lNode.transformation.y * lGS,
                    pixelW: lNode.transformation.width * lGS,
                    connectionVersion: this.mConnectionVersion
                });
            }
        }

        this.mCachedData = lCached;
    }

    private rebuildVisibleNodePositions(): void {
        const lGS = this.mInternals.interaction.gridSize;
        for (const lState of this.mCachedData.visibleNodes) {
            lState.pixelX = lState.node.transformation.x * lGS;
            lState.pixelY = lState.node.transformation.y * lGS;
            lState.pixelW = lState.node.transformation.width * lGS;
        }
        // Trigger re-render by reassigning state.
        this.mCachedData = this.mCachedData;
    }

    private createEmptyCachedData(): CachedViewData {
        return {
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
    }
}

// ── Types ─────────────────────────────────────────────────────────────────

export type NodeViewState = {
    node: PotatnoDocumentNode<any>;
    selected: boolean;
    pixelX: number;
    pixelY: number;
    pixelW: number;
    connectionVersion: number;
};

type InteractionState =
    | { mode: 'idle'; }
    | { mode: 'panning'; startX: number; startY: number; }
    | { mode: 'dragging-node'; draggedNode: PotatnoDocumentNode<any>; startX: number; startY: number; origins: Map<PotatnoDocumentNode<any>, { originX: number; originY: number; }>; }
    | { mode: 'dragging-wire'; sourcePort: PotatnoDocumentPort<any>; startX: number; startY: number; }
    | { mode: 'selecting'; startX: number; startY: number; }
    | { mode: 'resizing-comment'; node: PotatnoDocumentNode<any>; startX: number; startY: number; originalW: number; originalH: number; };

interface CachedViewData {
    activeFunctionId: string;
    activeFunctionName: string;
    activeFunctionIsSystem: boolean;
    activeFunctionEditableByUser: boolean;
    errors: Array<{ message: string; location: string; }>;
    hasPreview: boolean;
    nodeDefinitionList: Array<{ id: string; name: string; category: string; }>;
    functionList: Array<{ id: string; name: string; label: string; system: boolean; }>;
    availableImports: Array<string>;
    availableTypes: Array<string>;
    activeFunctionInputs: Array<{ name: string; type: string; }>;
    activeFunctionOutputs: Array<{ name: string; type: string; }>;
    activeFunctionImports: Array<string>;
    visibleNodes: Array<NodeViewState>;
}

interface EditorInternals<TProject extends PotatnoProject<any>> {
    history: PotatnoHistory;
    clipboard: PotatnoClipboard<TProject>;
    interaction: PotatnoCanvasInteraction;
    renderer: PotatnoCanvasRenderer;
    hoveredPort: { node: PotatnoDocumentNode<any>; port: PotatnoDocumentPort<any>; } | null;
    interactionState: InteractionState;
    previewElements: Map<PotatnoDocumentNode<any>, HTMLElement>;
    entryPointPreviewElement: Element | null;
    previewDirty: boolean;
    cachedCodeResult: FunctionCodeWithIntermediates | null;
}

type PropertiesChangeData = {
    name?: string;
    inputs?: Array<{ name: string; type: string; }>;
    outputs?: Array<{ name: string; type: string; }>;
    imports?: Array<string>;
};

export type NodePreviewData = {
    readonly inputs: Record<string, unknown>;
    readonly outputs: Record<string, unknown>;
};
