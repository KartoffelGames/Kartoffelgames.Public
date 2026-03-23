import { PwbComponent, Processor, PwbExport, PwbComponentEvent, PwbChild, ComponentEventEmitter } from '@kartoffelgames/web-potato-web-builder';
import { PotatnoCanvasInteraction } from '../potatno-canvas-interaction.ts';
import { PotatnoCanvasRenderer, type ConnectionRenderData } from '../potatno-canvas-renderer.ts';
import templateCss from './potatno-canvas.css';
import canvasTemplate from './potatno-canvas.html';

/**
 * Interaction state machine states for pointer handling.
 */
enum InteractionMode {
    DraggingNode = 'draggingNode',
    DraggingWire = 'draggingWire',
    Idle = 'idle',
    Panning = 'panning',
    SelectingBox = 'selectingBox'
}

/**
 * Render data for a node, used to position and identify nodes on the canvas.
 */
export interface NodeRenderData {
    height: number;
    id: string;
    width: number;
    x: number;
    y: number;
}

/**
 * Data emitted when a wire drag completes and connects two ports.
 */
export interface CanvasConnectEvent {
    portKind: string;
    sourceNodeId: string;
    sourcePortId: string;
    targetNodeId: string;
    targetPortId: string;
}

/**
 * Data emitted when a node is moved via drag.
 */
export interface CanvasNodeMoveEvent {
    newX: number;
    newY: number;
    nodeId: string;
}

/**
 * Data emitted when a node is selected.
 */
export interface CanvasNodeSelectEvent {
    additive: boolean;
    nodeId: string;
}

/**
 * Canvas component for the potatno-code visual editor.
 * Provides pan, zoom, node drag, wire drag, and selection box interactions.
 */
@PwbComponent({
    selector: 'potatno-canvas',
    template: canvasTemplate,
    style: templateCss,
})
export class PotatnoCanvas extends Processor {
    // --- Public exported properties ---

    /**
     * Connection render data for all connections in the graph.
     */
    @PwbExport
    public connections: Array<ConnectionRenderData> = [];

    /**
     * Grid size in pixels. Determines snapping resolution and grid pattern.
     */
    @PwbExport
    public gridSize: number = 20;

    /**
     * Node render data for all nodes currently displayed on the canvas.
     */
    @PwbExport
    public nodes: Array<NodeRenderData> = [];

    /**
     * Set of currently selected node IDs.
     */
    @PwbExport
    public selectedNodeIds: Set<string> = new Set<string>();

    // --- Component events ---

    @PwbComponentEvent('canvas-connect')
    private accessor mConnectEvent!: ComponentEventEmitter<CanvasConnectEvent>;

    @PwbComponentEvent('canvas-delete')
    private accessor mDeleteEvent!: ComponentEventEmitter<{ nodeIds: Set<string> }>;

    @PwbComponentEvent('canvas-node-move')
    private accessor mNodeMoveEvent!: ComponentEventEmitter<CanvasNodeMoveEvent>;

    @PwbComponentEvent('canvas-node-select')
    private accessor mNodeSelectEvent!: ComponentEventEmitter<CanvasNodeSelectEvent>;

    @PwbComponentEvent('canvas-select')
    private accessor mSelectEvent!: ComponentEventEmitter<{ nodeIds: Set<string> }>;

    // --- Child refs ---

    @PwbChild('svgLayer')
    private accessor mSvgLayer!: SVGSVGElement;

    @PwbChild('viewport')
    private accessor mViewport!: HTMLDivElement;

    // --- Internal state ---

    private mDragNodeId: string | null = null;
    private mDragStartWorldX: number = 0;
    private mDragStartWorldY: number = 0;
    private readonly mInteraction: PotatnoCanvasInteraction;
    private mMode: InteractionMode = InteractionMode.Idle;
    private mPointerId: number | null = null;
    private readonly mRenderer: PotatnoCanvasRenderer;
    private mWireColor: string = 'var(--pn-accent-primary)';
    private mWirePortKind: string = '';
    private mWireSourceNodeId: string = '';
    private mWireSourcePortId: string = '';
    private mWireStartWorld: { x: number; y: number } = { x: 0, y: 0 };

