import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbComponent, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import { PotatnoDocumentPort } from "../../../document/potatno-document-port.ts";
import { PotatnoCommentNodeDefinition } from '../../../project/node_definition/potatno-comment-node-definition.ts';
import { PotatnoFlowConjunctionNodeDefinition } from '../../../project/node_definition/potatno-flow-conjunction-node-definition.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import { PotatnoValueConjunctionNodeDefinition } from '../../../project/node_definition/potatno-value-conjunction-node-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoUiManagerGridCoordinate, PotatnoUiManagerGridPixelCoordinate } from "../../manager/manager_component/potatno-ui-manager-grid.ts";
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoNodeSelectionPopupComponent } from '../potatno-node-selection-popup/potatno-node-selection-popup-component.ts';
import { PotatnoCommentNodeComponent } from '../potatno_comment-node/potatno-comment-node-component.ts';
import { PotatnoConjunctionNodeComponent } from "../potatno_conjunction_node/potatno-conjunction-node-component.ts";
import { PotatnoConnectionLayerComponent } from '../potatno_connection_layer/potatno-connection-layer-component.ts';
import { PotatnoNodeComponent, type PotatnoNodeComponentMove } from '../potatno_node_component/potatno-node-component.ts';
import graphCss from './potatno-node-graph-component.css' with { type: 'text' };
import graphTemplate from './potatno-node-graph-component.html' with { type: 'text' };

/**
 * Interactive node graph for the active Potatno document function.
 *
 * A little wierd and intertwined on how and when the ui updates.
 */
@PwbComponent({
    selector: 'potatno-node-graph',
    template: graphTemplate,
    style: graphCss,
    components: [PotatnoNodeSelectionPopupComponent, PotatnoNodeComponent, PotatnoCommentNodeComponent, PotatnoConjunctionNodeComponent, PotatnoConnectionLayerComponent,]
})
export class PotatnoNodeGraphComponent implements IComponentOnDeconstruct {
    private static readonly ZOOM_STRENGTH: number = 0.1;

    private readonly mComponent: Component;
    private mIsMouseInsideGrid: boolean;
    private readonly mKeyboardHandler: (pEvent: KeyboardEvent) => void;
    private readonly mManager: PotatnoUiManager;
    private readonly mSelectedNodes: Set<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>;
    private readonly mUnsubscribeFunctionChange: PotatnoCodeUiManagerUnsubscribe;
    private readonly mUnsubscribeGraphChange: PotatnoCodeUiManagerUnsubscribe;

    /**
     * State for the add-node popup opened from the graph context menu.
     */
    @ComponentState.state()
    public accessor popupPosition: PotatnoNodeGraphComponentNodeSelectionPopupPosition | null;

    /**
     * Screen-space rectangle of the drag selection box (top-left position and size). Reassigned
     * (never mutated in place) on each selecting pointer move so the bound template style re-renders
     * and the box tracks the cursor.
     */
    @ComponentState.state({ complexValue: true })
    public accessor selectBox: PotatnoNodeGraphComponentSelectBox | null;

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

        // Set this element as main grid element.
        this.mManager.grid.gridElement = this.mComponent.element;

        // Add user events directly to the component element.
        pComponent.element.addEventListener('pointerdown', (pEvent) => { this.onPointerDown(pEvent); });
        pComponent.element.addEventListener('wheel', (pEvent) => { this.onScroll(pEvent); });

        // Suppress the native menu; the right-click interaction itself is handled in the pointerdown.
        pComponent.element.addEventListener('contextmenu', (pEvent) => { pEvent.preventDefault(); });

        // Track pointer presence so keyboard shortcuts only target the hovered graph, allowing multiple potatno instances on a single page.
        pComponent.element.addEventListener('pointerenter', () => { this.mIsMouseInsideGrid = true; });
        pComponent.element.addEventListener('pointerleave', () => { this.mIsMouseInsideGrid = false; });

        // Implement a drop zone to create conjunction when dragging connections on empty spaces.
        pComponent.element.addEventListener('dragover', (pEvent) => {
            // Validate current dragged ports.
            if (!this.mManager.grid.draggedPort.isDragging) {
                return;
            }

            // Allow a drop on this port.
            pEvent.preventDefault();
            pEvent.stopPropagation();

            // Update the dragging effect.
            if (pEvent.dataTransfer) {
                pEvent.dataTransfer.dropEffect = 'link';
            }
        });
        pComponent.element.addEventListener('drop', (pEvent: MouseEvent) => {
            // Create a conjunction dropped position.
            this.createDroppedConjunction(pEvent);
        });

