import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbChild, PwbComponent, type ComponentEvent, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import { PotatnoCanvasInteraction } from '../../potatno-canvas-interaction.ts';
import { PotatnoClipboard } from '../../potatno-clipboard.ts';
import { PotatnoUiManager, PotatnoCodeUiManagerChangeType } from '../../manager/potatno-ui-manager.ts';
import { PotatnoPortRegistry } from '../../potatno-port-registry.ts';
import type { PotatnoUiProject } from '../../potatno-ui-project.ts';
import type { ResizeStartDetail } from '../potatno_node_component/potatno-node-component.ts';
import type { PortInteractionDetail } from '../potatno_port/potatno-port.ts';
import graphCss from './potatno-node-graph.css' with { type: 'text' };
import graphTemplate from './potatno-node-graph.html' with { type: 'text' };

// Import child components to ensure they are registered.
import { NodeCategory } from "../../node/node-category.enum.ts";
import '../potatno_add_node_popup/potatno-add-node-popup.ts';
import '../potatno_connection_layer/potatno-connection-layer.ts';
import '../potatno_node_component/potatno-node-component.ts';
import '../potatno_port/potatno-port.ts';

/**
 * Interactive node graph for the active Potatno document function.
 *
 * Owns only graph-local interaction state — pan/zoom, selection, node dragging, wire dragging and
 * the clipboard. The add-node popup and the SVG connection layer are delegated to their own child
 * components ({@link PotatnoAddNodePopup}, {@link PotatnoConnectionLayer}). The document it renders,
 * the active function, validation errors and the per-node preview elements all come from the shared
 * {@link PotatnoUiManager}; every document mutation is routed back through the manager so history,
 * validation and preview rebuilds stay centralized. The graph refreshes by subscribing to manager
 * events instead of receiving refresh tokens through template bindings.
 */
@PwbComponent({
    selector: 'potatno-node-graph',
    template: graphTemplate,
    style: graphCss,
})
export class PotatnoNodeGraph implements IComponentOnConnect, IComponentOnDeconstruct {
    private readonly mClipboard: PotatnoClipboard<PotatnoUiProject>;
    private readonly mComponent: Component;
    private readonly mInteraction: PotatnoCanvasInteraction;
    private readonly mManager: PotatnoUiManager;
    private readonly mPortRegistry: PotatnoPortRegistry;
    private readonly mSelectedNodes: Set<PotatnoDocumentNode<PotatnoUiProject>>;
    private mDocumentPointerMoveHandler: ((pEvent: PointerEvent) => void) | null;
    private mDocumentPointerUpHandler: ((pEvent: PointerEvent) => void) | null;
    private mHoveredPort: PortHoverRecord | null;
    private mInteractionState: GraphInteractionState;
    private mKeyboardHandler: ((pEvent: KeyboardEvent) => void) | null;
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
     * Screen-space bounds of the drag selection box. Reassigned (never mutated in place) on each
     * selecting pointer move so the bound `selectionBoxStyle` re-renders and the box tracks the cursor.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mSelectionBoxScreen: SelectionBoxScreen = { x1: 0, x2: 0, y1: 0, y2: 0 };

    /**
     * State for the add-node popup opened from the graph context menu.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mAddNodePopup: AddNodePopupState | null = null;

    /**
     * The transient drag wire, in world coordinates, drawn while a connection is being dragged from
     * a port. `null` when no wire is in progress.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mTempConnection: GraphTempConnection | null = null;

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
     * @param pPortRegistry - Injected shared port-element registry, used for wire-drop hit-testing.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager), pPortRegistry: PotatnoPortRegistry = Injection.use(PotatnoPortRegistry)) {
        this.mCachedGraphData = { visibleNodes: [] };
        this.mClipboard = new PotatnoClipboard<PotatnoUiProject>();
        this.mComponent = pComponent;
        this.mDocumentPointerMoveHandler = null;
        this.mDocumentPointerUpHandler = null;
        this.mHoveredPort = null;
        this.mInteraction = new PotatnoCanvasInteraction(20);
        this.mInteractionState = { mode: 'idle' };
        this.mKeyboardHandler = null;
        this.mManager = pManager;
        this.mPortRegistry = pPortRegistry;
        this.mSelectedNodes = new Set<PotatnoDocumentNode<PotatnoUiProject>>();
        this.mUnsubscribe = null;
    }

    /**
     * The graph's interaction state, passed to the connection layer so it can read the current zoom.
     */
    public get canvasInteraction(): PotatnoCanvasInteraction {
        return this.mInteraction;
    }