    /**
     * CSS style string for the grid container element. Includes transform
     * for pan/zoom and background pattern for the dot grid.
     */
    public get gridStyle(): string {
        const lTransform: string = `transform: ${this.mInteraction.getTransformCss()}`;
        const lBackground: string = this.mInteraction.getGridBackgroundCss();
        return `${lTransform}; ${lBackground}`;
    }

    /**
     * CSS style string for the selection box overlay. Positioned in screen
     * coordinates based on the interaction state.
     */
    public get selectionBoxStyle(): string {
        const lStart: { x: number; y: number } | null = this.mInteraction.selectionStart;
        const lEnd: { x: number; y: number } | null = this.mInteraction.selectionEnd;

        if (!lStart || !lEnd) {
            return 'display: none';
        }

        // Convert world coordinates to screen coordinates for display.
        const lScreenStart: { x: number; y: number } = this.mInteraction.worldToScreen(lStart.x, lStart.y);
        const lScreenEnd: { x: number; y: number } = this.mInteraction.worldToScreen(lEnd.x, lEnd.y);

        const lLeft: number = Math.min(lScreenStart.x, lScreenEnd.x);
        const lTop: number = Math.min(lScreenStart.y, lScreenEnd.y);
        const lWidth: number = Math.abs(lScreenEnd.x - lScreenStart.x);
        const lHeight: number = Math.abs(lScreenEnd.y - lScreenStart.y);

        return `left: ${lLeft}px; top: ${lTop}px; width: ${lWidth}px; height: ${lHeight}px`;
    }

    /**
     * Whether the selection box should be visible.
     */
    public get showSelectionBox(): boolean {
        return this.mMode === InteractionMode.SelectingBox
            && this.mInteraction.selectionStart !== null
            && this.mInteraction.selectionEnd !== null;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();
        this.mInteraction = new PotatnoCanvasInteraction(this.gridSize);
        this.mRenderer = new PotatnoCanvasRenderer();
    }

    /**
     * Handle context menu events. Prevents the default browser context menu
     * on the canvas surface.
     *
     * @param pEvent - Context menu event.
     */
    public onContextMenu(pEvent: MouseEvent): void {
        pEvent.preventDefault();
    }

    /**
     * Handle keyboard events on the canvas. Delete and Backspace keys
     * trigger deletion of selected nodes.
     *
     * @param pEvent - Keyboard event.
     */
    public onKeyDown(pEvent: KeyboardEvent): void {
        if (pEvent.key === 'Delete' || pEvent.key === 'Backspace') {
            if (this.selectedNodeIds.size > 0) {
                this.mDeleteEvent.dispatchEvent({ nodeIds: new Set(this.selectedNodeIds) });
            }
        }
    }