        this.mKeyboardHandler = (pEvent: KeyboardEvent) => {
            this.onKeyDown(pEvent);
        };
        document.addEventListener('keydown', this.mKeyboardHandler);

        // Reset current interactions when the document or the active function changes.
        this.mUnsubscribeFunctionChange = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.SpecialActiveFunction, () => {
            this.popupPosition = null;
            this.selectBox = null;
            this.selectNodes([], false);
        });

        // On adding or deletion of nodes, only update the view, nothing more.
        this.mUnsubscribeGraphChange = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.NodeAdd | PotatnoCodeUiManagerChangeType.NodeDelete | PotatnoCodeUiManagerChangeType.SpecialGrid, () => {
            this.mComponent.updater.updateAsync();
        });
    }

    /**
     * Insert the node definition chosen in the add-node popup at the popup's world position.
     *
     * @param pEvent - Component event carrying the selected node definition.
     */
    public createNodeOnPopupPosition(pDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition>): void {
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
        this.selectNodes([lNode], false);
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
     * Remove graph listeners and pending frame work.
     */
    public onDeconstruct(): void {
        this.mUnsubscribeFunctionChange();
        this.mUnsubscribeGraphChange();

        document.removeEventListener('keydown', this.mKeyboardHandler);
    }

    /**
     * Handle pointer down on a rendered node for selection and dragging.
     *
     * @param pEvent - Pointer event from the node element.
     * @param pNode - Node that received the pointer down.
     */
    public selectNodes(pNodes: Array<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>, pAddativeSelection: boolean | PointerEvent): void {
        this.popupPosition = null;

        // Convert boolean|event into boolean.
        let lAddativeSelection: boolean = !!pAddativeSelection;
        if (pAddativeSelection instanceof PointerEvent) {
            pAddativeSelection.stopPropagation();
            lAddativeSelection = pAddativeSelection.ctrlKey;
        }

        const lEncounteredNodes: Set<PotatnoDocumentNode<PotatnoProjectTypesDefinition>> = new Set<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>();

        // Clear previous selections when its not a addative selection.
        if (!lAddativeSelection) {
            // Special single node selection. Happens when nodes are selected and should now be moved.
            // Only triggers when the single selected node is already selected.
            if (pNodes.length === 1 && this.mSelectedNodes.has(pNodes.at(0)!)) {
                // If a single node is selected without an addative selection, prefill encountered nodes with the current selection.
                for (const lSelectedNode of this.mSelectedNodes) {
                    lEncounteredNodes.add(lSelectedNode);
                }
            } else {
                // If not handles as a special selection node, just clear the previous selection.
                this.mSelectedNodes.clear();
            }
        }

        // Copy nodes, they get expanded while iterating.
        const lTargetNodes: Array<PotatnoDocumentNode<PotatnoProjectTypesDefinition>> = [...pNodes];

        // Iterate all. The list is expanded in place while iterating, for-of visits appended nodes too.
        for (const lNode of lTargetNodes) {
            // Skip dublicate selections.
            if (lEncounteredNodes.has(lNode)) {
                continue;
            }

            lEncounteredNodes.add(lNode);

            // If node is a comment, add all containing nodes into selection queue.
            if (lNode.definitionId === PotatnoCommentNodeDefinition.DEFINITION_ID) {
                lTargetNodes.push(...this.getNodesInRectangle({
                    top: lNode.transformation.y,
                    right: lNode.transformation.x + lNode.transformation.width,
                    bottom: lNode.transformation.y + lNode.transformation.height,
                    left: lNode.transformation.x
                }));
            }

            // Eighter select a node or deselect when it is already selected.
            if (this.mSelectedNodes.has(lNode)) {
                this.mSelectedNodes.delete(lNode);
            } else {
                this.mSelectedNodes.add(lNode);
            }
        }

        this.mComponent.updater.updateAsync();
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
     * Calculate pointer coordinates relative to the grid wrapper.
     *
     * @param pClientX - Viewport X coordinate.
     * @param pClientY - Viewport Y coordinate.
     *
     * @returns Local graph wrapper coordinates.
     */
    private convertGlobalToGridLocalPosition(pClientX: number, pClientY: number): PotatnoUiManagerGridPixelCoordinate {
        const lRect: DOMRect = this.mComponent.element.getBoundingClientRect();
        return {
            x: pClientX - lRect.left,
            y: pClientY - lRect.top
        };
    }

    /**
     * Create a new conjunction when a connection is dropped on an empty space.
     * 
     * @param pEvent - Drop event.
     * @returns 
     */
    private createDroppedConjunction(pEvent: MouseEvent): void {
        if (!this.mManager.grid.draggedPort.isDragging) {
            return;
        }

        // Connect and consume the drop.
        pEvent.preventDefault();
        pEvent.stopPropagation();

        // Filter dragged ports.
        const lConnectableDraggedPorts: Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> = this.mManager.grid.draggedPort.ports.filter((pDraggedPort) => {
            // When flow output ports are connected. Skip it.
            if (pDraggedPort.direction === 'output' && pDraggedPort.portType === 'flow' && pDraggedPort.connectedPorts.size > 0) {
                return false;
            }

            // When value input ports are connected. Skip it.
            if (pDraggedPort.direction === 'input' && pDraggedPort.portType === 'value' && pDraggedPort.connectedPorts.size > 0) {
                return false;
            }

            return true;
        });

        // skip conjunction creation when not ports gonna be connected.
        if (lConnectableDraggedPorts.length === 0) {
            return;
        }

        // Get the correct conjunction definition based on the connected port type.
        const lConjunctionDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition> = (() => {
            const lFirstDraggedPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> = this.mManager.grid.draggedPort.ports[0];

            if (lFirstDraggedPort.portType === 'flow') {
                return this.mManager.project.nodeDefinitions.get(PotatnoFlowConjunctionNodeDefinition.DEFINITION_ID)!;
            }

            return this.mManager.project.nodeDefinitions.get(PotatnoValueConjunctionNodeDefinition.DEFINITION_ID)!;
        })();

        // Convert pointer position into local (component space) and grid space.
        const lGridPosition: PotatnoUiManagerGridCoordinate = this.mManager.grid.pixelToGridSpace(pEvent.clientX, pEvent.clientY);

        // Create new conjunction node on the clicked grid position.
        const lConjunctionNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> = this.mManager.graph.addNode(this.mManager.activeFunction, lConjunctionDefinition, {
            x: lGridPosition.x,
            y: lGridPosition.y,

            // Let the auto min size do the work.
            height: 0,
            width: 0
        });

        // Connect ports to conjunction.
        this.mManager.graph.connectConjunction(lConjunctionNode, lConnectableDraggedPorts);
    }

    /**
     * Select all nodes intersecting a rectange in grid space.
     */
    private getNodesInRectangle(pSelectionRectangle: PotatnoNodeGraphComponentGridRectange): Array<PotatnoDocumentNode<PotatnoProjectTypesDefinition>> {
        const lSelectedNodes: Array<PotatnoDocumentNode<PotatnoProjectTypesDefinition>> = new Array<PotatnoDocumentNode<PotatnoProjectTypesDefinition>>();

        // Iterate all nodes to check intersections.
        for (const lNode of this.mManager.activeFunction.nodes) {
            const lNodeTop: number = lNode.transformation.y;
            const lNodeLeft: number = lNode.transformation.x;
            const lNodeRight: number = lNodeLeft + lNode.transformation.width;
            const lNodeBottom: number = lNodeTop + lNode.transformation.height;

            // Check for partially intersection
            if (lNodeLeft < pSelectionRectangle.right && lNodeRight > pSelectionRectangle.left && lNodeTop < pSelectionRectangle.bottom && lNodeBottom > pSelectionRectangle.top) {
                // Check that selection range is not fully inside node.
                if (pSelectionRectangle.top > lNodeTop && pSelectionRectangle.right < lNodeRight && pSelectionRectangle.bottom < lNodeBottom && pSelectionRectangle.left > lNodeLeft) {
                    continue;
                }

                lSelectedNodes.push(lNode);
            }
        }

        return lSelectedNodes;
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

                this.selectNodes([], false);
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
                    this.selectNodes([], false);
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
                this.openNodeSelectionPopupAtPointer(pEvent.clientX, pEvent.clientY);
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
        const lLocalPosition: PotatnoUiManagerGridCoordinate = this.convertGlobalToGridLocalPosition(pEvent.clientX, pEvent.clientY);
        this.mManager.grid.zoomAt(lLocalPosition.x, lLocalPosition.y, lZoomDirection * PotatnoNodeGraphComponent.ZOOM_STRENGTH);
    }

    /**
     * Open the node selection popup at pointer position.
     *
     * @param pClientX - Viewport X coordinate.
     * @param pClientY - Viewport Y coordinate.
     */
    private openNodeSelectionPopupAtPointer(pClientX: number, pClientY: number): void {
        const lWrapper: HTMLElement = this.mComponent.element;

        // Convert pointer position into local (component space) and grid space.
        const lGridLocalPosition: PotatnoUiManagerGridPixelCoordinate = this.convertGlobalToGridLocalPosition(pClientX, pClientY);
        const lGridPosition: PotatnoUiManagerGridCoordinate = this.mManager.grid.pixelToGridSpace(pClientX, pClientY);

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
            grid: lGridPosition
        };
    }

    /**
     * Paste copied nodes into the active graph.
     */
    private pasteFromClipboard(): void {
        // An empty paste whould reset node selection so skip it when nothing was pasted.
        const lPastedNodes: Array<PotatnoDocumentNode<PotatnoProjectTypesDefinition>> = this.mManager.clipboard.paste();
        if (lPastedNodes.length === 0) {
            return;
        }

        // Reselect pasted nodes.
        this.selectNodes(lPastedNodes, false);
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
        const lStaringGridPixelPosition: PotatnoUiManagerGridPixelCoordinate = this.mManager.grid.pixelToGridPixelSpace(pEvent.clientX, pEvent.clientY);

        // Save pointer position. Used for tracking general movement.
        let lLastPointerPosition: PotatnoUiManagerGridPixelCoordinate = {
            x: pEvent.clientX,
            y: pEvent.clientY
        };

        // Drag magic listener (●'◡'●)つ━☆・*。
        const lPointerMoveListener = (pMoveEvent: PointerEvent): void => {
            switch (pMode) {
                case 'panning': {
                    this.mManager.grid.pan(pMoveEvent.clientX - lLastPointerPosition.x, pMoveEvent.clientY - lLastPointerPosition.y);

                    // Save current position as last position.
                    lLastPointerPosition.x = pMoveEvent.clientX;
                    lLastPointerPosition.y = pMoveEvent.clientY;
                    break;
                }

                case 'selecting': {
                    const lCurrentPosition: PotatnoUiManagerGridPixelCoordinate = this.mManager.grid.pixelToGridPixelSpace(pMoveEvent.clientX, pMoveEvent.clientY);

                    // Recalculate the box directly as top-left position plus size, so the template can use it as is.
                    this.selectBox = {
                        x: Math.min(lStaringGridPixelPosition.x, lCurrentPosition.x),
                        y: Math.min(lStaringGridPixelPosition.y, lCurrentPosition.y),
                        width: Math.abs(lCurrentPosition.x - lStaringGridPixelPosition.x),
                        height: Math.abs(lCurrentPosition.y - lStaringGridPixelPosition.y)
                    };
                    break;
                }
            };
        };

        // Pointer up listener, applying the selection and cleaning up temporary listeners.
        const lPointerUpListener = (pEvent: PointerEvent): void => {
            document.removeEventListener('pointermove', lPointerMoveListener);
            document.removeEventListener('pointerup', lPointerUpListener);

            if (pMode === 'selecting' && this.selectBox) {
                // Convert the nodebox into grid pixel space.
                const lTopLeft: PotatnoUiManagerGridPixelCoordinate = this.mManager.grid.gridPixelSpaceToGridSpace({
                    x: this.selectBox.x,
                    y: this.selectBox.y
                }, false);
                const lBottomRight: PotatnoUiManagerGridPixelCoordinate = this.mManager.grid.gridPixelSpaceToGridSpace({
                    x: this.selectBox.x + this.selectBox.width,
                    y: this.selectBox.y + this.selectBox.height
                }, false);

                // And from the pixel space into grid coordinates. No need to round numbers as it correcter to not do it.
                const lSelectedNodes: Array<PotatnoDocumentNode<PotatnoProjectTypesDefinition>> = this.getNodesInRectangle({
                    top: lTopLeft.y,
                    right: lBottomRight.x,
                    bottom: lBottomRight.y,
                    left: lTopLeft.x,
                });

                // Select all nodes.
                this.selectNodes(lSelectedNodes, pEvent.ctrlKey);

                // And clear select box after that.
                this.selectBox = null;
            }
        };

        // Add temporary pointer listeners.
        document.addEventListener('pointermove', lPointerMoveListener);
        document.addEventListener('pointerup', lPointerUpListener);
    }
}

type PotatnoNodeGraphComponentNodeSelectionPopupPosition = {
    local: {
        x: number;
        y: number;
    },
    grid: PotatnoUiManagerGridCoordinate;
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
