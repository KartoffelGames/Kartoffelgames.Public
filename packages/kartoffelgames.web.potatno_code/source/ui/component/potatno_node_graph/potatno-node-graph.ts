import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbComponent, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import { PotatnoCommentNodeDefinition } from "../../../project/node_definition/potatno-comment-node-definition.ts";
import { PotatnoFlowConjunctionNodeDefinition } from "../../../project/node_definition/potatno-flow-conjunction-node-definition.ts";
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import { PotatnoValueConjunctionNodeDefinition } from "../../../project/node_definition/potatno-value-conjunction-node-definition.ts";
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoNodeSelectionPopupComponent } from '../potatno-node-selection-popup/potatno-node-selection-popup-component.ts';
import { PotatnoCommentNodeComponent } from "../potatno_comment-node/potatno-comment-node-component.ts";
import { PotatnoConnectionLayerComponent } from '../potatno_connection_layer/potatno-connection-layer-component.ts';
import { PotatnoNodeComponent, type PotatnoNodeComponentMove } from '../potatno_node_component/potatno-node-component.ts';
import graphCss from './potatno-node-graph.css' with { type: 'text' };
import graphTemplate from './potatno-node-graph.html' with { type: 'text' };

/**
 * Interactive node graph for the active Potatno document function.
 * 
 * A little wierd and intertwined on how and when the ui updates.
 */
@PwbComponent({
    selector: 'potatno-node-graph',
    template: graphTemplate,
    style: graphCss,
    components: [PotatnoNodeSelectionPopupComponent, PotatnoNodeComponent, PotatnoCommentNodeComponent, PotatnoConnectionLayerComponent,]
})
export class PotatnoNodeGraph implements IComponentOnConnect, IComponentOnDeconstruct {
    private static readonly ZOOM_STRENGTH: number = 0.1;

    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private readonly mSelectedNodes: Set<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>;
    private readonly mKeyboardHandler: (pEvent: KeyboardEvent) => void;
    private mIsMouseInsideGrid: boolean;
    private readonly mUnsubscribeFunctionChange: PotatnoCodeUiManagerUnsubscribe;
    private readonly mUnsubscribeGraphChange: PotatnoCodeUiManagerUnsubscribe;

    /**
     * Screen-space rectangle of the drag selection box (top-left position and size). Reassigned
     * (never mutated in place) on each selecting pointer move so the bound template style re-renders
     * and the box tracks the cursor.
     */
    @ComponentState.state({ complexValue: true })
    public accessor selectBox: PotatnoNodeGraphComponentSelectBox | null;

    /**
     * State for the add-node popup opened from the graph context menu.
     */
    @ComponentState.state()
    public accessor popupPosition: PotatnoNodeGraphComponentNodeSelectionPopupPosition | null;

    /**
     * Grid background style for the current graph transform.
     */
    public get gridBackgroundStyle(): string {
        const lScaledGrid: number = this.mManager.grid.gridSize * this.mManager.grid.zoom;
        const lOffsetX: number = this.mManager.grid.panX % lScaledGrid;
        const lOffsetY: number = this.mManager.grid.panY % lScaledGrid;

        return `background-size: ${lScaledGrid}px ${lScaledGrid}px; background-position: ${lOffsetX}px ${lOffsetY}px;`;
    }