    /**
     * Handle pointer down events. Determines the interaction mode based on
     * which mouse button was pressed and what was clicked.
     *
     * - Middle mouse button: panning
     * - Left on a node: node dragging
     * - Left on a port (data-port-id): wire dragging
     * - Left on empty canvas: selection box
     *
     * @param pEvent - Pointer event.
     */
    public onPointerDown(pEvent: PointerEvent): void {
        // Only handle one pointer at a time.
        if (this.mMode !== InteractionMode.Idle) {
            return;
        }

        const lTarget: HTMLElement = pEvent.target as HTMLElement;
        const lRect: DOMRect = this.mViewport.getBoundingClientRect();
        const lScreenX: number = pEvent.clientX - lRect.left;
        const lScreenY: number = pEvent.clientY - lRect.top;

        // Middle mouse button: begin panning.
        if (pEvent.button === 1) {
            this.mMode = InteractionMode.Panning;
            this.mPointerId = pEvent.pointerId;
            this.mViewport.setPointerCapture(pEvent.pointerId);
            this.mViewport.classList.add('panning');
            pEvent.preventDefault();
            return;
        }

        // Left mouse button.
        if (pEvent.button === 0) {
            // Check if the click target is a port element (wire drag).
            const lPortElement: HTMLElement | null = lTarget.closest('[data-port-id]') as HTMLElement | null;
            if (lPortElement) {
                this.beginWireDrag(lPortElement, lScreenX, lScreenY);
                this.mPointerId = pEvent.pointerId;
                this.mViewport.setPointerCapture(pEvent.pointerId);
                pEvent.preventDefault();
                return;
            }

            // Check if the click target is a node element (node drag).
            const lNodeElement: HTMLElement | null = lTarget.closest('[data-node-id]') as HTMLElement | null;
            if (lNodeElement) {
                this.beginNodeDrag(lNodeElement, lScreenX, lScreenY, pEvent.shiftKey || pEvent.ctrlKey || pEvent.metaKey);
                this.mPointerId = pEvent.pointerId;
                this.mViewport.setPointerCapture(pEvent.pointerId);
                pEvent.preventDefault();
                return;
            }

            // Click on empty canvas: begin selection box.
            this.beginSelectionBox(lScreenX, lScreenY);
            this.mPointerId = pEvent.pointerId;
            this.mViewport.setPointerCapture(pEvent.pointerId);
            pEvent.preventDefault();
        }
    }

    /**
     * Handle pointer move events. Updates the active interaction based on
     * the current mode.
     *
     * @param pEvent - Pointer event.
     */
    public onPointerMove(pEvent: PointerEvent): void {
        if (this.mPointerId !== pEvent.pointerId) {
            return;
        }

        const lRect: DOMRect = this.mViewport.getBoundingClientRect();
        const lScreenX: number = pEvent.clientX - lRect.left;
        const lScreenY: number = pEvent.clientY - lRect.top;

        switch (this.mMode) {
            case InteractionMode.Panning:
                this.mInteraction.pan(pEvent.movementX, pEvent.movementY);
                this.updateConnections();
                break;

            case InteractionMode.DraggingNode:
                this.updateNodeDrag(lScreenX, lScreenY);
                break;

            case InteractionMode.DraggingWire:
                this.updateWireDrag(lScreenX, lScreenY);
                break;

            case InteractionMode.SelectingBox:
                this.updateSelectionBox(lScreenX, lScreenY);
                break;
        }
    }

    /**
     * Handle pointer up events. Ends the current interaction and dispatches
     * any resulting events.
     *
     * @param pEvent - Pointer event.
     */
    public onPointerUp(pEvent: PointerEvent): void {
        if (this.mPointerId !== pEvent.pointerId) {
            return;
        }

        const lTarget: HTMLElement = pEvent.target as HTMLElement;

        switch (this.mMode) {
            case InteractionMode.Panning:
                this.mViewport.classList.remove('panning');
                break;

            case InteractionMode.DraggingNode:
                this.endNodeDrag();
                break;

            case InteractionMode.DraggingWire:
                this.endWireDrag(lTarget);
                break;

            case InteractionMode.SelectingBox:
                this.endSelectionBox();
                break;
        }

        // Release pointer and reset mode.
        if (this.mPointerId !== null) {
            this.mViewport.releasePointerCapture(this.mPointerId);
        }
        this.mPointerId = null;
        this.mMode = InteractionMode.Idle;
    }

    /**
     * Handle wheel events for zooming. Zooms toward the mouse position.
     *
     * @param pEvent - Wheel event.
     */
    public onWheel(pEvent: WheelEvent): void {
        pEvent.preventDefault();

        const lRect: DOMRect = this.mViewport.getBoundingClientRect();
        const lScreenX: number = pEvent.clientX - lRect.left;
        const lScreenY: number = pEvent.clientY - lRect.top;

        this.mInteraction.zoomAt(lScreenX, lScreenY, pEvent.deltaY);
        this.updateConnections();
    }

