import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbChild, PwbComponent, type ComponentEvent, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import { PotatnoCanvasInteraction } from '../../potatno-canvas-interaction.ts';
import { PotatnoCanvasRenderer, type ConnectionRenderData } from '../../potatno-canvas-renderer.ts';
import { PotatnoClipboard } from '../../potatno-clipboard.ts';
import { PotatnoCodeUiManager, PotatnoCodeUiManagerEventType } from '../../potatno-code-ui-manager.ts';
import { NodeCategoryMeta } from '../../node/node-category.enum.ts';
import { buildAvailableNodeDefinitionEntries, type PotatnoNodeDefinitionListEntry, type PotatnoUiProject } from '../../potatno-node-definition-list.ts';
import type { ResizeStartDetail } from '../potatno_node_component/potatno-node-component.ts';
import type { PortInteractionDetail } from '../potatno_port/potatno-port.ts';
import graphCss from './potatno-node-graph.css' with { type: 'text' };
import graphTemplate from './potatno-node-graph.html' with { type: 'text' };

// Import child components to ensure they are registered.
import { NodeCategory } from "../../node/node-category.enum.ts";
import '../potatno_node_component/potatno-node-component.ts';
import '../potatno_port/potatno-port.ts';

/**
 * Interactive node graph for the active Potatno document function.
 *
 * Owns only graph-local interaction state — pan/zoom, selection, the add-node popup, the clipboard
 * and the SVG connection layer. The document it renders, the active function, validation errors and
 * the per-node preview elements all come from the shared {@link PotatnoCodeUiManager}; every document
 * mutation is routed back through the manager so history, validation and preview rebuilds stay
 * centralized. The graph refreshes by subscribing to manager events instead of receiving refresh
 * tokens through template bindings.
 */
@PwbComponent({
    selector: 'potatno-node-graph',
    template: graphTemplate,
    style: graphCss,
})
export class PotatnoNodeGraph implements IComponentOnConnect, IComponentOnDeconstruct {
    private readonly mClipboard: PotatnoClipboard<PotatnoUiProject>;
    private readonly mComponent: Component;
    private readonly mConnectionRegistry: Map<string, ConnectionRecord>;
    private readonly mInteraction: PotatnoCanvasInteraction;
    private readonly mManager: PotatnoCodeUiManager;
    private readonly mPortElementRegistry: Map<PotatnoDocumentPort<PotatnoUiProject>, HTMLElement>;
    private readonly mRenderer: PotatnoCanvasRenderer;
    private readonly mSelectedNodes: Set<PotatnoDocumentNode<PotatnoUiProject>>;
    private mAddNodeSearchQuery: string;
    private mAddNodeSelectedDefinitionId: string | null;
    private mDocumentPointerMoveHandler: ((pEvent: PointerEvent) => void) | null;
    private mDocumentPointerUpHandler: ((pEvent: PointerEvent) => void) | null;
    private mHoveredPort: PortHoverRecord | null;
    private mInteractionState: GraphInteractionState;
    private mKeyboardHandler: ((pEvent: KeyboardEvent) => void) | null;
    private mPendingConnectionRenderFrame: number;
    private mSelectionBoxScreen: SelectionBoxScreen;
    private mUnsubscribe: (() => void) | null;

    /**
     * Cached node data rendered by the graph template.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mCachedGraphData: GraphViewData;

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
    private accessor mFilteredAddNodeEntries: Array<NodeDefinitionEntry> = [];

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
     * Create the graph component and its local interaction state.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoCodeUiManager = Injection.use(PotatnoCodeUiManager)) {
        this.mAddNodeSearchQuery = '';
        this.mAddNodeSelectedDefinitionId = null;
        this.mCachedGraphData = { visibleNodes: [] };
        this.mClipboard = new PotatnoClipboard<PotatnoUiProject>();
        this.mComponent = pComponent;
        this.mConnectionRegistry = new Map<string, ConnectionRecord>();
        this.mDocumentPointerMoveHandler = null;
        this.mDocumentPointerUpHandler = null;
        this.mHoveredPort = null;
        this.mInteraction = new PotatnoCanvasInteraction(20);
        this.mInteractionState = { mode: 'idle' };
        this.mKeyboardHandler = null;
        this.mManager = pManager;
        this.mPendingConnectionRenderFrame = 0;
        this.mPortElementRegistry = new Map<PotatnoDocumentPort<PotatnoUiProject>, HTMLElement>();
        this.mRenderer = new PotatnoCanvasRenderer();
        this.mSelectedNodes = new Set<PotatnoDocumentNode<PotatnoUiProject>>();
        this.mSelectionBoxScreen = { x1: 0, x2: 0, y1: 0, y2: 0 };
        this.mUnsubscribe = null;
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
    public get visibleNodes(): Array<NodeViewState> {
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
    public get addNodeResults(): Array<NodeDefinitionEntry> {
        return this.mFilteredAddNodeEntries;
    }

    /**
     * Return the CSS class for an add-node result row.
     *
     * @param pEntry - Entry whose selected state should be checked.
     *
     * @returns CSS class for the result row.
     */
    public getAddNodeEntryClass(pEntry: NodeDefinitionEntry): string {
        return pEntry.id === this.mAddNodeSelectedDefinitionId ? 'add-node-result selected' : 'add-node-result';
    }