    /**
     * Whether a transient drag wire is currently being drawn.
     */
    public get showTempConnection(): boolean {
        return this.mTempConnection !== null;
    }

    /**
     * The bezier `d` attribute for the transient drag wire, or an empty string when none.
     */
    public get tempWirePath(): string {
        const lTemp: GraphTempConnection | null = this.mTempConnection;
        if (!lTemp) {
            return '';
        }

        return this.generateBezierPath(lTemp.start.x, lTemp.start.y, lTemp.end.x, lTemp.end.y);
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
     * Register global graph listeners and subscribe to manager changes.
     */
    public onConnect(): void {
        this.mKeyboardHandler = (pEvent: KeyboardEvent) => this.onKeyDown(pEvent);
        document.addEventListener('keydown', this.mKeyboardHandler);

        // Refresh the graph whenever the document, active function, or graph structure changes.
        // A document load or function switch resets all interaction state first.
        this.mUnsubscribe = this.mManager.subscribe(
            PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.ActiveFunction | PotatnoCodeUiManagerChangeType.Node | PotatnoCodeUiManagerChangeType.Connection,
            null,
            (pEvent) => {
                if (pEvent.changeType === PotatnoCodeUiManagerChangeType.Document || pEvent.changeType === PotatnoCodeUiManagerChangeType.Function || pEvent.changeType === PotatnoCodeUiManagerChangeType.ActiveFunction) {
                    this.resetForActiveFunction();
                }

                this.invalidateGraphContent();
                this.mComponent.updater.update();
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
    }

    /**
     * Handle graph context menu behavior for connection deletion or add-node popup.
     *
     * @param pEvent - Context menu event from the graph wrapper.
     */
    public onContextMenu(pEvent: MouseEvent): void {
        // A right-click on a connection wire is handled by the connection layer, which stops the
        // event before it reaches here. So any context menu that bubbles up is either on a node
        // (ignored) or on empty canvas (opens the add-node popup).
        pEvent.preventDefault();

        if (this.eventPathContainsGraphNode(pEvent)) {
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
     * Insert the node definition chosen in the add-node popup at the popup's world position.
     *
     * @param pEvent - Component event carrying the selected node definition.
     */
    public onAddNodePopupNodeSelect(pEvent: ComponentEvent<PotatnoNodeDefinition<PotatnoUiProject>>): void {
        this.insertNodeFromAddPopup(pEvent.value);
    }

    /**
     * Close the add-node popup in response to its `close` event.
     */
    public onAddNodePopupClose(): void {
        this.closeAddNodePopup();
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
            this.mSelectionBoxScreen = {
                x1: this.mSelectionBoxScreen.x1,
                x2: lLocalPosition.x,
                y1: this.mSelectionBoxScreen.y1,
                y2: lLocalPosition.y
            };
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
                this.mManager.history.redo();
            } else {
                this.mManager.history.undo();
            }
            return;
        }

        if (pEvent.ctrlKey && pEvent.key === 'y') {
            pEvent.preventDefault();
            this.mManager.history.redo();
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
     * Close the add-node popup. The popup component owns its own search/selection state and is
     * rebuilt fresh on the next open, so clearing the position state is enough.
     */
    private closeAddNodePopup(): void {
        this.mAddNodePopup = null;
    }

    /**
     * Complete a wire drag and create a connection when the drop target is valid.
     *
     * @param pEvent - The pointer-up event whose coordinates locate the drop target.
     */
    private completeWireDrag(pEvent: PointerEvent): void {
        // Clear the transient wire from the connection layer.
        this.mTempConnection = null;

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

        this.mManager.graph.connectPorts(lSource, lTarget);
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
        for (const [lPort, lElement] of this.mPortRegistry.entries()) {
            const lRect: DOMRect = lElement.getBoundingClientRect();
            if (pClientX >= lRect.left && pClientX <= lRect.right && pClientY >= lRect.top && pClientY <= lRect.bottom) {
                return lPort;
            }
        }

        return null;
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

        // Move each dragged node through the manager so the connection layer redraws its wires to follow.
        for (const [lNode, lOrigin] of pState.origins) {
            const lSnapped: Point = this.mInteraction.snapToGrid(lOrigin.originX + lDx, lOrigin.originY + lDy);
            this.mManager.graph.transformNode(lNode, { x: Math.round(lSnapped.x / lGridSize), y: Math.round(lSnapped.y / lGridSize) });
        }

        this.rebuildVisibleNodePositions();
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
     * Generate a cubic bezier `d` attribute between two world points for the transient drag wire.
     *
     * @param pX1 - Source X coordinate.
     * @param pY1 - Source Y coordinate.
     * @param pX2 - Target X coordinate.
     * @param pY2 - Target Y coordinate.
     *
     * @returns SVG path "d" attribute string.
     */
    private generateBezierPath(pX1: number, pY1: number, pX2: number, pY2: number): string {
        const lOffset: number = Math.max(Math.abs(pX2 - pX1) * 0.4, 50);
        return `M ${pX1} ${pY1} C ${pX1 + lOffset} ${pY1}, ${pX2 - lOffset} ${pY2}, ${pX2} ${pY2}`;
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
     * Rebuild the cached node data. The connection layer redraws itself from the same manager
     * events, so the graph no longer drives connection rendering here.
     */
    private invalidateGraphContent(): void {
        this.rebuildGraphData();
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
        if (!this.mManager.activeFunction) {
            return;
        }

        const lGridSize: number = this.mInteraction.gridSize;
        const lSnappedPosition: Point = this.mInteraction.snapToGrid(pWorldPosition.x, pWorldPosition.y);
        const lNode: PotatnoDocumentNode<PotatnoUiProject> = this.mManager.graph.addNode(this.mManager.activeFunction, pDefinition, {
            height: 4,
            width: 10,
            x: Math.round(lSnappedPosition.x / lGridSize),
            y: Math.round(lSnappedPosition.y / lGridSize)
        });

        this.mSelectedNodes.clear();
        this.mSelectedNodes.add(lNode);
        this.closeAddNodePopup();
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
     * Update the transient drag wire pushed to the connection layer while a wire is being dragged.
     *
     * @param pEvent - Pointer event from the document.
     * @param pState - Active wire drag state.
     */
    private renderDraggedWire(pEvent: PointerEvent, pState: Extract<GraphInteractionState, { mode: 'dragging-wire'; }>): void {
        const lEndPosition: Point = this.getWorldPointerPosition(pEvent.clientX, pEvent.clientY);
        this.mTempConnection = {
            start: { x: pState.startX, y: pState.startY },
            end: lEndPosition
        };
    }

    /**
     * Reset all interaction state when the rendered function changes (document load or switch).
     */
    private resetForActiveFunction(): void {
        this.mHoveredPort = null;
        this.mInteractionState = { mode: 'idle' };
        this.mSelectedNodes.clear();
        this.mTempConnection = null;
        this.stopDocumentPointerTracking();
        this.closeAddNodePopup();
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

type GraphTempConnection = {
    start: Point;
    end: Point;
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