    /**
     * Trigger a full re-render of the SVG connection layer.
     * Call this after nodes move, connections change, or the viewport transforms.
     */
    public updateConnections(): void {
        this.mRenderer.renderConnections(this.mSvgLayer, this.connections);
    }

    /**
     * Begin dragging a node. Selects the node and records the starting world
     * position for calculating deltas.
     */
    private beginNodeDrag(pNodeElement: HTMLElement, pScreenX: number, pScreenY: number, pAdditive: boolean): void {
        const lNodeId: string | undefined = pNodeElement.dataset['nodeId'];
        if (!lNodeId) {
            return;
        }

        this.mMode = InteractionMode.DraggingNode;
        this.mDragNodeId = lNodeId;

        const lWorld: { x: number; y: number } = this.mInteraction.screenToWorld(pScreenX, pScreenY);
        this.mDragStartWorldX = lWorld.x;
        this.mDragStartWorldY = lWorld.y;

        // Dispatch node selection event.
        this.mNodeSelectEvent.dispatchEvent({ nodeId: lNodeId, additive: pAdditive });
    }

    /**
     * Begin selection box interaction. Records the starting world position.
     */
    private beginSelectionBox(pScreenX: number, pScreenY: number): void {
        this.mMode = InteractionMode.SelectingBox;

        const lWorld: { x: number; y: number } = this.mInteraction.screenToWorld(pScreenX, pScreenY);
        this.mInteraction.setSelectionStart(lWorld.x, lWorld.y);
        this.mInteraction.setSelectionEnd(lWorld.x, lWorld.y);
    }

    /**
     * Begin wire dragging from a port element. Records the port identity
     * and world-space start position.
     */
    private beginWireDrag(pPortElement: HTMLElement, pScreenX: number, pScreenY: number): void {
        this.mMode = InteractionMode.DraggingWire;
        this.mWireSourceNodeId = pPortElement.dataset['nodeId'] ?? '';
        this.mWireSourcePortId = pPortElement.dataset['portId'] ?? '';
        this.mWirePortKind = pPortElement.dataset['portKind'] ?? '';
        this.mWireColor = pPortElement.dataset['portColor'] ?? 'var(--pn-accent-primary)';

        const lWorld: { x: number; y: number } = this.mInteraction.screenToWorld(pScreenX, pScreenY);
        this.mWireStartWorld = { x: lWorld.x, y: lWorld.y };
    }

    /**
     * End node dragging. Snaps the final position to the grid and dispatches
     * a move event.
     */
    private endNodeDrag(): void {
        if (!this.mDragNodeId) {
            return;
        }

        // Find the current node data to get its latest position.
        const lNode: NodeRenderData | undefined = this.nodes.find((pNode: NodeRenderData) => pNode.id === this.mDragNodeId);
        if (lNode) {
            const lSnapped: { x: number; y: number } = this.mInteraction.snapToGrid(lNode.x, lNode.y);
            this.mNodeMoveEvent.dispatchEvent({
                nodeId: this.mDragNodeId,
                newX: lSnapped.x,
                newY: lSnapped.y
            });
        }

        this.mDragNodeId = null;
    }