    /**
     * Resolve the category accent color for an add-node result row.
     *
     * @param pEntry - Entry whose category color to resolve.
     *
     * @returns A CSS color string for the entry's category.
     */
    public getAddNodeEntryColor(pEntry: NodeDefinitionEntry): string {
        return NodeCategoryMeta.get(pEntry.category).cssColor;
    }

    /**
     * Resolve the category icon glyph for an add-node result row.
     *
     * @param pEntry - Entry whose category icon to resolve.
     *
     * @returns The category icon glyph.
     */
    public getAddNodeEntryIcon(pEntry: NodeDefinitionEntry): string {
        return NodeCategoryMeta.get(pEntry.category).icon;
    }

    /**
     * Resolve the human-readable category label for an add-node result row.
     *
     * @param pEntry - Entry whose category label to resolve.
     *
     * @returns The display label of the entry's category.
     */
    public getAddNodeEntryCategoryLabel(pEntry: NodeDefinitionEntry): string {
        return NodeCategoryMeta.get(pEntry.category).label;
    }

    /**
     * Register global graph listeners and subscribe to manager changes.
     */
    public onConnect(): void {
        this.mKeyboardHandler = (pEvent: KeyboardEvent) => this.onKeyDown(pEvent);
        document.addEventListener('keydown', this.mKeyboardHandler);

        // Refresh the graph whenever the document, active function, or graph structure changes.
        // A document load or function switch resets all interaction state first.
        this.mUnsubscribe = this.mManager.listen([
            PotatnoCodeUiManagerEventType.DocumentChange,
            PotatnoCodeUiManagerEventType.FunctionActivate,
            PotatnoCodeUiManagerEventType.NodeAdd,
            PotatnoCodeUiManagerEventType.NodeChange,
            PotatnoCodeUiManagerEventType.NodeDelete,
            PotatnoCodeUiManagerEventType.ConnectionAdd,
            PotatnoCodeUiManagerEventType.ConnectionDelete
        ], (pDetail) => {
            if (pDetail.type === PotatnoCodeUiManagerEventType.DocumentChange || pDetail.type === PotatnoCodeUiManagerEventType.FunctionActivate) {
                this.resetForActiveFunction();
            }

            this.invalidateGraphContent();
        });

        this.invalidateGraphContent();
    }

