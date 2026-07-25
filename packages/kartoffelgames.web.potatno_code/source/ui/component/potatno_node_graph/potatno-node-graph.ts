import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbComponent, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoNodeSelectionPopupComponent } from '../potatno-node-selection-popup/potatno-node-selection-popup-component.ts';
import { PotatnoConnectionLayerComponent } from '../potatno_connection_layer/potatno-connection-layer-component.ts';
import { PotatnoNodeComponent, type PotatnoNodeComponentMove } from '../potatno_node_component/potatno-node-component.ts';
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
    private readonly mUnsubscribeFunctionChange: PotatnoCodeUiManagerUnsubscribe;
    private readonly mUnsubscribeGraphChange: PotatnoCodeUiManagerUnsubscribe;

    /**
     * Version token that refreshes transform-bound template styles.
     */
    @ComponentState.state()
    private accessor mTransformVersion: number = 0;

    /**
     * Screen-space bounds of the drag selection box. Reassigned (never mutated in place) on each
     * selecting pointer move so the bound `selectionBoxStyle` re-renders and the box tracks the cursor.
     */
    @ComponentState.state({ complexValue: true })
    private accessor mSelectionBoxScreen: SelectionBoxScreen | null;

    /**
     * State for the add-node popup opened from the graph context menu.
     */
    @ComponentState.state()
    public accessor popupPosition: PotatnoNodeGraphNodeSelectionPopupPosition | null;

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
     * Whether the selection box should be rendered.
     */
    public get showSelectionBox(): boolean {
        return this.mSelectionBoxScreen !== null;
    }

    /**
     * Style for the current drag selection box.
     */
    public get selectionBoxStyle(): string {
        if (!this.mSelectionBoxScreen) {
            return '';
        }

        const lX: number = Math.min(this.mSelectionBoxScreen.x1, this.mSelectionBoxScreen.x2);
        const lY: number = Math.min(this.mSelectionBoxScreen.y1, this.mSelectionBoxScreen.y2);
        const lW: number = Math.abs(this.mSelectionBoxScreen.x2 - this.mSelectionBoxScreen.x1);
        const lH: number = Math.abs(this.mSelectionBoxScreen.y2 - this.mSelectionBoxScreen.y1);
        return `left: ${lX}px; top: ${lY}px; width: ${lW}px; height: ${lH}px`;
    }

    /**
     * Node view states rendered by the template.
     */
    public get nodes(): ReadonlySet<PotatnoDocumentNode<PotatnoProjectTypesDefinition>> {
        if (!this.mManager.activeFunction) {
            return new Set<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>();
        }

        return this.mManager.activeFunction.nodes;
    }

    public get selectedNode(): ReadonlySet<PotatnoDocumentNode<PotatnoProjectTypesDefinition>> {
        return this.mSelectedNodes;
    }

    /**
     * Create the graph component and its local interaction state.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mComponent = pComponent;
        this.mDocumentPointerMoveHandler = null;
        this.mDocumentPointerUpHandler = null;
        this.mInteractionState = { mode: 'idle' };
        this.mKeyboardHandler = null;
        this.mManager = pManager;
        this.mSelectedNodes = new Set<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>();
        this.popupPosition = null;
        this.mSelectionBoxScreen = null;

        // Add user events directly to the component element.
        pComponent.element.addEventListener('pointerdown', (pEvent) => { this.onCanvasPointerDown(pEvent); });
        pComponent.element.addEventListener('wheel', (pEvent) => { this.onCanvasWheel(pEvent); });
        pComponent.element.addEventListener('contextmenu', (pEvent) => { this.onContextMenu(pEvent); });

        // Reset current interactions when the document or the active function changes.
        this.mUnsubscribeFunctionChange = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.SpecialActiveFunction, () => {
            this.popupPosition = null;
            this.mInteractionState = { mode: 'idle' };
            this.mSelectedNodes.clear();
            this.stopDocumentPointerTracking();

            this.mComponent.updater.updateAsync();
        });

        // On adding or deletion of nodes, only update the view, nothing more.
        this.mUnsubscribeGraphChange = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.NodeAdd | PotatnoCodeUiManagerChangeType.NodeDelete, () => {
            this.mComponent.updater.updateAsync();
        });
    }

    /**
     * Register global graph listeners and subscribe to manager changes.
     */
    public onConnect(): void {
        // Set this element as main grid element.
        this.mManager.connections.gridElement = this.mComponent.element;

        this.mKeyboardHandler = (pEvent: KeyboardEvent) => this.onKeyDown(pEvent);
        document.addEventListener('keydown', this.mKeyboardHandler);
    }

    /**
     * Remove graph listeners and pending frame work.
     */
    public onDeconstruct(): void {
        this.stopDocumentPointerTracking();

        this.mUnsubscribeFunctionChange();
        this.mUnsubscribeGraphChange();

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
        this.popupPosition = null;

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
        }

        const lLocalPosition: Point = this.getLocalPointerPosition(pEvent.clientX, pEvent.clientY);
        this.mInteractionState = { mode: 'selecting' };
        this.mSelectionBoxScreen = {
            x1: lLocalPosition.x,
            x2: lLocalPosition.x,
            y1: lLocalPosition.y,
            y2: lLocalPosition.y
        };
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
     * Insert the node definition chosen in the add-node popup at the popup's world position.
     *
     * @param pEvent - Component event carrying the selected node definition.
     */
    public createNodeOnPopupPosition(pDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition>): void {
        if (!this.mManager.activeFunction || !this.popupPosition) {
            return;
        }

        // Create new on the popups grid position.
        const lNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> = this.mManager.graph.addNode(this.mManager.activeFunction, pDefinition, {
            x: this.popupPosition.grid.x,
            y: this.popupPosition.grid.y,

            // Let the auto min size do the work.
            height: 0,
            width: 0
        });

        // Close popup after popup position information was used.
        this.popupPosition = null;

        // After creation, select the new node as sole node.
        this.mSelectedNodes.clear();
        this.mSelectedNodes.add(lNode);
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

        if (lState.mode === 'selecting') {
            if (!this.mSelectionBoxScreen) {
                return;
            }

            const lLocalPosition: Point = this.getLocalPointerPosition(pEvent.clientX, pEvent.clientY);
            this.mSelectionBoxScreen = {
                x1: this.mSelectionBoxScreen.x1,
                x2: lLocalPosition.x,
                y1: this.mSelectionBoxScreen.y1,
                y2: lLocalPosition.y
            };
            return;
        }
    }

    /**
     * Finish the active document-level pointer interaction.
     */
    private onDocumentPointerUp(): void {
        const lState: GraphInteractionState = this.mInteractionState;

        if (lState.mode === 'selecting') {
            if (!this.mSelectionBoxScreen) {
                return;
            }

            this.selectNodesInBox(this.mSelectionBoxScreen);
            this.mSelectionBoxScreen = null;
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

        if (pEvent.key === 'Escape' && this.popupPosition) {
            this.popupPosition = null;
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
     * Move all selected nodes into the same direction.
     * The source node is not moved.
     * 
     * @param pSourceNode - Node that initialized the movement.
     * @param pMovement - The movement distance.
     */
    public moveAllSelected(pSourceNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>, pMovement: PotatnoNodeComponentMove): void {
        // Iterate and move all selected nodes.
        for (const lSelectedNode of this.mSelectedNodes) {
            // Skip moving the source node.
            if (lSelectedNode === pSourceNode) {
                continue;
            }

            // Move the selected node in the move direction.
            this.mManager.graph.transformNode(lSelectedNode, (pNode) => {
                pNode.moveTo(pNode.transformation.x + pMovement.x, pNode.transformation.y + pMovement.y);
            });
        }
    }

    /**
     * Handle pointer down on a rendered node for selection and dragging.
     *
     * @param pEvent - Pointer event from the node element.
     * @param pNode - Node that received the pointer down.
     */
    public selectNode(pEvent: PointerEvent, pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): void {
        pEvent.stopPropagation();
        this.popupPosition = null;

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

        this.mComponent.updater.updateAsync();
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

        const lMaxX: number = Math.max(0, lWrapper.clientWidth - PotatnoNodeSelectionPopupComponent.POPUP_WIDTH - 8);
        const lMaxY: number = Math.max(0, lWrapper.clientHeight - PotatnoNodeSelectionPopupComponent.POPUP_HEIGHT - 8);

        const lGridSize: number = this.mManager.grid.gridSize;
        const lWorldPosition: Point = this.mManager.grid.screenToWorld(lLocalPosition.x, lLocalPosition.y);
        const lSnappedPosition: Point = this.mManager.grid.snapToGrid(lWorldPosition.x, lWorldPosition.y);

        this.popupPosition = {
            screenX: Math.max(8, Math.min(lLocalPosition.x, lMaxX)),
            screenY: Math.max(8, Math.min(lLocalPosition.y, lMaxY)),
            grid: {
                x: Math.floor(lSnappedPosition.x / lGridSize),
                y: Math.floor(lSnappedPosition.y / lGridSize)
            }
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
     * Select all nodes intersecting the current selection box.
     */
    private selectNodesInBox(pBox: SelectionBoxScreen): void {
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            return;
        }

        const lTopLeft: Point = this.mManager.grid.screenToWorld(
            Math.min(pBox.x1, pBox.x2),
            Math.min(pBox.y1, pBox.y2)
        );
        const lBottomRight: Point = this.mManager.grid.screenToWorld(
            Math.max(pBox.x1, pBox.x2),
            Math.max(pBox.y1, pBox.y2)
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
    selected: boolean;
};

type GraphInteractionState =
    | { mode: 'idle'; }
    | { mode: 'panning'; startX: number; startY: number; }
    | { mode: 'selecting'; };

type PotatnoNodeGraphNodeSelectionPopupPosition = {
    screenX: number;
    screenY: number;
    grid: {
        x: number;
        y: number;
    };
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