    /**
     * End selection box interaction. Determines which nodes fall inside the
     * box and dispatches a select event.
     */
    private endSelectionBox(): void {
        const lStart: { x: number; y: number } | null = this.mInteraction.selectionStart;
        const lEnd: { x: number; y: number } | null = this.mInteraction.selectionEnd;

        if (lStart && lEnd) {
            const lMinX: number = Math.min(lStart.x, lEnd.x);
            const lMinY: number = Math.min(lStart.y, lEnd.y);
            const lMaxX: number = Math.max(lStart.x, lEnd.x);
            const lMaxY: number = Math.max(lStart.y, lEnd.y);

            // Find all nodes whose bounds intersect the selection rectangle.
            const lSelected: Set<string> = new Set<string>();
            for (const lNode of this.nodes) {
                const lNodeRight: number = lNode.x + lNode.width;
                const lNodeBottom: number = lNode.y + lNode.height;

                // Intersection test: node rect overlaps selection rect.
                if (lNode.x < lMaxX && lNodeRight > lMinX && lNode.y < lMaxY && lNodeBottom > lMinY) {
                    lSelected.add(lNode.id);
                }
            }

            this.mSelectEvent.dispatchEvent({ nodeIds: lSelected });
        }

        this.mInteraction.clearSelection();
    }

    /**
     * End wire dragging. If the pointer is over a valid target port, dispatch
     * a connect event.
     */
    private endWireDrag(pTarget: HTMLElement): void {
        this.mRenderer.clearTempConnection(this.mSvgLayer);

        // Check if we ended on a port element.
        const lTargetPort: HTMLElement | null = pTarget.closest('[data-port-id]') as HTMLElement | null;
        if (lTargetPort) {
            const lTargetNodeId: string = lTargetPort.dataset['nodeId'] ?? '';
            const lTargetPortId: string = lTargetPort.dataset['portId'] ?? '';

            // Only dispatch if the source and target are different ports.
            if (lTargetNodeId && lTargetPortId && (lTargetNodeId !== this.mWireSourceNodeId || lTargetPortId !== this.mWireSourcePortId)) {
                this.mConnectEvent.dispatchEvent({
                    sourceNodeId: this.mWireSourceNodeId,
                    sourcePortId: this.mWireSourcePortId,
                    targetNodeId: lTargetNodeId,
                    targetPortId: lTargetPortId,
                    portKind: this.mWirePortKind
                });
            }
        }

        // Reset wire state.
        this.mWireSourceNodeId = '';
        this.mWireSourcePortId = '';
        this.mWirePortKind = '';
    }

    /**
     * Update the node position during a drag operation. Calculates the delta
     * in world space and dispatches intermediate move events.
     */
    private updateNodeDrag(pScreenX: number, pScreenY: number): void {
        if (!this.mDragNodeId) {
            return;
        }

        const lWorld: { x: number; y: number } = this.mInteraction.screenToWorld(pScreenX, pScreenY);
        const lDeltaX: number = lWorld.x - this.mDragStartWorldX;
        const lDeltaY: number = lWorld.y - this.mDragStartWorldY;

        // Update the drag start for the next move delta.
        this.mDragStartWorldX = lWorld.x;
        this.mDragStartWorldY = lWorld.y;

        // Find and update the node position in the render data.
        const lNode: NodeRenderData | undefined = this.nodes.find((pNode: NodeRenderData) => pNode.id === this.mDragNodeId);
        if (lNode) {
            this.mNodeMoveEvent.dispatchEvent({
                nodeId: this.mDragNodeId,
                newX: lNode.x + lDeltaX,
                newY: lNode.y + lDeltaY
            });
        }

        this.updateConnections();
    }

    /**
     * Update the selection box end position during a box-select drag.
     */
    private updateSelectionBox(pScreenX: number, pScreenY: number): void {
        const lWorld: { x: number; y: number } = this.mInteraction.screenToWorld(pScreenX, pScreenY);
        this.mInteraction.setSelectionEnd(lWorld.x, lWorld.y);
    }

    /**
     * Update the temporary wire connection path during a wire drag.
     */
    private updateWireDrag(pScreenX: number, pScreenY: number): void {
        const lWorld: { x: number; y: number } = this.mInteraction.screenToWorld(pScreenX, pScreenY);
        this.mRenderer.renderTempConnection(
            this.mSvgLayer,
            this.mWireStartWorld,
            lWorld,
            this.mWireColor
        );
    }
}