    /**
     * CSS transform style for the graph content layer.
     */
    public get gridTransformStyle(): string {
        return `transform: translate(${this.mManager.grid.panX}px, ${this.mManager.grid.panY}px) scale(${this.mManager.grid.zoom})`;
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

    /**
     * Current selected nodes.
     */
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
        this.mManager = pManager;
        this.mSelectedNodes = new Set<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>();

        this.mIsMouseInsideGrid = false;
        this.popupPosition = null;
        this.selectBox = null;

        // Add user events directly to the component element.
        pComponent.element.addEventListener('pointerdown', (pEvent) => { this.onPointerDown(pEvent); });
        pComponent.element.addEventListener('wheel', (pEvent) => { this.onScroll(pEvent); });

        // Suppress the native menu; the right-click interaction itself is handled in the pointerdown.
        pComponent.element.addEventListener('contextmenu', (pEvent) => { pEvent.preventDefault(); });

        // Track pointer presence so keyboard shortcuts only target the hovered graph, allowing multiple potatno instances on a single page.
        pComponent.element.addEventListener('pointerenter', () => { this.mIsMouseInsideGrid = true; });
        pComponent.element.addEventListener('pointerleave', () => { this.mIsMouseInsideGrid = false; });

        this.mKeyboardHandler = (pEvent: KeyboardEvent) => {
            this.onKeyDown(pEvent);
        };
        document.addEventListener('keydown', this.mKeyboardHandler);

        // Reset current interactions when the document or the active function changes.
        this.mUnsubscribeFunctionChange = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.SpecialActiveFunction, () => {
            this.popupPosition = null;
            this.selectBox = null;
            this.clearSelection();
        });

