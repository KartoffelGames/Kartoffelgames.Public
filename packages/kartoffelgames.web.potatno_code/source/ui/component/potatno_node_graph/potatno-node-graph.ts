import { ComponentEventEmitter, ComponentState, PwbChild, PwbComponent, PwbComponentEvent, PwbExport, type ComponentEvent, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { NodeCategory } from '../../../parser/node/node-category.enum.ts';
import type { PotatnoCodeGeneratorFunctionResult } from '../../../parser/potatno-code-generator-function-result.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import { PotatnoCanvasInteraction } from '../../potatno-canvas-interaction.ts';
import { PotatnoCanvasRenderer, type ConnectionRenderData } from '../../potatno-canvas-renderer.ts';
import { PotatnoClipboard } from '../../potatno-clipboard.ts';
import { PotatnoNodeLibraryDragBus, type PotatnoNodeLibraryDragStartDetail, type PotatnoNodeLibraryInsertDetail } from '../../potatno-node-library-drag.ts';
import { buildAvailableNodeDefinitionEntries, type PotatnoNodeDefinitionListEntry, type PotatnoUiProject } from '../../potatno-node-definition-list.ts';
import type { CommentChangeDetail, DirectValueChangeDetail, OpenFunctionDetail, ResizeStartDetail } from '../potatno_node_component/potatno-node-component.ts';
import type { PortInteractionDetail } from '../potatno_port/potatno-port.ts';
import graphCss from './potatno-node-graph.css' with { type: 'text' };
import graphTemplate from './potatno-node-graph.html' with { type: 'text' };

// Import child components to ensure they are registered.
import '../potatno_node_component/potatno-node-component.ts';
import '../potatno_port/potatno-port.ts';

/**
 * Interactive node graph for the active Potatno document function.
 */
@PwbComponent({
    selector: 'potatno-node-graph',
    template: graphTemplate,
    style: graphCss,
})
export class PotatnoNodeGraph<TProject extends PotatnoUiProject> implements IComponentOnConnect, IComponentOnDeconstruct {
    private readonly mClipboard: PotatnoClipboard<TProject>;
    private readonly mConnectionRegistry: Map<string, ConnectionRecord<TProject>>;
    private readonly mInteraction: PotatnoCanvasInteraction;
    private readonly mPortElementRegistry: Map<PotatnoDocumentPort<TProject>, HTMLElement>;
    private readonly mPreviewElements: Map<object, HTMLElement>;
    private readonly mRenderer: PotatnoCanvasRenderer;
    private readonly mSelectedNodes: Set<PotatnoDocumentNode<TProject>>;
    private mActiveFunction: PotatnoDocumentFunction<TProject> | null;
    private mErrorNodes: ReadonlySet<PotatnoDocumentNode<TProject>>;
    private mErrorPorts: ReadonlySet<PotatnoDocumentPort<TProject>>;
    private mAddNodeSearchQuery: string;
    private mAddNodeSelectedDefinitionId: string | null;
    private mConnectionVersion: number;
    private mDocumentPointerMoveHandler: ((pEvent: PointerEvent) => void) | null;
    private mDocumentPointerUpHandler: ((pEvent: PointerEvent) => void) | null;
    private mHoveredPort: PortHoverRecord<TProject> | null;
    private mInteractionState: GraphInteractionState<TProject>;
    private mKeyboardHandler: ((pEvent: KeyboardEvent) => void) | null;
    private mLibraryDragUnsubscribe: (() => void) | null;
    private mLibraryInsertUnsubscribe: (() => void) | null;
    private mPendingConnectionRenderFrame: number;
    private mPreviewResult: PotatnoCodeGeneratorFunctionResult<TProject> | null;
    private mPreviewUpdateVersion: number;
    private mRefreshVersion: number;
    private mSelectionBoxScreen: SelectionBoxScreen;

    /**
     * Cached node data rendered by the graph template.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mCachedGraphData: GraphViewData<TProject>;

    /**
     * Version token that refreshes transform-bound template styles.
     */
    @ComponentState.state()
    private accessor mTransformVersion: number = 0;

    /**
     * Whether the drag selection box should be visible.
     */
    @ComponentState.state()
    private accessor mShowSelectionBox: boolean = false;

    /**
     * State for the add-node popup opened from the graph context menu.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mAddNodePopup: AddNodePopupState | null = null;

    /**
     * Filtered add-node popup entries.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mFilteredAddNodeEntries: Array<NodeDefinitionEntry<TProject>> = [];

    /**
     * Visible indicator for a node dragged out of the left library.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mLibraryDragIndicator: LibraryDragIndicatorState | null = null;

    /**
     * SVG element that hosts graph connections.
     */
    @PwbChild('svgLayer')
    public accessor svgLayer!: SVGSVGElement;

    /**
     * Root graph wrapper used for pointer coordinate calculations.
     */
    @PwbChild('canvasWrapper')
    public accessor canvasWrapper!: HTMLElement;

    /**
     * Event emitted after a graph mutation changes the document.
     */
    @PwbComponentEvent('graph-change')
    private accessor mGraphChange!: ComponentEventEmitter<GraphChangeDetail>;

    /**
     * Event emitted when the graph requests opening a user function.
     */
    @PwbComponentEvent('open-function')
    private accessor mOpenFunction!: ComponentEventEmitter<OpenFunctionRequestDetail>;

    /**
     * Event emitted when the graph requests an undo operation.
     */
    @PwbComponentEvent('undo-request')
    private accessor mUndoRequest!: ComponentEventEmitter<void>;

    /**
     * Event emitted when the graph requests a redo operation.
     */
    @PwbComponentEvent('redo-request')
    private accessor mRedoRequest!: ComponentEventEmitter<void>;

    /**
     * Create the graph component and its local interaction state.
     */
    public constructor() {
        this.mActiveFunction = null;
        this.mAddNodeSearchQuery = '';
        this.mAddNodeSelectedDefinitionId = null;
        this.mCachedGraphData = { visibleNodes: [] };
        this.mClipboard = new PotatnoClipboard<TProject>();
        this.mConnectionRegistry = new Map<string, ConnectionRecord<TProject>>();
        this.mConnectionVersion = 0;
        this.mDocumentPointerMoveHandler = null;
        this.mDocumentPointerUpHandler = null;
        this.mErrorNodes = new Set<PotatnoDocumentNode<TProject>>();
        this.mErrorPorts = new Set<PotatnoDocumentPort<TProject>>();
        this.mHoveredPort = null;
        this.mInteraction = new PotatnoCanvasInteraction(20);
        this.mInteractionState = { mode: 'idle' };
        this.mKeyboardHandler = null;
        this.mLibraryDragUnsubscribe = null;
        this.mLibraryInsertUnsubscribe = null;
        this.mPendingConnectionRenderFrame = 0;
        this.mPortElementRegistry = new Map<PotatnoDocumentPort<TProject>, HTMLElement>();
        this.mPreviewElements = new Map<object, HTMLElement>();
        this.mPreviewResult = null;
        this.mPreviewUpdateVersion = 0;
        this.mRefreshVersion = 0;
        this.mRenderer = new PotatnoCanvasRenderer();
        this.mSelectedNodes = new Set<PotatnoDocumentNode<TProject>>();
        this.mSelectionBoxScreen = { x1: 0, x2: 0, y1: 0, y2: 0 };
    }

    /**
     * Active document function whose graph should be rendered and mutated.
     */
    @PwbExport
    public set activeFunction(pValue: PotatnoDocumentFunction<TProject> | null) {
        if (this.mActiveFunction === pValue) {
            return;
        }

        this.mActiveFunction = pValue;
        this.mErrorNodes = new Set<PotatnoDocumentNode<TProject>>();
        this.mErrorPorts = new Set<PotatnoDocumentPort<TProject>>();
        this.mHoveredPort = null;
        this.mInteractionState = { mode: 'idle' };
        this.mLibraryDragIndicator = null;
        this.mPortElementRegistry.clear();
        this.mPreviewElements.clear();
        this.mSelectedNodes.clear();
        this.stopDocumentPointerTracking();
        this.closeAddNodePopup();
        const lSvg: SVGSVGElement | null = this.getSvgLayerOrNull();
        if (lSvg) {
            this.mRenderer.clearAll(lSvg);
        }
        this.invalidateGraphContent();
        this.updatePreviewElementsFromResult();
    }

    /**
     * Get the active document function rendered by the graph.
     */
    public get activeFunction(): PotatnoDocumentFunction<TProject> | null {
        return this.mActiveFunction;
    }

    /**
     * Explicit refresh token for document changes made outside graph interactions.
     */
    @PwbExport
    public set refreshVersion(pValue: number) {
        if (this.mRefreshVersion === pValue) {
            return;
        }

        this.mRefreshVersion = pValue;
        this.invalidateGraphContent();
        this.updatePreviewElementsFromResult();
    }

    /**
     * Get the current explicit refresh token.
     */
    public get refreshVersion(): number {
        return this.mRefreshVersion;
    }

    /**
     * Latest generated preview result to apply to node preview elements.
     */
    @PwbExport
    public set previewResult(pValue: PotatnoCodeGeneratorFunctionResult<TProject> | null) {
        if (this.mPreviewResult === pValue) {
            return;
        }

        this.mPreviewResult = pValue;
        this.updatePreviewElementsFromResult();
    }

    /**
     * Get the latest generated preview result.
     */
    public get previewResult(): PotatnoCodeGeneratorFunctionResult<TProject> | null {
        return this.mPreviewResult;
    }

    /**
     * Version token used to explicitly refresh node preview visuals from cache.
     */
    @PwbExport
    public set previewUpdateVersion(pValue: number) {
        if (this.mPreviewUpdateVersion === pValue) {
            return;
        }

        this.mPreviewUpdateVersion = pValue;
        this.updatePreviewElementsFromResult();
    }

    /**
     * Get the preview update token.
     */
    public get previewUpdateVersion(): number {
        return this.mPreviewUpdateVersion;
    }

    /**
     * Set of nodes that have validation errors — triggers red outline highlighting.
     */
    @PwbExport
    public set errorNodes(pValue: ReadonlySet<PotatnoDocumentNode<TProject>>) {
        this.mErrorNodes = pValue ?? new Set<PotatnoDocumentNode<TProject>>();
        this.invalidateGraphContent();
    }

    /**
     * Set of ports that have validation errors — triggers red port and connection highlighting.
     */
    @PwbExport
    public set errorPorts(pValue: ReadonlySet<PotatnoDocumentPort<TProject>>) {
        this.mErrorPorts = pValue ?? new Set<PotatnoDocumentPort<TProject>>();
        this.invalidateGraphContent();
    }

    /**
     * Grid background style for the current graph transform.
     */
    public get gridBackgroundStyle(): string {
        void this.mTransformVersion;
        return this.mInteraction.getGridBackgroundCss();
    }

    /**
     * CSS transform style for the graph content layer.
     */
    public get gridTransformStyle(): string {
        void this.mTransformVersion;
        return 'transform: ' + this.mInteraction.getTransformCss();
    }

    /**
     * Grid size in pixels passed to node components.
     */
    public get gridSize(): number {
        return this.mInteraction.gridSize;
    }

    /**
     * Whether the selection box should be rendered.
     */
    public get showSelectionBox(): boolean {
        return this.mShowSelectionBox;
    }

    /**
     * Style for the current drag selection box.
     */
    public get selectionBoxStyle(): string {
        const lX: number = Math.min(this.mSelectionBoxScreen.x1, this.mSelectionBoxScreen.x2);
        const lY: number = Math.min(this.mSelectionBoxScreen.y1, this.mSelectionBoxScreen.y2);
        const lW: number = Math.abs(this.mSelectionBoxScreen.x2 - this.mSelectionBoxScreen.x1);
        const lH: number = Math.abs(this.mSelectionBoxScreen.y2 - this.mSelectionBoxScreen.y1);
        return `left: ${lX}px; top: ${lY}px; width: ${lW}px; height: ${lH}px`;
    }

    /**
     * Node view states rendered by the template.
     */
    public get visibleNodes(): Array<NodeViewState<TProject>> {
        return this.mCachedGraphData.visibleNodes;
    }

    /**
     * Whether the add-node popup is open.
     */
    public get showAddNodePopup(): boolean {
        return this.mAddNodePopup !== null;
    }

    /**
     * Add-node popup style at the context menu pointer position.
     */
    public get addNodePopupStyle(): string {
        const lPopup: AddNodePopupState | null = this.mAddNodePopup;
        if (!lPopup) {
            return '';
        }

        return `left: ${lPopup.screenX}px; top: ${lPopup.screenY}px`;
    }

    /**
     * Current add-node popup search text.
     */
    public get addNodeSearchValue(): string {
        return this.mAddNodeSearchQuery;
    }

    /**
     * Filtered add-node entries shown in the popup.
     */
    public get addNodeResults(): Array<NodeDefinitionEntry<TProject>> {
        return this.mFilteredAddNodeEntries;
    }

    /**
     * Whether a library drag indicator is currently visible.
     */
    public get hasLibraryDragIndicator(): boolean {
        return this.mLibraryDragIndicator !== null;
    }

    /**
     * Style for the library drag indicator.
     */
    public get libraryDragIndicatorStyle(): string {
        const lIndicator: LibraryDragIndicatorState | null = this.mLibraryDragIndicator;
        if (!lIndicator) {
            return '';
        }

        return `left: ${lIndicator.clientX}px; top: ${lIndicator.clientY}px`;
    }

    /**
     * Label displayed inside the library drag indicator.
     */
    public get libraryDragLabel(): string {
        return this.mLibraryDragIndicator?.label ?? '';
    }

    /**
     * Resolve the preview element for a node rendered by this graph.
     *
     * @param pNode - Node whose preview element should be returned.
     *
     * @returns Preview element, or null when no preview is available.
     */
    public getPreviewElementForNode(pNode: PotatnoDocumentNode<TProject>): HTMLElement | null {
        return this.mPreviewElements.get(pNode) ?? null;
    }

    /**
     * Return the CSS class for an add-node result row.
     *
     * @param pEntry - Entry whose selected state should be checked.
     *
     * @returns CSS class for the result row.
     */
    public getAddNodeEntryClass(pEntry: NodeDefinitionEntry<TProject>): string {
        return pEntry.id === this.mAddNodeSelectedDefinitionId ? 'add-node-result selected' : 'add-node-result';
    }

    /**
     * Register global graph listeners.
     */
    public onConnect(): void {
        this.mLibraryDragUnsubscribe = PotatnoNodeLibraryDragBus.subscribe((pDetail: PotatnoNodeLibraryDragStartDetail) => this.startLibraryDrag(pDetail));
        this.mLibraryInsertUnsubscribe = PotatnoNodeLibraryDragBus.subscribeInsert((pDetail: PotatnoNodeLibraryInsertDetail) => this.insertLibraryNodeAtViewportCenter(pDetail));
        this.mKeyboardHandler = (pEvent: KeyboardEvent) => this.onKeyDown(pEvent);
        document.addEventListener('keydown', this.mKeyboardHandler);
        this.invalidateGraphContent();
    }

    /**
     * Remove graph listeners and pending frame work.
     */
    public onDeconstruct(): void {
        this.stopDocumentPointerTracking();

        if (this.mKeyboardHandler) {
            document.removeEventListener('keydown', this.mKeyboardHandler);
            this.mKeyboardHandler = null;
        }

        if (this.mLibraryDragUnsubscribe) {
            this.mLibraryDragUnsubscribe();
            this.mLibraryDragUnsubscribe = null;
        }

        if (this.mLibraryInsertUnsubscribe) {
            this.mLibraryInsertUnsubscribe();
            this.mLibraryInsertUnsubscribe = null;
        }

        if (this.mPendingConnectionRenderFrame !== 0) {
            cancelAnimationFrame(this.mPendingConnectionRenderFrame);
            this.mPendingConnectionRenderFrame = 0;
        }
    }

    /**
     * Handle pointer down on empty graph space for panning or selection.
     *
     * @param pEvent - Pointer event from the graph wrapper.
     */
    public onCanvasPointerDown(pEvent: PointerEvent): void {
        this.closeAddNodePopup();

        if (pEvent.button === 1) {
            pEvent.preventDefault();
            this.mInteractionState = { mode: 'panning', startX: pEvent.clientX, startY: pEvent.clientY };
            this.startDocumentPointerTracking();
            return;
        }

        if (pEvent.button !== 0) {
            return;
        }

        if (!pEvent.ctrlKey) {
            this.mSelectedNodes.clear();
            this.invalidateNodeVisuals();
        }

        const lLocalPosition: Point = this.getLocalPointerPosition(pEvent.clientX, pEvent.clientY);
        this.mInteractionState = { mode: 'selecting' };
        this.mSelectionBoxScreen = {
            x1: lLocalPosition.x,
            x2: lLocalPosition.x,
            y1: lLocalPosition.y,
            y2: lLocalPosition.y
        };
        this.mShowSelectionBox = false;
        this.startDocumentPointerTracking();
    }

    /**
     * Handle wheel zoom on the graph.
     *
     * @param pEvent - Wheel event from the graph wrapper.
     */
    public onCanvasWheel(pEvent: WheelEvent): void {
        pEvent.preventDefault();
        const lLocalPosition: Point = this.getLocalPointerPosition(pEvent.clientX, pEvent.clientY);
        this.mInteraction.zoomAt(
            lLocalPosition.x,
            lLocalPosition.y,
            pEvent.deltaY > 0 ? -0.1 : 0.1
        );
        this.mTransformVersion++;
        this.scheduleConnectionRender();
    }

    /**
     * Handle graph context menu behavior for connection deletion or add-node popup.
     *
     * @param pEvent - Context menu event from the graph wrapper.
     */
    public onContextMenu(pEvent: MouseEvent): void {
        pEvent.preventDefault();

        if (pEvent.target instanceof Element && pEvent.target.hasAttribute('data-hit-area')) {
            const lConnectionId: string | null = pEvent.target.getAttribute('data-connection-id');
            if (lConnectionId) {
                this.deleteConnectionById(lConnectionId);
            }
            return;
        }

        if (this.eventPathContainsGraphNode(pEvent) || this.eventPathContainsAddNodePopup(pEvent)) {
            return;
        }

        this.openAddNodePopupAtPointer(pEvent.clientX, pEvent.clientY);
    }

    /**
     * Handle pointer down on a rendered node for selection and dragging.
     *
     * @param pEvent - Pointer event from the node element.
     * @param pNode - Node that received the pointer down.
     */
    public onNodePointerDown(pEvent: PointerEvent, pNode: PotatnoDocumentNode<TProject>): void {
        for (const lPathItem of pEvent.composedPath()) {
            if (lPathItem instanceof HTMLElement && lPathItem.tagName.toLowerCase() === 'potatno-port') {
                return;
            }
        }

        pEvent.stopPropagation();
        this.closeAddNodePopup();

        if (pEvent.button !== 0) {
            return;
        }

        if (pEvent.ctrlKey) {
            if (this.mSelectedNodes.has(pNode)) {
                this.mSelectedNodes.delete(pNode);
            } else {
                this.mSelectedNodes.add(pNode);
            }
        } else if (!this.mSelectedNodes.has(pNode)) {
            this.mSelectedNodes.clear();
            this.mSelectedNodes.add(pNode);
        }

        this.invalidateNodeVisuals();

        const lGridSize: number = this.mInteraction.gridSize;
        const lOrigins: Map<PotatnoDocumentNode<TProject>, NodeDragOrigin> = new Map<PotatnoDocumentNode<TProject>, NodeDragOrigin>();

        for (const lNode of this.mSelectedNodes) {
            lOrigins.set(lNode, {
                originX: lNode.transformation.x * lGridSize,
                originY: lNode.transformation.y * lGridSize
            });
        }

        if (pNode.category === NodeCategory.Comment) {
            this.addCommentContainedNodeOrigins(pNode, lOrigins);
        }

        this.mInteractionState = {
            mode: 'dragging-node',
            origins: lOrigins,
            startX: pEvent.clientX,
            startY: pEvent.clientY
        };
        this.startDocumentPointerTracking();
    }

    /**
     * Start dragging a wire from a port.
     *
     * @param pEvent - Component event with port interaction data.
     */
    public onPortDragStart(pEvent: ComponentEvent<PortInteractionDetail>): void {
        const lCanvasRect: DOMRect = this.canvasWrapper.getBoundingClientRect();
        const lCircleRect: DOMRect = pEvent.value.element.getBoundingClientRect();
        const lStartX: number = (lCircleRect.left + lCircleRect.width / 2 - lCanvasRect.left - this.mInteraction.panX) / this.mInteraction.zoom;
        const lStartY: number = (lCircleRect.top + lCircleRect.height / 2 - lCanvasRect.top - this.mInteraction.panY) / this.mInteraction.zoom;

        this.closeAddNodePopup();
        this.mInteractionState = {
            mode: 'dragging-wire',
            sourcePort: pEvent.value.port,
            startX: lStartX,
            startY: lStartY
        };
        this.startDocumentPointerTracking();
    }

    /**
     * Record the current hovered port for wire completion.
     *
     * @param pEvent - Component event with port interaction data.
     */
    public onPortHover(pEvent: ComponentEvent<PortInteractionDetail>): void {
        this.mHoveredPort = { node: pEvent.value.node, port: pEvent.value.port };
    }

    /**
     * Clear the current hovered port.
     */
    public onPortLeave(): void {
        this.mHoveredPort = null;
    }

    /**
     * Register a port's circle element for DOM-based position lookups during connection rendering.
     *
     * @param pEvent - Component event with port interaction data.
     */
    public onPortElementReady(pEvent: ComponentEvent<PortInteractionDetail>): void {
        this.mPortElementRegistry.set(pEvent.value.port as PotatnoDocumentPort<TProject>, pEvent.value.element);
    }

    /**
     * Start resizing a comment node.
     *
     * @param pEvent - Component event with resize start data.
     */
    public onNodeResizeStart(pEvent: ComponentEvent<ResizeStartDetail>): void {
        this.closeAddNodePopup();
        this.mInteractionState = {
            mode: 'resizing-comment',
            node: pEvent.value.node,
            originalH: pEvent.value.node.transformation.height,
            originalW: pEvent.value.node.transformation.width,
            startX: pEvent.value.startX,
            startY: pEvent.value.startY
        };
        this.startDocumentPointerTracking();
    }

    /**
     * Record a comment text change.
     *
     * @param pEvent - Component event containing the changed comment.
     */
    public onCommentChange(pEvent: ComponentEvent<CommentChangeDetail>): void {
        void pEvent;
        this.emitGraphChange(false, false);
    }

    /**
     * Record a direct value change on a node port.
     *
     * @param pEvent - Component event containing the changed direct value.
     */
    public onDirectValueChange(pEvent: ComponentEvent<DirectValueChangeDetail>): void {
        void pEvent;
        this.emitGraphChange(true, false);
    }

    /**
     * Request opening the document function represented by a function node.
     *
     * @param pEvent - Component event containing the function node.
     */
    public onOpenFunction(pEvent: ComponentEvent<OpenFunctionDetail>): void {
        const lDefinitionId: string = pEvent.value.node.definitionId;
        this.mOpenFunction.dispatchEvent({
            functionId: lDefinitionId.startsWith('USERFUNCTION_')
                ? lDefinitionId.slice('USERFUNCTION_'.length)
                : lDefinitionId
        });
    }

    /**
     * Prevent popup pointer interaction from reaching the graph background.
     *
     * @param pEvent - Pointer event from the popup.
     */
    public onAddNodePopupPointerDown(pEvent: PointerEvent): void {
        pEvent.stopPropagation();
    }

    /**
     * Handle add-node popup search changes.
     *
     * @param pEvent - Input event from the popup search field.
     */
    public onAddNodeSearchInput(pEvent: Event): void {
        if (!(pEvent.target instanceof HTMLInputElement)) {
            return;
        }

        this.mAddNodeSearchQuery = pEvent.target.value;
        this.rebuildAddNodeResults();
    }

    /**
     * Handle add-node popup keyboard navigation.
     *
     * @param pEvent - Keyboard event from the popup search field.
     */
    public onAddNodeSearchKeyDown(pEvent: KeyboardEvent): void {
        if (pEvent.key === 'Escape') {
            pEvent.preventDefault();
            this.closeAddNodePopup();
            return;
        }

        if (pEvent.key === 'Enter') {
            pEvent.preventDefault();
            this.insertSelectedAddNode();
            return;
        }

        if (pEvent.key === 'ArrowDown' || pEvent.key === 'ArrowUp') {
            pEvent.preventDefault();
            this.moveAddNodeSelection(pEvent.key === 'ArrowDown' ? 1 : -1);
        }
    }

    /**
     * Insert a clicked add-node popup entry.
     *
     * @param pEvent - Pointer event from the result row.
     * @param pEntry - Entry to insert.
     */
    public onAddNodeEntryPointerDown(pEvent: PointerEvent, pEntry: NodeDefinitionEntry<TProject>): void {
        pEvent.preventDefault();
        pEvent.stopPropagation();
        this.insertNodeFromAddPopup(pEntry.definition);
    }

    /**
     * Track document-level pointer movement for the active graph interaction.
     *
     * @param pEvent - Pointer move event from the document.
     */
    private onDocumentPointerMove(pEvent: PointerEvent): void {
        const lState: GraphInteractionState<TProject> = this.mInteractionState;

        if (lState.mode === 'panning') {
            this.mInteraction.pan(pEvent.clientX - lState.startX, pEvent.clientY - lState.startY);
            lState.startX = pEvent.clientX;
            lState.startY = pEvent.clientY;
            this.mTransformVersion++;
            this.scheduleConnectionRender();
            return;
        }

        if (lState.mode === 'dragging-node') {
            this.dragSelectedNodes(pEvent, lState);
            return;
        }

        if (lState.mode === 'dragging-wire') {
            this.renderDraggedWire(pEvent, lState);
            return;
        }

        if (lState.mode === 'selecting') {
            const lLocalPosition: Point = this.getLocalPointerPosition(pEvent.clientX, pEvent.clientY);
            this.mSelectionBoxScreen.x2 = lLocalPosition.x;
            this.mSelectionBoxScreen.y2 = lLocalPosition.y;
            this.mShowSelectionBox = Math.abs(this.mSelectionBoxScreen.x2 - this.mSelectionBoxScreen.x1) > 5
                || Math.abs(this.mSelectionBoxScreen.y2 - this.mSelectionBoxScreen.y1) > 5;
            return;
        }

        if (lState.mode === 'resizing-comment') {
            const lGridSize: number = this.mInteraction.gridSize;
            const lDx: number = (pEvent.clientX - lState.startX) / this.mInteraction.zoom;
            const lDy: number = (pEvent.clientY - lState.startY) / this.mInteraction.zoom;
            lState.node.resizeTo(
                lState.originalW + Math.round(lDx / lGridSize),
                lState.originalH + Math.round(lDy / lGridSize)
            );
            this.rebuildVisibleNodePositions();
            return;
        }

        if (lState.mode === 'library-drag') {
            this.mLibraryDragIndicator = {
                clientX: pEvent.clientX,
                clientY: pEvent.clientY,
                label: lState.label
            };
        }
    }

    /**
     * Finish the active document-level pointer interaction.
     *
     * @param pEvent - Pointer up event from the document.
     */
    private onDocumentPointerUp(pEvent: PointerEvent): void {
        const lState: GraphInteractionState<TProject> = this.mInteractionState;

        if (lState.mode === 'dragging-node') {
            this.emitGraphChange(true, false);
        } else if (lState.mode === 'dragging-wire') {
            this.completeWireDrag();
        } else if (lState.mode === 'selecting') {
            this.mShowSelectionBox = false;
            this.selectNodesInBox();
        } else if (lState.mode === 'resizing-comment') {
            this.emitGraphChange(false, false);
        } else if (lState.mode === 'library-drag') {
            this.finishLibraryDrag(pEvent, lState);
        }

        this.mInteractionState = { mode: 'idle' };
        this.stopDocumentPointerTracking();
    }

    /**
     * Handle graph keyboard shortcuts.
     *
     * @param pEvent - Keyboard event from the document.
     */
    private onKeyDown(pEvent: KeyboardEvent): void {
        if (this.isTextEditingActive()) {
            return;
        }

        if (pEvent.key === 'Delete') {
            this.deleteSelectedNodes();
            return;
        }

        if (pEvent.ctrlKey && pEvent.key === 'z') {
            pEvent.preventDefault();
            if (pEvent.shiftKey) {
                this.mRedoRequest.dispatchEvent(void 0);
            } else {
                this.mUndoRequest.dispatchEvent(void 0);
            }
            return;
        }

        if (pEvent.ctrlKey && pEvent.key === 'y') {
            pEvent.preventDefault();
            this.mRedoRequest.dispatchEvent(void 0);
            return;
        }

        if (pEvent.ctrlKey && pEvent.key === 'c') {
            this.mClipboard.copy(this.mSelectedNodes);
            return;
        }

        if (pEvent.ctrlKey && pEvent.key === 'v') {
            pEvent.preventDefault();
            this.pasteFromClipboard();
        }
    }

    /**
     * Add non-comment nodes inside a dragged comment to the drag origin map.
     *
     * @param pCommentNode - Comment node being dragged.
     * @param pOrigins - Origin map to extend.
     */
    private addCommentContainedNodeOrigins(pCommentNode: PotatnoDocumentNode<TProject>, pOrigins: Map<PotatnoDocumentNode<TProject>, NodeDragOrigin>): void {
        const lActiveFunction: PotatnoDocumentFunction<TProject> | null = this.mActiveFunction;
        if (!lActiveFunction) {
            return;
        }

        const lGridSize: number = this.mInteraction.gridSize;
        const lCommentLeft: number = pCommentNode.transformation.x * lGridSize;
        const lCommentTop: number = pCommentNode.transformation.y * lGridSize;
        const lCommentRight: number = lCommentLeft + pCommentNode.transformation.width * lGridSize;
        const lCommentBottom: number = lCommentTop + pCommentNode.transformation.height * lGridSize;

        for (const lNode of lActiveFunction.nodes) {
            if (lNode === pCommentNode || this.mSelectedNodes.has(lNode) || lNode.category === NodeCategory.Comment) {
                continue;
            }

            const lNodeX: number = lNode.transformation.x * lGridSize;
            const lNodeY: number = lNode.transformation.y * lGridSize;
            if (lNodeX >= lCommentLeft && lNodeX <= lCommentRight && lNodeY >= lCommentTop && lNodeY <= lCommentBottom) {
                pOrigins.set(lNode, { originX: lNodeX, originY: lNodeY });
            }
        }
    }

    /**
     * Close the add-node popup and clear its search state.
     */
    private closeAddNodePopup(): void {
        this.mAddNodePopup = null;
        this.mAddNodeSearchQuery = '';
        this.mAddNodeSelectedDefinitionId = null;
        this.mFilteredAddNodeEntries = [];
    }

    /**
     * Complete a wire drag and create a connection when the hovered target is valid.
     */
    private completeWireDrag(): void {
        const lSvg: SVGSVGElement | null = this.getSvgLayerOrNull();
        if (lSvg) {
            this.mRenderer.clearTempConnection(lSvg);
        }

        if (this.mInteractionState.mode !== 'dragging-wire') {
            return;
        }

        const lSource: PotatnoDocumentPort<TProject> = this.mInteractionState.sourcePort;
        const lTarget: PotatnoDocumentPort<TProject> | null = this.mHoveredPort?.port ?? null;

        if (!lTarget || lSource === lTarget) {
            return;
        }

        if (lSource.direction === lTarget.direction || lSource.portType !== lTarget.portType) {
            return;
        }

        try {
            lSource.connect(lTarget);
            this.mConnectionVersion++;
            this.invalidateGraphContent();
            this.emitGraphChange(true, false);
        } catch (pError) {
            console.error('[NodeGraph] Connection failed:', pError);
        }
    }

    /**
     * Delete a connection by its rendered connection id.
     *
     * @param pConnectionId - Rendered connection id from the SVG hit path.
     */
    private deleteConnectionById(pConnectionId: string): void {
        const lConnection: ConnectionRecord<TProject> | undefined = this.mConnectionRegistry.get(pConnectionId);
        if (!lConnection) {
            return;
        }

        lConnection.sourcePort.disconnect(lConnection.targetPort);
        this.mConnectionVersion++;
        this.invalidateGraphContent();
        this.emitGraphChange(true, false);
    }

    /**
     * Delete selected non-system nodes from the active graph.
     */
    private deleteSelectedNodes(): void {
        const lActiveFunction: PotatnoDocumentFunction<TProject> | null = this.mActiveFunction;
        if (!lActiveFunction) {
            return;
        }

        let lDeleted: boolean = false;
        for (const lNode of [...this.mSelectedNodes]) {
            if (lNode.isSystem) {
                continue;
            }

            lActiveFunction.removeNode(lNode);
            this.mSelectedNodes.delete(lNode);
            lDeleted = true;
        }

        if (!lDeleted) {
            return;
        }

        this.mConnectionVersion++;
        this.invalidateGraphContent();
        this.emitGraphChange(true, false);
    }

    /**
     * Drag the selected nodes according to the current pointer position.
     *
     * @param pEvent - Pointer event from the document.
     * @param pState - Active node drag state.
     */
    private dragSelectedNodes(pEvent: PointerEvent, pState: Extract<GraphInteractionState<TProject>, { mode: 'dragging-node' }>): void {
        const lZoom: number = this.mInteraction.zoom;
        const lGridSize: number = this.mInteraction.gridSize;
        const lDx: number = (pEvent.clientX - pState.startX) / lZoom;
        const lDy: number = (pEvent.clientY - pState.startY) / lZoom;

        for (const [lNode, lOrigin] of pState.origins) {
            const lSnapped: Point = this.mInteraction.snapToGrid(lOrigin.originX + lDx, lOrigin.originY + lDy);
            lNode.moveTo(Math.round(lSnapped.x / lGridSize), Math.round(lSnapped.y / lGridSize));
        }

        this.rebuildVisibleNodePositions();
        this.scheduleConnectionRender();
    }

    /**
     * Emit a graph mutation event to the editor.
     *
     * @param pAffectsPreview - Whether the mutation should schedule preview regeneration.
     * @param pAffectsLibrary - Whether the mutation should refresh available library nodes.
     */
    private emitGraphChange(pAffectsPreview: boolean, pAffectsLibrary: boolean): void {
        this.mGraphChange.dispatchEvent({
            affectsLibrary: pAffectsLibrary,
            affectsPreview: pAffectsPreview
        });
    }

    /**
     * Check if an event path includes the add-node popup.
     *
     * @param pEvent - Event to inspect.
     *
     * @returns True when the event originated from the popup.
     */
    private eventPathContainsAddNodePopup(pEvent: Event): boolean {
        for (const lPathItem of pEvent.composedPath()) {
            if (lPathItem instanceof HTMLElement && lPathItem.classList.contains('add-node-popup')) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if an event path includes a graph node element.
     *
     * @param pEvent - Event to inspect.
     *
     * @returns True when the event originated from a node.
     */
    private eventPathContainsGraphNode(pEvent: Event): boolean {
        for (const lPathItem of pEvent.composedPath()) {
            if (lPathItem instanceof HTMLElement && lPathItem.tagName.toLowerCase() === 'potatno-node') {
                return true;
            }
        }

        return false;
    }

    /**
     * Focus the add-node popup search field after it has rendered.
     */
    private focusAddNodeSearchInput(): void {
        requestAnimationFrame(() => {
            const lWrapper: HTMLElement | null = this.getCanvasWrapperOrNull();
            const lInput: HTMLInputElement | null = lWrapper?.querySelector<HTMLInputElement>('.add-node-search') ?? null;
            lInput?.focus();
            lInput?.select();
        });
    }

    /**
     * Finish a library drag and insert only when released over the graph.
     *
     * @param pEvent - Pointer up event from the document.
     * @param pState - Active library drag state.
     */
    private finishLibraryDrag(pEvent: PointerEvent, pState: Extract<GraphInteractionState<TProject>, { mode: 'library-drag' }>): void {
        this.mLibraryDragIndicator = null;

        if (!this.isPointerInsideCanvas(pEvent.clientX, pEvent.clientY)) {
            return;
        }

        const lEntry: NodeDefinitionEntry<TProject> | null = this.getNodeDefinitionEntryById(pState.definitionId);
        if (!lEntry) {
            return;
        }

        const lWorldPosition: Point = this.getWorldPointerPosition(pEvent.clientX, pEvent.clientY);
        this.insertNodeAt(lEntry.definition, lWorldPosition);
    }

    /**
     * Find the graph wrapper if it is already connected.
     *
     * @returns Canvas wrapper or null before render.
     */
    private getCanvasWrapperOrNull(): HTMLElement | null {
        try {
            return this.canvasWrapper;
        } catch {
            return null;
        }
    }

    /**
     * Find an available node definition by id.
     *
     * @param pDefinitionId - Definition id to resolve.
     *
     * @returns Matching entry, or null when unavailable.
     */
    private getNodeDefinitionEntryById(pDefinitionId: string): NodeDefinitionEntry<TProject> | null {
        return buildAvailableNodeDefinitionEntries(this.mActiveFunction).find((pEntry: NodeDefinitionEntry<TProject>) => pEntry.id === pDefinitionId) ?? null;
    }

    /**
     * Calculate pointer coordinates relative to the graph wrapper.
     *
     * @param pClientX - Viewport X coordinate.
     * @param pClientY - Viewport Y coordinate.
     *
     * @returns Local graph wrapper coordinates.
     */
    private getLocalPointerPosition(pClientX: number, pClientY: number): Point {
        const lWrapper: HTMLElement | null = this.getCanvasWrapperOrNull();
        if (!lWrapper) {
            return { x: 0, y: 0 };
        }

        const lRect: DOMRect = lWrapper.getBoundingClientRect();
        return { x: pClientX - lRect.left, y: pClientY - lRect.top };
    }

    /**
     * Calculate the rendered port anchor position in world coordinates.
     * Uses the actual DOM position of the port circle element when available,
     * falling back to an estimated position based on node layout constants.
     *
     * @param pPort - Port whose anchor should be located.
     *
     * @returns World position for the port.
     */
    private getPortPosition(pPort: PotatnoDocumentPort<TProject>): Point {
        const lCircleEl: HTMLElement | undefined = this.mPortElementRegistry.get(pPort);
        const lWrapper: HTMLElement | null = this.getCanvasWrapperOrNull();

        if (lCircleEl && lWrapper) {
            const lCanvasRect: DOMRect = lWrapper.getBoundingClientRect();
            const lCircleRect: DOMRect = lCircleEl.getBoundingClientRect();
            return {
                x: (lCircleRect.left + lCircleRect.width / 2 - lCanvasRect.left - this.mInteraction.panX) / this.mInteraction.zoom,
                y: (lCircleRect.top + lCircleRect.height / 2 - lCanvasRect.top - this.mInteraction.panY) / this.mInteraction.zoom
            };
        }

        // Fallback: estimated position based on layout constants (all ports in body area).
        const lNode: PotatnoDocumentNode<TProject> = pPort.node;
        const lGridSize: number = this.mInteraction.gridSize;
        const lNodeX: number = lNode.transformation.x * lGridSize;
        const lNodeY: number = lNode.transformation.y * lGridSize;
        const lNodeW: number = lNode.transformation.width * lGridSize;
        const lHeaderH: number = 28;
        const lPortGap: number = 24;
        const lBodyPad: number = 4;

        const lPortMap: Map<string, PotatnoDocumentPort<TProject>> = pPort.direction === 'output' ? lNode.outputs : lNode.inputs;
        let lIdx: number = 0;
        let lCount: number = 0;

        for (const lCandidatePort of lPortMap.values()) {
            if (lCandidatePort === pPort) {
                lIdx = lCount;
                break;
            }
            lCount++;
        }

        return {
            x: pPort.direction === 'output' ? lNodeX + lNodeW : lNodeX,
            y: lNodeY + lHeaderH + lBodyPad + (lIdx + 0.5) * lPortGap
        };
    }

    /**
     * Find the SVG layer if it is already connected.
     *
     * @returns SVG layer or null before render.
     */
    private getSvgLayerOrNull(): SVGSVGElement | null {
        try {
            return this.svgLayer;
        } catch {
            return null;
        }
    }

    /**
     * Convert viewport coordinates to graph world coordinates.
     *
     * @param pClientX - Viewport X coordinate.
     * @param pClientY - Viewport Y coordinate.
     *
     * @returns Graph world coordinates.
     */
    private getWorldPointerPosition(pClientX: number, pClientY: number): Point {
        const lLocalPosition: Point = this.getLocalPointerPosition(pClientX, pClientY);
        return this.mInteraction.screenToWorld(lLocalPosition.x, lLocalPosition.y);
    }

    /**
     * Rebuild graph data and schedule connection rendering.
     */
    private invalidateGraphContent(): void {
        this.rebuildGraphData();
        this.scheduleConnectionRender();
    }

    /**
     * Refresh only node visual state.
     */
    private invalidateNodeVisuals(): void {
        this.rebuildGraphData();
    }

    /**
     * Insert a node at a world position.
     *
     * @param pDefinition - Node definition to instantiate.
     * @param pWorldPosition - Graph world position for the new node.
     */
    private insertNodeAt(pDefinition: PotatnoNodeDefinition<TProject>, pWorldPosition: Point): void {
        const lActiveFunction: PotatnoDocumentFunction<TProject> | null = this.mActiveFunction;
        if (!lActiveFunction) {
            return;
        }

        const lGridSize: number = this.mInteraction.gridSize;
        const lSnappedPosition: Point = this.mInteraction.snapToGrid(pWorldPosition.x, pWorldPosition.y);
        const lNode: PotatnoDocumentNode<TProject> = lActiveFunction.newNode(pDefinition, {
            height: 4,
            width: 10,
            x: Math.round(lSnappedPosition.x / lGridSize),
            y: Math.round(lSnappedPosition.y / lGridSize)
        });

        this.mSelectedNodes.clear();
        this.mSelectedNodes.add(lNode);
        this.closeAddNodePopup();
        this.invalidateGraphContent();
        this.emitGraphChange(true, false);
    }

    /**
     * Insert a clicked library node into the center of the visible graph area.
     *
     * @param pDetail - Library click insertion request.
     */
    private insertLibraryNodeAtViewportCenter(pDetail: PotatnoNodeLibraryInsertDetail): void {
        const lEntry: NodeDefinitionEntry<TProject> | null = this.getNodeDefinitionEntryById(pDetail.definitionId);
        const lWrapper: HTMLElement | null = this.getCanvasWrapperOrNull();
        if (!lEntry || !lWrapper) {
            return;
        }

        this.mInteractionState = { mode: 'idle' };
        this.mLibraryDragIndicator = null;
        this.stopDocumentPointerTracking();
        this.insertNodeAt(
            lEntry.definition,
            this.mInteraction.screenToWorld(lWrapper.clientWidth / 2, lWrapper.clientHeight / 2)
        );
    }

    /**
     * Insert the currently selected add-node popup entry.
     */
    private insertSelectedAddNode(): void {
        const lEntry: NodeDefinitionEntry<TProject> | undefined = this.mFilteredAddNodeEntries.find((pEntry: NodeDefinitionEntry<TProject>) => pEntry.id === this.mAddNodeSelectedDefinitionId)
            ?? this.mFilteredAddNodeEntries[0];
        if (!lEntry) {
            return;
        }

        this.insertNodeFromAddPopup(lEntry.definition);
    }

    /**
     * Insert a node from the current popup position.
     *
     * @param pDefinition - Definition to insert.
     */
    private insertNodeFromAddPopup(pDefinition: PotatnoNodeDefinition<TProject>): void {
        const lPopup: AddNodePopupState | null = this.mAddNodePopup;
        if (!lPopup) {
            return;
        }

        this.insertNodeAt(pDefinition, { x: lPopup.worldX, y: lPopup.worldY });
    }

    /**
     * Check if text input focus should suppress graph keyboard shortcuts.
     *
     * @returns True if keyboard focus is in an editable form element.
     */
    private isTextEditingActive(): boolean {
        const lActiveElement: Element | null = document.activeElement;
        return lActiveElement instanceof HTMLInputElement
            || lActiveElement instanceof HTMLTextAreaElement
            || lActiveElement instanceof HTMLSelectElement;
    }

    /**
     * Check whether viewport coordinates are inside the graph wrapper.
     *
     * @param pClientX - Viewport X coordinate.
     * @param pClientY - Viewport Y coordinate.
     *
     * @returns True when the pointer is over the graph wrapper.
     */
    private isPointerInsideCanvas(pClientX: number, pClientY: number): boolean {
        const lWrapper: HTMLElement | null = this.getCanvasWrapperOrNull();
        if (!lWrapper) {
            return false;
        }

        const lRect: DOMRect = lWrapper.getBoundingClientRect();
        return pClientX >= lRect.left
            && pClientX <= lRect.right
            && pClientY >= lRect.top
            && pClientY <= lRect.bottom;
    }

    /**
     * Move popup selection by an offset.
     *
     * @param pOffset - Direction to move in the result list.
     */
    private moveAddNodeSelection(pOffset: number): void {
        if (this.mFilteredAddNodeEntries.length === 0) {
            this.mAddNodeSelectedDefinitionId = null;
            return;
        }

        const lCurrentIndex: number = Math.max(0, this.mFilteredAddNodeEntries.findIndex((pEntry: NodeDefinitionEntry<TProject>) => pEntry.id === this.mAddNodeSelectedDefinitionId));
        const lNextIndex: number = (lCurrentIndex + pOffset + this.mFilteredAddNodeEntries.length) % this.mFilteredAddNodeEntries.length;
        this.mAddNodeSelectedDefinitionId = this.mFilteredAddNodeEntries[lNextIndex].id;
        this.mFilteredAddNodeEntries = [...this.mFilteredAddNodeEntries];
    }

    /**
     * Open the add-node popup at a pointer position.
     *
     * @param pClientX - Viewport X coordinate.
     * @param pClientY - Viewport Y coordinate.
     */
    private openAddNodePopupAtPointer(pClientX: number, pClientY: number): void {
        const lWrapper: HTMLElement | null = this.getCanvasWrapperOrNull();
        const lLocalPosition: Point = this.getLocalPointerPosition(pClientX, pClientY);
        const lWorldPosition: Point = this.mInteraction.screenToWorld(lLocalPosition.x, lLocalPosition.y);
        const lPopupWidth: number = 280;
        const lPopupHeight: number = 320;
        const lMaxX: number = Math.max(0, (lWrapper?.clientWidth ?? lPopupWidth) - lPopupWidth - 8);
        const lMaxY: number = Math.max(0, (lWrapper?.clientHeight ?? lPopupHeight) - lPopupHeight - 8);

        this.mAddNodePopup = {
            screenX: Math.max(8, Math.min(lLocalPosition.x, lMaxX)),
            screenY: Math.max(8, Math.min(lLocalPosition.y, lMaxY)),
            worldX: lWorldPosition.x,
            worldY: lWorldPosition.y
        };
        this.mAddNodeSearchQuery = '';
        this.rebuildAddNodeResults();
        this.focusAddNodeSearchInput();
    }

    /**
     * Paste copied nodes into the active graph.
     */
    private pasteFromClipboard(): void {
        const lActiveFunction: PotatnoDocumentFunction<TProject> | null = this.mActiveFunction;
        if (!lActiveFunction) {
            return;
        }

        const lNewNodes: Array<PotatnoDocumentNode<TProject>> = this.mClipboard.paste(lActiveFunction, lActiveFunction.document, 2, 2);
        if (lNewNodes.length === 0) {
            return;
        }

        this.mSelectedNodes.clear();
        for (const lNode of lNewNodes) {
            this.mSelectedNodes.add(lNode);
        }

        this.mConnectionVersion++;
        this.invalidateGraphContent();
        this.emitGraphChange(true, false);
    }

    /**
     * Rebuild add-node popup results from the current function and search query.
     */
    private rebuildAddNodeResults(): void {
        const lQuery: string = this.mAddNodeSearchQuery.trim().toLowerCase();
        this.mFilteredAddNodeEntries = buildAvailableNodeDefinitionEntries(this.mActiveFunction)
            .filter((pEntry: NodeDefinitionEntry<TProject>) => !lQuery || pEntry.name.toLowerCase().includes(lQuery));

        if (!this.mFilteredAddNodeEntries.some((pEntry: NodeDefinitionEntry<TProject>) => pEntry.id === this.mAddNodeSelectedDefinitionId)) {
            this.mAddNodeSelectedDefinitionId = this.mFilteredAddNodeEntries[0]?.id ?? null;
        }
    }

    /**
     * Rebuild the cached graph nodes from the active function.
     */
    private rebuildGraphData(): void {
        const lVisibleNodes: Array<NodeViewState<TProject>> = [];
        const lActiveFunction: PotatnoDocumentFunction<TProject> | null = this.mActiveFunction;

        if (lActiveFunction) {
            const lGridSize: number = this.mInteraction.gridSize;
            for (const lNode of lActiveFunction.nodes) {
                this.ensurePreviewElementForNode(lNode);
                lVisibleNodes.push({
                    connectionVersion: this.mConnectionVersion,
                    errorPorts: this.mErrorPorts,
                    hasError: this.mErrorNodes.has(lNode),
                    node: lNode,
                    pixelW: lNode.transformation.width * lGridSize,
                    pixelX: lNode.transformation.x * lGridSize,
                    pixelY: lNode.transformation.y * lGridSize,
                    selected: this.mSelectedNodes.has(lNode)
                });
            }
        }

        this.mCachedGraphData = { visibleNodes: lVisibleNodes };
    }

    /**
     * Rebuild only cached node positions after a layout interaction.
     */
    private rebuildVisibleNodePositions(): void {
        const lGridSize: number = this.mInteraction.gridSize;
        this.mCachedGraphData = {
            visibleNodes: this.mCachedGraphData.visibleNodes.map((pState: NodeViewState<TProject>) => ({
                connectionVersion: pState.connectionVersion,
                errorPorts: pState.errorPorts,
                hasError: pState.hasError,
                node: pState.node,
                pixelW: pState.node.transformation.width * lGridSize,
                pixelX: pState.node.transformation.x * lGridSize,
                pixelY: pState.node.transformation.y * lGridSize,
                selected: pState.selected
            }))
        };
    }

    /**
     * Render current graph connections into the SVG layer.
     */
    private renderConnections(): void {
        const lSvg: SVGSVGElement | null = this.getSvgLayerOrNull();
        if (!lSvg) {
            return;
        }

        const lActiveFunction: PotatnoDocumentFunction<TProject> | null = this.mActiveFunction;
        if (!lActiveFunction) {
            this.mRenderer.clearAll(lSvg);
            this.mConnectionRegistry.clear();
            return;
        }

        const lConnectionData: Array<ConnectionRenderData> = [];
        this.mConnectionRegistry.clear();

        let lConnectionIndex: number = 0;
        for (const lNode of lActiveFunction.nodes) {
            for (const lOutputPort of lNode.outputs.values()) {
                for (const lConnectedPort of lOutputPort.connectedPorts) {
                    const lId: string = `c${lConnectionIndex++}`;
                    const lSourcePosition: Point = this.getPortPosition(lOutputPort);
                    const lTargetPosition: Point = this.getPortPosition(lConnectedPort);
                    const lHasError: boolean = this.mErrorPorts.has(lOutputPort) || this.mErrorPorts.has(lConnectedPort);

                    this.mConnectionRegistry.set(lId, {
                        sourcePort: lOutputPort,
                        targetPort: lConnectedPort
                    });

                    lConnectionData.push({
                        color: 'var(--pn-text-secondary)',
                        id: lId,
                        sourceX: lSourcePosition.x,
                        sourceY: lSourcePosition.y,
                        targetX: lTargetPosition.x,
                        targetY: lTargetPosition.y,
                        valid: !lHasError
                    });
                }
            }
        }

        this.mRenderer.renderConnections(lSvg, lConnectionData);
    }

    /**
     * Render the temporary wire while dragging.
     *
     * @param pEvent - Pointer event from the document.
     * @param pState - Active wire drag state.
     */
    private renderDraggedWire(pEvent: PointerEvent, pState: Extract<GraphInteractionState<TProject>, { mode: 'dragging-wire' }>): void {
        const lSvg: SVGSVGElement | null = this.getSvgLayerOrNull();
        if (!lSvg) {
            return;
        }

        const lEndPosition: Point = this.getWorldPointerPosition(pEvent.clientX, pEvent.clientY);
        this.mRenderer.renderTempConnection(
            lSvg,
            { x: pState.startX, y: pState.startY },
            lEndPosition,
            '#bac2de'
        );
    }

    /**
     * Schedule connection rendering for the next animation frame.
     */
    private scheduleConnectionRender(): void {
        if (this.mPendingConnectionRenderFrame !== 0) {
            return;
        }

        this.mPendingConnectionRenderFrame = requestAnimationFrame(() => {
            this.mPendingConnectionRenderFrame = 0;
            this.renderConnections();
        });
    }

    /**
     * Select all nodes intersecting the current selection box.
     */
    private selectNodesInBox(): void {
        const lActiveFunction: PotatnoDocumentFunction<TProject> | null = this.mActiveFunction;
        if (!lActiveFunction) {
            return;
        }

        const lTopLeft: Point = this.mInteraction.screenToWorld(
            Math.min(this.mSelectionBoxScreen.x1, this.mSelectionBoxScreen.x2),
            Math.min(this.mSelectionBoxScreen.y1, this.mSelectionBoxScreen.y2)
        );
        const lBottomRight: Point = this.mInteraction.screenToWorld(
            Math.max(this.mSelectionBoxScreen.x1, this.mSelectionBoxScreen.x2),
            Math.max(this.mSelectionBoxScreen.y1, this.mSelectionBoxScreen.y2)
        );
        const lGridSize: number = this.mInteraction.gridSize;

        for (const lNode of lActiveFunction.nodes) {
            const lNodeX: number = lNode.transformation.x * lGridSize;
            const lNodeY: number = lNode.transformation.y * lGridSize;
            const lNodeRight: number = lNodeX + lNode.transformation.width * lGridSize;
            const lNodeBottom: number = lNodeY + lNode.transformation.height * lGridSize;

            if (lNodeX < lBottomRight.x && lNodeRight > lTopLeft.x && lNodeY < lBottomRight.y && lNodeBottom > lTopLeft.y) {
                this.mSelectedNodes.add(lNode);
            }
        }

        this.invalidateNodeVisuals();
    }

    /**
     * Start tracking document pointer events for the active interaction.
     */
    private startDocumentPointerTracking(): void {
        this.stopDocumentPointerTracking();
        this.mDocumentPointerMoveHandler = (pEvent: PointerEvent) => this.onDocumentPointerMove(pEvent);
        this.mDocumentPointerUpHandler = (pEvent: PointerEvent) => this.onDocumentPointerUp(pEvent);
        document.addEventListener('pointermove', this.mDocumentPointerMoveHandler);
        document.addEventListener('pointerup', this.mDocumentPointerUpHandler);
    }

    /**
     * Start the graph-owned drag indicator for a library drag.
     *
     * @param pDetail - Drag start data from the node library.
     */
    private startLibraryDrag(pDetail: PotatnoNodeLibraryDragStartDetail): void {
        if (!this.mActiveFunction) {
            return;
        }

        this.closeAddNodePopup();
        this.mInteractionState = {
            definitionId: pDetail.definitionId,
            label: pDetail.label,
            mode: 'library-drag'
        };
        this.mLibraryDragIndicator = {
            clientX: pDetail.clientX,
            clientY: pDetail.clientY,
            label: pDetail.label
        };
        this.startDocumentPointerTracking();
    }

    /**
     * Stop document pointer tracking for the active interaction.
     */
    private stopDocumentPointerTracking(): void {
        if (this.mDocumentPointerMoveHandler) {
            document.removeEventListener('pointermove', this.mDocumentPointerMoveHandler);
            this.mDocumentPointerMoveHandler = null;
        }

        if (this.mDocumentPointerUpHandler) {
            document.removeEventListener('pointerup', this.mDocumentPointerUpHandler);
            this.mDocumentPointerUpHandler = null;
        }
    }

    /**
     * Ensure a preview element exists for a visible node that has a preview definition.
     *
     * @param pNode - Node whose preview element should be prepared.
     */
    private ensurePreviewElementForNode(pNode: PotatnoDocumentNode<TProject>): void {
        if (this.mPreviewElements.has(pNode)) {
            return;
        }

        const lDefinition: PotatnoNodeDefinition<TProject> | null = this.getNodeDefinitionEntryById(pNode.definitionId)?.definition ?? null;
        if (!lDefinition?.preview) {
            return;
        }

        const lElement: Element = lDefinition.preview.generate();
        if (lElement instanceof HTMLElement) {
            this.mPreviewElements.set(pNode, lElement);
        }
    }

    /**
     * Update all node preview elements from the latest generated code result.
     * Per-node intermediate data is no longer available from the code generator;
     * node preview updates are skipped until a richer result type is introduced.
     */
    private updatePreviewElementsFromResult(): void {
        // No per-node intermediate data in the current code generation result.
    }
}

export type GraphChangeDetail = {
    affectsLibrary: boolean;
    affectsPreview: boolean;
};

export type OpenFunctionRequestDetail = {
    functionId: string;
};

export type NodeViewState<TProject extends PotatnoUiProject> = {
    connectionVersion: number;
    errorPorts: ReadonlySet<PotatnoDocumentPort<TProject>>;
    hasError: boolean;
    node: PotatnoDocumentNode<TProject>;
    pixelW: number;
    pixelX: number;
    pixelY: number;
    selected: boolean;
};

type NodeDefinitionEntry<TProject extends PotatnoUiProject> = PotatnoNodeDefinitionListEntry<TProject>;

type GraphViewData<TProject extends PotatnoUiProject> = {
    visibleNodes: Array<NodeViewState<TProject>>;
};

type GraphInteractionState<TProject extends PotatnoUiProject> =
    | { mode: 'idle'; }
    | { mode: 'panning'; startX: number; startY: number; }
    | { mode: 'dragging-node'; startX: number; startY: number; origins: Map<PotatnoDocumentNode<TProject>, NodeDragOrigin>; }
    | { mode: 'dragging-wire'; sourcePort: PotatnoDocumentPort<TProject>; startX: number; startY: number; }
    | { mode: 'selecting'; }
    | { mode: 'resizing-comment'; node: PotatnoDocumentNode<TProject>; startX: number; startY: number; originalW: number; originalH: number; }
    | { mode: 'library-drag'; definitionId: string; label: string; };

type AddNodePopupState = {
    screenX: number;
    screenY: number;
    worldX: number;
    worldY: number;
};

type ConnectionRecord<TProject extends PotatnoUiProject> = {
    sourcePort: PotatnoDocumentPort<TProject>;
    targetPort: PotatnoDocumentPort<TProject>;
};

type LibraryDragIndicatorState = {
    clientX: number;
    clientY: number;
    label: string;
};

type NodeDragOrigin = {
    originX: number;
    originY: number;
};

type Point = {
    x: number;
    y: number;
};

type PortHoverRecord<TProject extends PotatnoUiProject> = {
    node: PotatnoDocumentNode<TProject>;
    port: PotatnoDocumentPort<TProject>;
};

type SelectionBoxScreen = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};
