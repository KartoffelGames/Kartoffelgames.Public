import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbComponent, type ComponentEvent, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoNodeSelectionPopupComponent } from '../potatno-node-selection-popup/potatno-node-selection-popup-component.ts';
import { PotatnoConnectionLayerComponent } from '../potatno_connection_layer/potatno-connection-layer-component.ts';
import { PotatnoNodeComponent } from '../potatno_node_component/potatno-node-component.ts';
import graphCss from './potatno-node-graph.css' with { type: 'text' };
import graphTemplate from './potatno-node-graph.html' with { type: 'text' };

/**
 * Interactive node graph for the active Potatno document function.
 *
 * Owns only graph-local interaction state — pan/zoom, selection, node dragging, wire dragging and
 * the clipboard. The add-node popup and the SVG connection layer are delegated to their own child
 * components ({@link PotatnoAddNodePopup}, {@link PotatnoConnectionLayerComponent}). The document it renders,
 * the active function, validation errors and the per-node preview elements all come from the shared
 * {@link PotatnoUiManager}; every document mutation is routed back through the manager so history,
 * validation and preview rebuilds stay centralized. The graph refreshes by subscribing to manager
 * events instead of receiving refresh tokens through template bindings.
 */
@PwbComponent({
    selector: 'potatno-node-graph',
    template: graphTemplate,
    style: graphCss,
    components: [PotatnoNodeSelectionPopupComponent, PotatnoNodeComponent, PotatnoConnectionLayerComponent,]
})
export class PotatnoNodeGraph implements IComponentOnConnect, IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private readonly mSelectedNodes: Set<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>;
    private mDocumentPointerMoveHandler: ((pEvent: PointerEvent) => void) | null;
    private mDocumentPointerUpHandler: ((pEvent: PointerEvent) => void) | null;
    private mInteractionState: GraphInteractionState;
    private mKeyboardHandler: ((pEvent: KeyboardEvent) => void) | null;
    private mUnsubscribe: PotatnoCodeUiManagerUnsubscribe | null;

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
     * Create the graph component and its local interaction state.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mCachedGraphData = { visibleNodes: [] };
        this.mComponent = pComponent;
        this.mDocumentPointerMoveHandler = null;
        this.mDocumentPointerUpHandler = null;
        this.mInteractionState = { mode: 'idle' };
        this.mKeyboardHandler = null;
        this.mManager = pManager;
        this.mSelectedNodes = new Set<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>();
        this.mUnsubscribe = null;

        // Add user events directly to the component element.
        pComponent.element.addEventListener('pointerdown', (pEvent) => { this.onCanvasPointerDown(pEvent); });
        pComponent.element.addEventListener('wheel', (pEvent) => { this.onCanvasWheel(pEvent); });
        pComponent.element.addEventListener('contextmenu', (pEvent) => { this.onContextMenu(pEvent); });
    }

    /**
     * Grid background style for the current graph transform.
     */
    public get gridBackgroundStyle(): string {
        void this.mTransformVersion;
        return this.mManager.grid.getGridBackgroundCss();
    }

    /**
     * CSS transform style for the graph content layer.
     */
    public get gridTransformStyle(): string {
        void this.mTransformVersion;
        return 'transform: ' + this.mManager.grid.getTransformCss();
    }

    /**
     * Grid size in pixels passed to node components.
     */
    public get gridSize(): number {
        return this.mManager.grid.gridSize;
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
        // Set this element as main grid element.
        this.mManager.connections.gridElement = this.mComponent.element;

        this.mKeyboardHandler = (pEvent: KeyboardEvent) => this.onKeyDown(pEvent);
        document.addEventListener('keydown', this.mKeyboardHandler);

        // Refresh the graph whenever the document, active function, or graph structure changes.
        // A document load or function switch resets all interaction state first.
        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.SpecialActiveFunction | PotatnoCodeUiManagerChangeType.Node | PotatnoCodeUiManagerChangeType.Connection, (pEvent) => {
            if ((pEvent.changeType & PotatnoCodeUiManagerChangeType.Document) > 0 || (pEvent.changeType & PotatnoCodeUiManagerChangeType.Function) > 0 || (pEvent.changeType & PotatnoCodeUiManagerChangeType.SpecialActiveFunction) > 0) {
                this.resetForActiveFunction();
            }

            this.invalidateGraphContent();

            this.mComponent.updater.updateAsync();
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
        this.mManager.grid.zoomAt(
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
    public onNodePointerDown(pEvent: PointerEvent, pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): void {
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

        const lGridSize: number = this.mManager.grid.gridSize;
        const lOrigins: Map<PotatnoDocumentNode<PotatnoProjectTypesDefinition>, NodeDragOrigin> = new Map<PotatnoDocumentNode<PotatnoProjectTypesDefinition>, NodeDragOrigin>();

        for (const lNode of this.mSelectedNodes) {
            lOrigins.set(lNode, {
                originX: lNode.transformation.x * lGridSize,
                originY: lNode.transformation.y * lGridSize
            });
        }

        // if (pNode.category === NodeCategory.Comment) {
        //     this.addCommentContainedNodeOrigins(pNode, lOrigins);
        // }

        this.mInteractionState = {
            mode: 'dragging-node',
            origins: lOrigins,
            startX: pEvent.clientX,
            startY: pEvent.clientY
        };
        this.startDocumentPointerTracking();
    }

    /**
     * Insert the node definition chosen in the add-node popup at the popup's world position.
     *
     * @param pEvent - Component event carrying the selected node definition.
     */
    public onAddNodePopupNodeSelect(pEvent: ComponentEvent<PotatnoNodeDefinition<PotatnoProjectTypesDefinition>>): void {
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
            this.mManager.grid.pan(pEvent.clientX - lState.startX, pEvent.clientY - lState.startY);
            lState.startX = pEvent.clientX;
            lState.startY = pEvent.clientY;
            this.mTransformVersion++;
            return;
        }

        if (lState.mode === 'dragging-node') {
            this.dragSelectedNodes(pEvent, lState);
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
    }

    /**
     * Finish the active document-level pointer interaction.
     */
    private onDocumentPointerUp(): void {
        const lState: GraphInteractionState = this.mInteractionState;

        if (lState.mode === 'selecting') {
            this.mShowSelectionBox = false;
            this.selectNodesInBox();
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

        if (pEvent.key === 'Escape' && this.mAddNodePopup) {
            this.closeAddNodePopup();
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
            this.mManager.clipboard.copy(this.mSelectedNodes);
            return;
        }

        if (pEvent.ctrlKey && pEvent.key === 'v') {
            pEvent.preventDefault();
            this.pasteFromClipboard();
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
     * Calculate the minimum rendered height of a node in grid cells.
     *
     * @param pNode - Node whose layout height should be calculated.
     *
     * @returns The minimum height in grid cells.
     */
    private calculateNodeGridHeight(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): number {
        const lPortRows: number = Math.max(pNode.inputs.list.length, pNode.outputs.list.length, 1);
        return 1 + lPortRows;
    }

    /**
     * Delete the selected nodes from the active graph.
     * System entry/exit nodes can be deleted too; they are re-synced automatically on the next validation.
     */
    private deleteSelectedNodes(): void {
        for (const lNode of this.mSelectedNodes) {
            this.mManager.graph.removeNode(lNode);
        }

        this.mSelectedNodes.clear();
    }

    /**
     * Drag the selected nodes according to the current pointer position.
     *
     * @param pEvent - Pointer event from the document.
     * @param pState - Active node drag state.
     */
    private dragSelectedNodes(pEvent: PointerEvent, pState: Extract<GraphInteractionState, { mode: 'dragging-node'; }>): void {
        const lZoom: number = this.mManager.grid.zoom;
        const lGridSize: number = this.mManager.grid.gridSize;
        const lDx: number = (pEvent.clientX - pState.startX) / lZoom;
        const lDy: number = (pEvent.clientY - pState.startY) / lZoom;

        // Move each dragged node through the manager so the connection layer redraws its wires to follow.
        for (const [lNode, lOrigin] of pState.origins) {
            const lSnapped: Point = this.mManager.grid.snapToGrid(lOrigin.originX + lDx, lOrigin.originY + lDy);
            this.mManager.graph.transformNode(lNode, (pNode) => {
                pNode.moveTo(Math.round(lSnapped.x / lGridSize), Math.round(lSnapped.y / lGridSize));
            });
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
     * Calculate pointer coordinates relative to the graph wrapper.
     *
     * @param pClientX - Viewport X coordinate.
     * @param pClientY - Viewport Y coordinate.
     *
     * @returns Local graph wrapper coordinates.
     */
    private getLocalPointerPosition(pClientX: number, pClientY: number): Point {
        const lRect: DOMRect = this.mComponent.element.getBoundingClientRect();
        return { x: pClientX - lRect.left, y: pClientY - lRect.top };
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
    private insertNodeAt(pDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition>, pWorldPosition: Point): void {
        if (!this.mManager.activeFunction) {
            return;
        }

        const lGridSize: number = this.mManager.grid.gridSize;
        const lSnappedPosition: Point = this.mManager.grid.snapToGrid(pWorldPosition.x, pWorldPosition.y);
        const lNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> = this.mManager.graph.addNode(this.mManager.activeFunction, pDefinition, {
            x: Math.round(lSnappedPosition.x / lGridSize),
            y: Math.round(lSnappedPosition.y / lGridSize),

            // let the auto min size do the work.
            height: 0,
            width: 0
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
    private insertNodeFromAddPopup(pDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition>): void {
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
        const lWrapper: HTMLElement = this.mComponent.element;
        const lLocalPosition: Point = this.getLocalPointerPosition(pClientX, pClientY);
        const lWorldPosition: Point = this.mManager.grid.screenToWorld(lLocalPosition.x, lLocalPosition.y);
        const lPopupWidth: number = 280;
        const lPopupHeight: number = 320;
        const lMaxX: number = Math.max(0, (lWrapper.clientWidth ?? lPopupWidth) - lPopupWidth - 8);
        const lMaxY: number = Math.max(0, (lWrapper.clientHeight ?? lPopupHeight) - lPopupHeight - 8);

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
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            return;
        }

        const lNewNodes: Array<PotatnoDocumentNode<PotatnoProjectTypesDefinition>> = this.mManager.clipboard.paste();
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
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;

        if (lActiveFunction) {
            const lGridSize: number = this.mManager.grid.gridSize;
            for (const lNode of lActiveFunction.nodes) {
                const lHeight: number = Math.max(lNode.transformation.height, this.calculateNodeGridHeight(lNode));
                lVisibleNodes.push({
                    node: lNode,
                    pixelH: lHeight * lGridSize,
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
        const lGridSize: number = this.mManager.grid.gridSize;
        this.mCachedGraphData = {
            visibleNodes: this.mCachedGraphData.visibleNodes.map((pState: NodeViewState) => ({
                node: pState.node,
                pixelH: Math.max(pState.node.transformation.height, this.calculateNodeGridHeight(pState.node)) * lGridSize,
                pixelW: pState.node.transformation.width * lGridSize,
                pixelX: pState.node.transformation.x * lGridSize,
                pixelY: pState.node.transformation.y * lGridSize,
                selected: pState.selected
            }))
        };
    }

    /**
     * Reset all interaction state when the rendered function changes (document load or switch).
     */
    private resetForActiveFunction(): void {
        this.mInteractionState = { mode: 'idle' };
        this.mSelectedNodes.clear();
        this.stopDocumentPointerTracking();
        this.closeAddNodePopup();
    }

    /**
     * Select all nodes intersecting the current selection box.
     */
    private selectNodesInBox(): void {
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            return;
        }

        const lTopLeft: Point = this.mManager.grid.screenToWorld(
            Math.min(this.mSelectionBoxScreen.x1, this.mSelectionBoxScreen.x2),
            Math.min(this.mSelectionBoxScreen.y1, this.mSelectionBoxScreen.y2)
        );
        const lBottomRight: Point = this.mManager.grid.screenToWorld(
            Math.max(this.mSelectionBoxScreen.x1, this.mSelectionBoxScreen.x2),
            Math.max(this.mSelectionBoxScreen.y1, this.mSelectionBoxScreen.y2)
        );
        const lGridSize: number = this.mManager.grid.gridSize;

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
        this.mDocumentPointerUpHandler = () => this.onDocumentPointerUp();
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
    node: PotatnoDocumentNode<PotatnoProjectTypesDefinition>;
    pixelH: number;
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
    | { mode: 'dragging-node'; startX: number; startY: number; origins: Map<PotatnoDocumentNode<PotatnoProjectTypesDefinition>, NodeDragOrigin>; }
    | { mode: 'selecting'; };

type AddNodePopupState = {
    screenX: number;
    screenY: number;
    worldX: number;
    worldY: number;
};

type NodeDragOrigin = {
    originX: number;
    originY: number;
};

type Point = {
    x: number;
    y: number;
};

type SelectionBoxScreen = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};