    /**
     * Remove graph listeners and pending frame work.
     */
    public onDeconstruct(): void {
        this.stopDocumentPointerTracking();

        this.mUnsubscribe?.();
        this.mUnsubscribe = null;

        if (this.mKeyboardHandler) {
            document.removeEventListener('keydown', this.mKeyboardHandler);
            this.mKeyboardHandler = null;
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
        // Let the add-node popup scroll its own result list. The popup is nested inside the canvas
        // wrapper, so its wheel events bubble here; without this guard the canvas would swallow
        // them to zoom and the list could never scroll.
        if (this.eventPathContainsAddNodePopup(pEvent)) {
            return;
        }

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
    public onNodePointerDown(pEvent: PointerEvent, pNode: PotatnoDocumentNode<PotatnoUiProject>): void {
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
        const lOrigins: Map<PotatnoDocumentNode<PotatnoUiProject>, NodeDragOrigin> = new Map<PotatnoDocumentNode<PotatnoUiProject>, NodeDragOrigin>();

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
        this.mHoveredPort = {
            node: pEvent.value.node,
            port: pEvent.value.port
        };
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
        this.mPortElementRegistry.set(pEvent.value.port, pEvent.value.element);

        // Re-render connections now that a real port position is known. Connections are first
        // drawn right after a graph rebuild — before the freshly created port elements have
        // registered — so they fall back to estimated, index-based anchor positions. Without this
        // re-render those stale estimates stick (most visibly after a function switch: every wire
        // collapses onto the first input row). The rAF debounce coalesces the burst of per-port
        // registrations into a single redraw.
        this.scheduleConnectionRender();
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
    public onAddNodeEntryPointerDown(pEvent: PointerEvent, pEntry: NodeDefinitionEntry): void {
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
        const lState: GraphInteractionState = this.mInteractionState;

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
    }

    /**
     * Finish the active document-level pointer interaction.
     *
     * @param pEvent - Pointer up event from the document.
     */
    private onDocumentPointerUp(pEvent: PointerEvent): void {
        const lState: GraphInteractionState = this.mInteractionState;

        if (lState.mode === 'dragging-node') {
            this.mManager.commitNodeChange(false);
        } else if (lState.mode === 'dragging-wire') {
            this.completeWireDrag(pEvent);
        } else if (lState.mode === 'selecting') {
            this.mShowSelectionBox = false;
            this.selectNodesInBox();
        } else if (lState.mode === 'resizing-comment') {
            this.mManager.commitNodeChange(false, lState.node);
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
                this.mManager.redo();
            } else {
                this.mManager.undo();
            }
            return;
        }

        if (pEvent.ctrlKey && pEvent.key === 'y') {
            pEvent.preventDefault();
            this.mManager.redo();
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
    private addCommentContainedNodeOrigins(pCommentNode: PotatnoDocumentNode<PotatnoUiProject>, pOrigins: Map<PotatnoDocumentNode<PotatnoUiProject>, NodeDragOrigin>): void {
        const lActiveFunction: PotatnoDocumentFunction<PotatnoUiProject> | null = this.mManager.activeFunction;
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
     * Complete a wire drag and create a connection when the drop target is valid.
     *
     * @param pEvent - The pointer-up event whose coordinates locate the drop target.
     */
    private completeWireDrag(pEvent: PointerEvent): void {
        const lSvg: SVGSVGElement | null = this.getSvgLayerOrNull();
        if (lSvg) {
            this.mRenderer.clearTempConnection(lSvg);
        }

        if (this.mInteractionState.mode !== 'dragging-wire') {
            return;
        }

        // Resolve the drop target. Prefer the hover-tracked port, but fall back to a geometric
        // hit-test against the registered port elements. Relying on `pointerenter` alone is
        // fragile: when the graph re-renders mid-drag the `$for` re-creates the port element under
        // the (stationary) cursor, and the browser never fires `pointerenter` on an element that
        // appears beneath a pointer that did not move — leaving `mHoveredPort` null even though the
        // cursor sits squarely on a valid port. The hit-test recovers the target in that case.
        const lSource: PotatnoDocumentPort<PotatnoUiProject> = this.mInteractionState.sourcePort;
        const lTarget: PotatnoDocumentPort<PotatnoUiProject> | null = this.mHoveredPort?.port ?? this.hitTestPort(pEvent.clientX, pEvent.clientY);

        if (!lTarget || lSource === lTarget) {
            return;
        }

        if (lSource.direction === lTarget.direction || lSource.portType !== lTarget.portType) {
            return;
        }

        this.mManager.connectPorts(lSource, lTarget);
    }

    /**
     * Find a port whose registered circle element contains the given viewport point. Used as a
     * drop-target fallback when hover tracking missed the target (see `completeWireDrag`).
     *
     * @param pClientX - Viewport X coordinate of the drop.
     * @param pClientY - Viewport Y coordinate of the drop.
     *
     * @returns The port under the point, or `null` when none matches.
     */
    private hitTestPort(pClientX: number, pClientY: number): PotatnoDocumentPort<PotatnoUiProject> | null {
        for (const [lPort, lElement] of this.mPortElementRegistry) {
            const lRect: DOMRect = lElement.getBoundingClientRect();
            if (pClientX >= lRect.left && pClientX <= lRect.right && pClientY >= lRect.top && pClientY <= lRect.bottom) {
                return lPort;
            }
        }

        return null;
    }

    /**
     * Delete a connection by its rendered connection id.
     *
     * @param pConnectionId - Rendered connection id from the SVG hit path.
     */
    private deleteConnectionById(pConnectionId: string): void {
        const lConnection: ConnectionRecord | undefined = this.mConnectionRegistry.get(pConnectionId);
        if (!lConnection) {
            return;
        }

        this.mManager.disconnectPorts(lConnection.sourcePort, lConnection.targetPort);
    }

    /**
     * Delete the selected nodes from the active graph.
     * System entry/exit nodes can be deleted too; they are re-synced automatically on the next validation.
     */
    private deleteSelectedNodes(): void {
        if (this.mManager.removeNodes(this.mSelectedNodes)) {
            this.mSelectedNodes.clear();
        }
    }

    /**
     * Drag the selected nodes according to the current pointer position.
     *
     * @param pEvent - Pointer event from the document.
     * @param pState - Active node drag state.
     */
    private dragSelectedNodes(pEvent: PointerEvent, pState: Extract<GraphInteractionState, { mode: 'dragging-node'; }>): void {
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
    private getPortPosition(pPort: PotatnoDocumentPort<PotatnoUiProject>): Point {
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
        const lNode: PotatnoDocumentNode<PotatnoUiProject> = pPort.node;
        const lGridSize: number = this.mInteraction.gridSize;
        const lNodeX: number = lNode.transformation.x * lGridSize;
        const lNodeY: number = lNode.transformation.y * lGridSize;
        const lNodeW: number = lNode.transformation.width * lGridSize;
        const lHeaderH: number = 28;
        const lPortGap: number = 24;
        const lBodyPad: number = 4;

        const lPortList: ReadonlyArray<PotatnoDocumentPort<PotatnoUiProject>> = pPort.direction === 'output' ? lNode.outputs.list : lNode.inputs.list;
        let lIdx: number = 0;
        let lCount: number = 0;

        for (const lCandidatePort of lPortList) {
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
    private insertNodeAt(pDefinition: PotatnoNodeDefinition<PotatnoUiProject>, pWorldPosition: Point): void {
        const lGridSize: number = this.mInteraction.gridSize;
        const lSnappedPosition: Point = this.mInteraction.snapToGrid(pWorldPosition.x, pWorldPosition.y);
        const lNode: PotatnoDocumentNode<PotatnoUiProject> | null = this.mManager.addNode(pDefinition, {
            height: 4,
            width: 10,
            x: Math.round(lSnappedPosition.x / lGridSize),
            y: Math.round(lSnappedPosition.y / lGridSize)
        });

        if (!lNode) {
            return;
        }

        this.mSelectedNodes.clear();
        this.mSelectedNodes.add(lNode);
        this.closeAddNodePopup();
    }

    /**
     * Insert the currently selected add-node popup entry.
     */
    private insertSelectedAddNode(): void {
        const lEntry: NodeDefinitionEntry | undefined = this.mFilteredAddNodeEntries.find((pEntry: NodeDefinitionEntry) => pEntry.id === this.mAddNodeSelectedDefinitionId)
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
    private insertNodeFromAddPopup(pDefinition: PotatnoNodeDefinition<PotatnoUiProject>): void {
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
     * Move popup selection by an offset.
     *
     * @param pOffset - Direction to move in the result list.
     */
    private moveAddNodeSelection(pOffset: number): void {
        if (this.mFilteredAddNodeEntries.length === 0) {
            this.mAddNodeSelectedDefinitionId = null;
            return;
        }

        const lCurrentIndex: number = Math.max(0, this.mFilteredAddNodeEntries.findIndex((pEntry: NodeDefinitionEntry) => pEntry.id === this.mAddNodeSelectedDefinitionId));
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
        const lActiveFunction: PotatnoDocumentFunction<PotatnoUiProject> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            return;
        }

        const lNewNodes: Array<PotatnoDocumentNode<PotatnoUiProject>> = this.mClipboard.paste(lActiveFunction, lActiveFunction.document, 2, 2);
        if (lNewNodes.length === 0) {
            return;
        }

        this.mSelectedNodes.clear();
        for (const lNode of lNewNodes) {
            this.mSelectedNodes.add(lNode);
        }

        this.mManager.notifyNodesPasted(lNewNodes);
    }

    /**
     * Rebuild add-node popup results from the current function and search query.
     */
    private rebuildAddNodeResults(): void {
        const lQuery: string = this.mAddNodeSearchQuery.trim().toLowerCase();
        this.mFilteredAddNodeEntries = buildAvailableNodeDefinitionEntries(this.mManager.activeFunction)
            .filter((pEntry: NodeDefinitionEntry) => !lQuery || pEntry.name.toLowerCase().includes(lQuery));

        if (!this.mFilteredAddNodeEntries.some((pEntry: NodeDefinitionEntry) => pEntry.id === this.mAddNodeSelectedDefinitionId)) {
            this.mAddNodeSelectedDefinitionId = this.mFilteredAddNodeEntries[0]?.id ?? null;
        }
    }

    /**
     * Rebuild the cached graph nodes from the active function.
     */
    private rebuildGraphData(): void {
        const lVisibleNodes: Array<NodeViewState> = [];
        const lActiveFunction: PotatnoDocumentFunction<PotatnoUiProject> | null = this.mManager.activeFunction;

        if (lActiveFunction) {
            const lGridSize: number = this.mInteraction.gridSize;
            for (const lNode of lActiveFunction.nodes) {
                lVisibleNodes.push({
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
            visibleNodes: this.mCachedGraphData.visibleNodes.map((pState: NodeViewState) => ({
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

        const lActiveFunction: PotatnoDocumentFunction<PotatnoUiProject> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            this.mRenderer.clearAll(lSvg);
            this.mConnectionRegistry.clear();
            return;
        }

        const lErrorPorts: ReadonlySet<PotatnoDocumentPort<PotatnoUiProject>> = this.mManager.errorPorts;
        const lConnectionData: Array<ConnectionRenderData> = [];
        this.mConnectionRegistry.clear();

        let lConnectionIndex: number = 0;
        for (const lNode of lActiveFunction.nodes) {
            for (const lOutputPort of lNode.outputs.list) {
                for (const lConnectedPort of lOutputPort.connectedPorts) {
                    const lId: string = `c${lConnectionIndex++}`;
                    const lSourcePosition: Point = this.getPortPosition(lOutputPort);
                    const lTargetPosition: Point = this.getPortPosition(lConnectedPort);
                    const lHasError: boolean = lErrorPorts.has(lOutputPort) || lErrorPorts.has(lConnectedPort);

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
    private renderDraggedWire(pEvent: PointerEvent, pState: Extract<GraphInteractionState, { mode: 'dragging-wire'; }>): void {
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
     * Reset all interaction state when the rendered function changes (document load or switch).
     */
    private resetForActiveFunction(): void {
        this.mHoveredPort = null;
        this.mInteractionState = { mode: 'idle' };
        this.mPortElementRegistry.clear();
        this.mSelectedNodes.clear();
        this.stopDocumentPointerTracking();
        this.closeAddNodePopup();

        const lSvg: SVGSVGElement | null = this.getSvgLayerOrNull();
        if (lSvg) {
            this.mRenderer.clearAll(lSvg);
        }
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
        const lActiveFunction: PotatnoDocumentFunction<PotatnoUiProject> | null = this.mManager.activeFunction;
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
}

export type NodeViewState = {
    node: PotatnoDocumentNode<PotatnoUiProject>;
    pixelW: number;
    pixelX: number;
    pixelY: number;
    selected: boolean;
};

type NodeDefinitionEntry = PotatnoNodeDefinitionListEntry<PotatnoUiProject>;

type GraphViewData = {
    visibleNodes: Array<NodeViewState>;
};

type GraphInteractionState =
    | { mode: 'idle'; }
    | { mode: 'panning'; startX: number; startY: number; }
    | { mode: 'dragging-node'; startX: number; startY: number; origins: Map<PotatnoDocumentNode<PotatnoUiProject>, NodeDragOrigin>; }
    | { mode: 'dragging-wire'; sourcePort: PotatnoDocumentPort<PotatnoUiProject>; startX: number; startY: number; }
    | { mode: 'selecting'; }
    | { mode: 'resizing-comment'; node: PotatnoDocumentNode<PotatnoUiProject>; startX: number; startY: number; originalW: number; originalH: number; };

type AddNodePopupState = {
    screenX: number;
    screenY: number;
    worldX: number;
    worldY: number;
};

type ConnectionRecord = {
    sourcePort: PotatnoDocumentPort<PotatnoUiProject>;
    targetPort: PotatnoDocumentPort<PotatnoUiProject>;
};

type NodeDragOrigin = {
    originX: number;
    originY: number;
};

type Point = {
    x: number;
    y: number;
};

type PortHoverRecord = {
    node: PotatnoDocumentNode<PotatnoUiProject>;
    port: PotatnoDocumentPort<PotatnoUiProject>;
};

type SelectionBoxScreen = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};