        // On adding or deletion of nodes, only update the view, nothing more.
        this.mUnsubscribeGraphChange = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.NodeAdd | PotatnoCodeUiManagerChangeType.NodeDelete | PotatnoCodeUiManagerChangeType.SpecialGrid, () => {
            this.mComponent.updater.updateAsync();
        });
    }

    /**
     * Register global graph listeners and subscribe to manager changes.
     */
    public onConnect(): void {
        // Set this element as main grid element.
        this.mManager.connections.gridElement = this.mComponent.element;
    }

    /**
     * Remove graph listeners and pending frame work.
     */
    public onDeconstruct(): void {
        this.mUnsubscribeFunctionChange();
        this.mUnsubscribeGraphChange();

        document.removeEventListener('keydown', this.mKeyboardHandler);
    }

    /**
     * Handle pointer down on empty graph space for panning, selection or the add-node popup.
     *
     * @param pEvent - Pointer event from the graph wrapper.
     */
    private onPointerDown(pEvent: PointerEvent): void {
        this.popupPosition = null;

        switch (pEvent.button) {
            // Left click.
            case 0: {
                // Clear selection
                if (!pEvent.ctrlKey) {
                    this.clearSelection();
                }

                // Start a selection box.
                this.pointerDrag(pEvent, 'selecting');
                return;
            }

            // Middle click.
            case 1: {
                pEvent.preventDefault();
                this.pointerDrag(pEvent, 'panning');
                return;
            }

            // Right click.
            case 2: {
                this.openAddNodePopupAtPointer(pEvent.clientX, pEvent.clientY);
                return;
            }
        }
    }

    /**
     * Handle wheel zoom on the graph.
     *
     * @param pEvent - Wheel event from the graph wrapper.
     */
    private onScroll(pEvent: WheelEvent): void {
        pEvent.preventDefault();

        // Get zoom direction and set a zoom strength constant.
        const lZoomDirection: number = pEvent.deltaY > 0 ? -1 : 1;

        // Zoom away or to the mouse position.
        const lLocalPosition: PotatnoNodeGraphComponentPoint = this.convertGlobalToGridPosition(pEvent.clientX, pEvent.clientY);
        this.mManager.grid.zoomAt(lLocalPosition.x, lLocalPosition.y, lZoomDirection * PotatnoNodeGraph.ZOOM_STRENGTH);
    }

    /**
     * Insert the node definition chosen in the add-node popup at the popup's world position.
     *
     * @param pEvent - Component event carrying the selected node definition.
     */
    public createNodeOnPopupPosition(pDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition>): void {
        if (!this.mManager.activeFunction) {
            return;
        }

        // Create new on the popups grid position.
        const lNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> = this.mManager.graph.addNode(this.mManager.activeFunction, pDefinition, {
            x: this.popupPosition?.grid.x ?? 0,
            y: this.popupPosition?.grid.y ?? 0,

            // Let the auto min size do the work.
            height: 0,
            width: 0
        });

        // Close popup after popup position information was used.
        this.popupPosition = null;

        // After creation, select the new node as sole node.
        this.clearSelection();
        this.mSelectedNodes.add(lNode);
    }

    /**
     * Get type of node.
     * 
     * @param pNode - Document node reference.
     * 
     * @returns the typename of a node. 
     */
    public typeOfNode(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): PotatnoNodeGraphComponentNodeType {
        switch (pNode.definitionId) {
            // Comments
            case PotatnoCommentNodeDefinition.DEFINITION_ID: return 'comment';

            // Both conjunctions share the same type.
            case PotatnoValueConjunctionNodeDefinition.DEFINITION_ID:
            case PotatnoFlowConjunctionNodeDefinition.DEFINITION_ID: return 'conjunction';

            // Anything else are nodes.
            default: return 'node';
        }
    }

    /**
     * Run a pointer drag interaction (panning or selecting) until the pointer is released.
     * Registers local document pointer listeners and releases both on pointer up.
     *
     * @param pEvent - Pointer down event that started the drag.
     * @param pMode - Kind of drag to perform.
     */
    private pointerDrag(pEvent: PointerEvent, pMode: 'panning' | 'selecting'): void {
        // Staring position of the selection box in local graph space.
        const lStaringPosition: PotatnoNodeGraphComponentPoint = this.convertGlobalToGridPosition(pEvent.clientX, pEvent.clientY);
        let lLastPosition: PotatnoNodeGraphComponentPoint = lStaringPosition;

        // Drag magic listener (●'◡'●)つ━☆・*。
        const lPointerMoveListener = (pMoveEvent: PointerEvent): void => {
            const lCurrentPosition: PotatnoNodeGraphComponentPoint = this.convertGlobalToGridPosition(pMoveEvent.clientX, pMoveEvent.clientY);
            switch (pMode) {
                case 'panning': {
                    this.mManager.grid.pan(lCurrentPosition.x - lLastPosition.x, lCurrentPosition.y - lLastPosition.y);
                    break;
                }

                case 'selecting': {
                    // Recalculate the box directly as top-left position plus size, so the template can use it as is.
                    this.selectBox = {
                        x: Math.min(lStaringPosition.x, lCurrentPosition.x),
                        y: Math.min(lStaringPosition.y, lCurrentPosition.y),
                        width: Math.abs(lCurrentPosition.x - lStaringPosition.x),
                        height: Math.abs(lCurrentPosition.y - lStaringPosition.y)
                    };
                    break;
                }
            };

            // Save current position as last position.
            lLastPosition = lCurrentPosition;
        };

        // Pointer up listener, applying the selection and cleaning up temporary listeners.
        const lPointerUpListener = (): void => {
            document.removeEventListener('pointermove', lPointerMoveListener);
            document.removeEventListener('pointerup', lPointerUpListener);

            if (pMode === 'selecting' && this.selectBox) {
                // Convert the nodebox into grid pixel space.
                const lTopLeft: PotatnoNodeGraphComponentPoint = this.convertLocalToGridCoordinate(this.selectBox.x, this.selectBox.y);
                const lBottomRight: PotatnoNodeGraphComponentPoint = this.convertLocalToGridCoordinate(this.selectBox.x + this.selectBox.width, this.selectBox.y + this.selectBox.height);

                // And from the pixel space into grid coordinates. No need to round numbers as it correcter to not do it.
                const lGridSize: number = this.mManager.grid.gridSize;
                this.selectNodesInRectangle({
                    top: lTopLeft.y / lGridSize,
                    right: lBottomRight.x / lGridSize,
                    bottom: lBottomRight.y / lGridSize,
                    left: lTopLeft.x / lGridSize,
                });

                // And clear select box after that.
                this.selectBox = null;
            }
        };

        // Add temporary pointer listeners.
        document.addEventListener('pointermove', lPointerMoveListener);
        document.addEventListener('pointerup', lPointerUpListener);
    }

    /**
     * Handle graph keyboard shortcuts. 
     * Only active when the pointer is over this graph and input field isnt focused.
     *
     * @param pEvent - Keyboard event from the document.
     */
    private onKeyDown(pEvent: KeyboardEvent): void {
        // Mouse must be inside graph to enable hotkeys.
        if (!this.mIsMouseInsideGrid) {
            return;
        }

        // Active element should be not of any input type.
        const lActiveElement: Element | null = document.activeElement;
        if (lActiveElement instanceof HTMLInputElement || lActiveElement instanceof HTMLTextAreaElement || lActiveElement instanceof HTMLSelectElement) {
            return;
        }

        // Single key strokes.
        switch (pEvent.key) {
            // Close popup.
            case 'Escape': {
                this.popupPosition = null;
                return;
            }

            // Delete all selected nodes.
            case 'Delete': {
                for (const lNode of this.mSelectedNodes) {
                    this.mManager.graph.removeNode(lNode);
                }

                this.clearSelection();
                return;
            }
        }

        // Now only compound hotkeys.
        if (!pEvent.ctrlKey) {
            return;
        }

        switch (pEvent.key) {
            // Undo change.
            case 'z': {
                pEvent.preventDefault();
                this.mManager.history.undo();
                return;
            }

            // Undo undone change.
            case 'y': {
                pEvent.preventDefault();
                this.mManager.history.redo();
                return;
            }

            // Copy selected nodes.
            case 'c': {
                this.mManager.clipboard.copy(this.mSelectedNodes);
                return;
            }

            // Paste copied nodes.
            case 'v': {
                pEvent.preventDefault();
                this.pasteFromClipboard();
            }
        }
    }

    /**
     * Calculate pointer coordinates relative to the grid wrapper.
     *
     * @param pClientX - Viewport X coordinate.
     * @param pClientY - Viewport Y coordinate.
     *
     * @returns Local graph wrapper coordinates.
     */
    private convertGlobalToGridPosition(pClientX: number, pClientY: number): PotatnoNodeGraphComponentPoint {
        const lRect: DOMRect = this.mComponent.element.getBoundingClientRect();
        return {
            x: pClientX - lRect.left,
            y: pClientY - lRect.top
        };
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
    public selectNode(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>, pEvent: PointerEvent,): void {
        this.popupPosition = null;

        pEvent.stopPropagation();

        // Comment nodes also select all wrapped nodes. 
        // TODO: Also deselect on deselection.
        if (pNode.definitionId === PotatnoCommentNodeDefinition.DEFINITION_ID) {
            this.selectNodesInRectangle({
                top: pNode.transformation.y,
                right: pNode.transformation.x + pNode.transformation.width,
                bottom: pNode.transformation.y + pNode.transformation.height,
                left: pNode.transformation.x
            });
        }

        if (pEvent.ctrlKey) {
            if (this.mSelectedNodes.has(pNode)) {
                this.mSelectedNodes.delete(pNode);
            } else {
                this.mSelectedNodes.add(pNode);
            }
        } else if (!this.mSelectedNodes.has(pNode)) {
            this.clearSelection();
            this.mSelectedNodes.add(pNode);
        }

        this.mComponent.updater.updateAsync();
    }

    /**
     * Open the add-node popup at a pointer position.
     *
     * @param pClientX - Viewport X coordinate.
     * @param pClientY - Viewport Y coordinate.
     */
    private openAddNodePopupAtPointer(pClientX: number, pClientY: number): void {
        const lWrapper: HTMLElement = this.mComponent.element;

        // Convert pointer position into local (component space) and grid space.
        const lGridLocalPosition: PotatnoNodeGraphComponentPoint = this.convertGlobalToGridPosition(pClientX, pClientY);
        const lGridPosition: PotatnoNodeGraphComponentPoint = this.convertLocalToGridCoordinate(lGridLocalPosition.x, lGridLocalPosition.y);

        // Small 8px padding to the position to grids edges. 
        const lGridPositionPadding: number = 8;

        // Clamp position of popup so it does not overflow out of right or bottom.
        const lMaxLocalX: number = Math.max(0, lWrapper.clientWidth - PotatnoNodeSelectionPopupComponent.POPUP_WIDTH - lGridPositionPadding);
        const lMaxLocalY: number = Math.max(0, lWrapper.clientHeight - PotatnoNodeSelectionPopupComponent.POPUP_HEIGHT - lGridPositionPadding);

        this.popupPosition = {
            local: {
                x: Math.max(lGridPositionPadding, Math.min(lGridLocalPosition.x, lMaxLocalX)),
                y: Math.max(lGridPositionPadding, Math.min(lGridLocalPosition.y, lMaxLocalY))
            },
            grid: {
                x: Math.round(lGridPosition.x / this.mManager.grid.gridSize),
                y: Math.round(lGridPosition.y / this.mManager.grid.gridSize)
            }
        };
    }

    /**
     * Convert local coordinates to grid coordinates by reversing the pan and zoom transforms.
     *
     * @param pLocalX - X position in local pixels.
     * @param pLocalY - Y position in local pixels.
     *
     * @returns grid pixel coordinates.
     */
    private convertLocalToGridCoordinate(pLocalX: number, pLocalY: number): { x: number; y: number; } {
        return {
            x: (pLocalX - this.mManager.grid.panX) / this.mManager.grid.zoom,
            y: (pLocalY - this.mManager.grid.panY) / this.mManager.grid.zoom
        };
    }

    /**
     * Clear selection and update view.
     */
    private clearSelection(): void {
        this.mSelectedNodes.clear();
        this.mComponent.updater.updateAsync();
    }

    /**
     * Paste copied nodes into the active graph.
     */
    private pasteFromClipboard(): void {
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            return;
        }

        // An empty paste whould reset node selection so skip it when nothing was pasted.
        const lPastedNodes: Array<PotatnoDocumentNode<PotatnoProjectTypesDefinition>> = this.mManager.clipboard.paste();
        if (lPastedNodes.length === 0) {
            return;
        }

        // Reselect pasted nodes.
        this.clearSelection();
        for (const lNode of lPastedNodes) {
            this.mSelectedNodes.add(lNode);
        }
    }

    /**
     * Select all nodes intersecting a rectange in grid space.
     */
    private selectNodesInRectangle(pSelectionRectangle: PotatnoNodeGraphComponentGridRectange): void {
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            return;
        }

        for (const lNode of lActiveFunction.nodes) {
            const lNodeTop: number = lNode.transformation.y;
            const lNodeLeft: number = lNode.transformation.x;
            const lNodeRight: number = lNodeLeft + lNode.transformation.width;
            const lNodeBottom: number = lNodeTop + lNode.transformation.height;

            // Check for partially intersection
            if (lNodeLeft < pSelectionRectangle.right && lNodeRight > pSelectionRectangle.left && lNodeTop < pSelectionRectangle.bottom && lNodeBottom > pSelectionRectangle.top) {
                this.mSelectedNodes.add(lNode);
            }
        }
    }
}

type PotatnoNodeGraphComponentNodeSelectionPopupPosition = {
    local: {
        x: number;
        y: number;
    },
    grid: {
        x: number;
        y: number;
    };
};

type PotatnoNodeGraphComponentPoint = {
    x: number;
    y: number;
};

type PotatnoNodeGraphComponentSelectBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type PotatnoNodeGraphComponentGridRectange = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};

type PotatnoNodeGraphComponentNodeType = 'node' | 'comment' | 'conjunction';