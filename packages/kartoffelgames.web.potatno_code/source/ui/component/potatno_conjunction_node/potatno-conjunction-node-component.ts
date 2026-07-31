import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, PwbChild, PwbComponent, PwbComponentEvent, PwbExport, type ComponentEventEmitter, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import type { PotatnoUiManagerGridPathFindingPoint } from '../../manager/helper/potatno-ui-grid-path-finding.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoPortComponent } from '../potatno_port/potatno-port-component.ts';
import nodeCss from './potatno-conjunction-node-component.css' with { type: 'text' };
import nodeTemplate from './potatno-conjunction-node-component.html' with { type: 'text' };
import { PotatnoPortDefinitionType, type PotatnoPortDefinitionDirection } from "../../../project/potatno-port-definition.ts";
import { PotatnoFlowConjunctionNodeDefinition } from "../../../project/node_definition/potatno-flow-conjunction-node-definition.ts";

/**
 * Node conjunction component for the potatno-code visual editor.
 * Handles position on its own.
 */
@PwbComponent({
    selector: 'potatno-conjunction-node',
    template: nodeTemplate,
    style: nodeCss,
    components: [PotatnoPortComponent]
})
export class PotatnoConjunctionNodeComponent implements IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private readonly mDragPositionEventHandler: PotatnoConjunctionNodeGlobalDragoverHandler;
    private mDraggedSourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null;
    private readonly mManager: PotatnoUiManager;
    private mNodeData: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null;
    private readonly mUnsubscribeNodeChange: PotatnoCodeUiManagerUnsubscribe;
    private readonly mUnsubscribeValidation: PotatnoCodeUiManagerUnsubscribe;

    /**
     * SVG element that stores the drag wire.
     */
    @PwbChild('dragConnection')
    private accessor mDragConnectionSvg!: SVGSVGElement | null;

    /**
     *  SVG element used for the temporary drag wire.
     */
    @PwbChild('dragPath')
    private accessor mDragConnectionPath!: SVGPathElement | null;

    /**
     * Emitted with the definition the user picked, for the host to insert.
     */
    @PwbComponentEvent('node-drag')
    private accessor mDrag!: ComponentEventEmitter<PotatnoNodeComponentMove>;

    /**
     * CSS class string for the error state.
     */
    public get inputHasError(): boolean {
        if (!this.mNodeData) {
            return false;
        }

        // Node has error.
        if (this.mManager.integrity.errorItems.has(this.mNodeData)) {
            return true;
        }

        // Any input port has an error.
        for (const lInputPort of this.mNodeData.inputs.list) {
            if (this.mManager.integrity.errorItems.has(lInputPort)) {
                return true;
            }
        }

        return false;
    }

    /**
     * CSS class string for the error state.
     */
    public get outputHasError(): boolean {
        if (!this.mNodeData) {
            return false;
        }

        // Node has error.
        if (this.mManager.integrity.errorItems.has(this.mNodeData)) {
            return true;
        }

        // Any output port has an error.
        for (const lOutputPort of this.mNodeData.outputs.list) {
            if (this.mManager.integrity.errorItems.has(lOutputPort)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get if the sole ouput port is connected to any other port.
     */
    public get isInputConnected(): boolean {
        // Not connected when neighter the data nor inputs exists.
        if (!this.mNodeData || this.mNodeData.inputs.list.length === 0) {
            return false;
        }

        return this.mNodeData.inputs.list[0].connectedPorts.size > 0;
    }

    /**
     * Get if the sole ouput port is connected to any other port.
     */
    public get isOutputConnected(): boolean {
        // Not connected when neighter the data nor outputs exists.
        if (!this.mNodeData || this.mNodeData.outputs.list.length === 0) {
            return false;
        }

        return this.mNodeData.outputs.list[0].connectedPorts.size > 0;
    }

    /**
     * The domain node object to render.
     */
    @PwbExport
    public get nodeData(): PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null {
        return this.mNodeData;
    } set nodeData(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null) {
        // Set node data and reset node definition.
        this.mNodeData = pNode;

        // For syncing, a node must be specified.
        if (!pNode) {
            return;
        }

        // Resync nodes transformation on change.
        this.resyncComponent(pNode);
    }

    /**
     * Computed color for the port handle.
     * Flow ports use the primary text color; value ports use a type-derived hue.
     * Generic value ports use the connected port's resolved type color, or muted when unconnected.
     */
    public get portColor(): string {
        // Color for flow ports. Also catch a port null with this.
        if (this.portType === 'flow') {
            return 'var(--potatno-color-text)';
        }

        return this.mManager.generateStringColor(this.portValueType);
    }

    /**
     * Port type of conjunction.
     */
    public get portType(): PotatnoPortDefinitionType {
        if (this.mNodeData?.definitionId === PotatnoFlowConjunctionNodeDefinition.DEFINITION_ID) {
            return 'flow';
        }

        return 'value';
    }

    /**
     * Port type name (shown as tooltip).
     */
    public get portValueType(): string {
        // No valid value type when it cant be read from the first value node.
        if (!this.mNodeData || this.portType !== 'value' || this.mNodeData.inputs.list.length === 0) {
            return '';
        }

        return this.mNodeData.inputs.list[0].resolvedDataType;
    }

    /**
     * Create the node component.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mComponent = pComponent;
        this.mManager = pManager;
        this.mNodeData = null;
        this.mDraggedSourcePort = null;

        // Create the document wide drag handler, as firefox cant fix a 16 year old bug.
        this.mDragPositionEventHandler = (pEvent: DragEvent) => {
            // When nothing is dragged, just stop.
            if (!this.mManager.grid.draggedPort.isDragging) {
                return;
            }

            // Only fire event when this conjunction owns the dragged port.
            if (!this.mManager.grid.draggedPort.hasPort(this.mDraggedSourcePort)) {
                return;
            }

            // Play the gamble and skip event when the time differs too much.
            if (performance.now() - pEvent.timeStamp > 100) {
                return;
            }

            this.renderDragWire(pEvent.clientX, pEvent.clientY);
        };
        document.addEventListener('dragover', this.mDragPositionEventHandler, { capture: true });

        this.mUnsubscribeNodeChange = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Node, (pItem) => {
            // Only trigger a transformation if its affects the current node data.
            if (pItem.item !== this.mNodeData) {
                return;
            }

            // Calculate the current size of the component.
            this.resyncComponent(this.mNodeData!);
        });

        // Update component on any connection change.
        this.mUnsubscribeValidation = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Connection | PotatnoCodeUiManagerChangeType.SpecialValidation, () => {
            this.mComponent.updater.updateAsync();
        });
    }

    /**
     * Handle pointer down on the resize corners handle.
     *
     * @param pEvent - Pointer event from the resize handle.
     */
    public dragNode(pEvent: PointerEvent): void {
        // Cant transform without node data.
        if (!this.mNodeData) {
            return;
        }

        pEvent.preventDefault();

        // Save current coordinate so the current pointer position determinates exactly this coordinate.
        const lStartingCoordinateX: number = this.mNodeData.transformation.x * this.mManager.grid.gridSize;
        const lStartingCoordinateY: number = this.mNodeData.transformation.y * this.mManager.grid.gridSize;

        let lCurrentX: number = this.mNodeData.transformation.x;
        let lCurrentY: number = this.mNodeData.transformation.y;

        // Scale of any transformed parent: ratio of rendered (actual size) to layout (unscaled) size.
        const lComponentSize: DOMRect = this.mComponent.element.getBoundingClientRect();
        const lScaleX: number = this.mComponent.element.offsetWidth ? lComponentSize.width / this.mComponent.element.offsetWidth : 1;
        const lScaleY: number = this.mComponent.element.offsetHeight ? lComponentSize.height / this.mComponent.element.offsetHeight : 1;

        // Save the starting pointer coordinates to only transform the actual movement.
        const lStartX = pEvent.clientX;
        const lStartY = pEvent.clientY;

        // Drag magic listener (●'◡'●)つ━☆・*。
        const lPointerMoveListener = (pMoveEvent: PointerEvent): void => {
            pMoveEvent.stopPropagation();

            // Divide by scale to convert mouse movement into scale actual drag.
            const lMovementChangeX: number = (pMoveEvent.clientX - lStartX) / lScaleX;
            const lMovementChangeY: number = (pMoveEvent.clientY - lStartY) / lScaleY;

            // Calculate position inside grid. Round to keep movement in "center".
            const lX: number = Math.round((lStartingCoordinateX + lMovementChangeX) / this.mManager.grid.gridSize);
            const lY: number = Math.round((lStartingCoordinateY + lMovementChangeY) / this.mManager.grid.gridSize);

            // Skip any movement when nothing has changed.
            if (lCurrentX === lX && lCurrentY === lY) {
                return;
            }

            // And then update node position.
            this.mManager.graph.transformNode(this.mNodeData, (pNode) => {
                pNode.moveTo(lX, lY);
            });

            // Dispatch drag event.
            this.mDrag.dispatchEvent(new PotatnoNodeComponentMove(lX - lCurrentX, lY - lCurrentY));

            // Save new current position.
            lCurrentX = lX;
            lCurrentY = lY;
        };

        // Pointer up listener, cleaning up temporary listener.
        const lPointerUpListener = (): void => {
            // Remove temporary mouse move listener.
            document.removeEventListener('pointermove', lPointerMoveListener);
            document.removeEventListener('pointerup', lPointerUpListener);
        };

        // Add temporary mouse move listener.
        document.addEventListener('pointermove', lPointerMoveListener);
        document.addEventListener('pointerup', lPointerUpListener);
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribeNodeChange();
        this.mUnsubscribeValidation();

        // Remove the global dragover handler when the node gets removed.
        document.removeEventListener('dragover', this.mDragPositionEventHandler, { capture: true });
    }

    /**
     * Clear native drag state.
     *
     * @param pEvent - Drag event.
     */
    public onDragEnd(pEvent: DragEvent): void {
        pEvent.stopPropagation();
        pEvent.preventDefault();

        // Clear drag state.
        this.mDragConnectionPath?.removeAttribute('d');
        this.mManager.grid.setDraggingPort(new Array());
        this.mDraggedSourcePort = null;

        this.mComponent.updater.updateAsync();
    }

    /**
     * Keep a valid native port drag droppable on the whole node.
     *
     * @param pEvent - Drag event.
     */
    public onDragOver(pEvent: DragEvent): void {
        // Validate current dragged ports.
        if (!this.draggedPortCanConnect()) {
            return;
        }

        // Allow a drop on this node.
        pEvent.preventDefault();
        pEvent.stopPropagation();

        // Update the dragging effect.
        if (pEvent.dataTransfer) {
            pEvent.dataTransfer.dropEffect = 'link';
        }
    }

    /**
     * Start a native port drag from one of the conjunctions inner ports.
     *
     * @param pEvent - Drag event.
     * @param pDirection - Direction of the port the drag started on.
     */
    public onDragStart(pEvent: DragEvent, pDirection: PotatnoPortDefinitionDirection): void {
        // Node data must be set to read ports.
        if (!this.mNodeData) {
            return;
        }

        // Read the single inner port of the dragged direction.
        const lPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> = (() => {
            return pDirection === 'input' ? this.mNodeData.inputs.list[0] : this.mNodeData.outputs.list[0];
        })();

        // Register native drag data. Reuse the port components mime type for interoperability.
        pEvent.stopPropagation();
        pEvent.dataTransfer!.effectAllowed = 'link';

        // Hide the native drag ghost.
        pEvent.dataTransfer!.setDragImage(document.createElement('div'), 0, 0);

        // Remember the source port and anchor the drag wire svg to the matching node edge.
        this.mDraggedSourcePort = lPort;
        if (this.mDragConnectionSvg) { // TODO: What the fuck is that??
            this.mDragConnectionSvg.style.setProperty('left', pDirection === 'input' ? '0px' : 'auto');
            this.mDragConnectionSvg.style.setProperty('right', pDirection === 'output' ? '0px' : 'auto');
        }

        // Set this port as global dragging port information.
        this.mManager.grid.setDraggingPort([lPort]); // TODO: Add both ports for accessibility.

        // Trigger update.
        this.mComponent.updater.updateAsync();
    }

    /**
     * Complete a native port drop on the node.
     *
     * @param pEvent - Drag event.
     */
    public onDrop(pEvent: DragEvent): void {
        // Validate current dragged ports.
        if (!this.draggedPortCanConnect()) {
            return;
        }

        // Connect and consume the drop.
        pEvent.preventDefault();
        pEvent.stopPropagation();

        // Check if something is dragged.
        if (!this.mManager.grid.draggedPort.isDragging) {
            return;
        }

        // Node must be loaded and needs ports.
        if (!this.mNodeData || this.mNodeData.inputs.list.length === 0 || this.mNodeData.outputs.list.length === 0) {
            return;
        }

        // Throw each dragged port against its matching inner port. Invalid connections simply return false.
        for (const lDraggedPort of this.mManager.grid.draggedPort.ports) {
            // Try to connect both ports, input and output.
            this.mManager.graph.connectPorts(lDraggedPort, this.mNodeData.inputs.list[0]);
            this.mManager.graph.connectPorts(lDraggedPort, this.mNodeData.outputs.list[0]);
        }
    }

    /**
     * Create the temporary connection path for a native drag position.
     *
     * @param pClientX - Viewport x coordinate.
     * @param pClientY - Viewport y coordinate.
     *
     * @returns SVG path data in local node coordinates.
     */
    private createDragPath(pClientX: number, pClientY: number): string {
        if (!this.mDraggedSourcePort) {
            return '';
        }

        // Convert viewport coordinates into grid-local coordinates.
        const lEnd: PotatnoUiManagerGridPathFindingPoint = this.mManager.connections.pixelToGridSpace(pClientX, pClientY);

        return this.mManager.connections.createTemporaryPath(this.mDraggedSourcePort, lEnd);
    }

    /**
     * Check whether any dragged port can be connected to this conjunction node.
     * Also check whether a native drag contains Potatno port data.
     *
     * @returns True when at least one dragged port can be connected.
     */
    private draggedPortCanConnect(): boolean {
        // Node must be loaded and needs ports.
        if (!this.mNodeData || this.mNodeData.inputs.list.length === 0 || this.mNodeData.outputs.list.length === 0) {
            return false;
        }

        // Check if something is dragged.
        if (!this.mManager.grid.draggedPort.isDragging) {
            return false;
        }

        // Read sole input and output into a list.
        const lPortList: Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> = [this.mNodeData.inputs.list[0], this.mNodeData.outputs.list[0]];

        // Accept when any dragged port has a valid inner target port.
        for (const lDraggedPort of this.mManager.grid.draggedPort.ports) {
            for (const lTargetPort of lPortList) {
                // Not same port, opposing direction and must have the same port type. (For a connection, the value type does not matter).
                if (lDraggedPort !== lTargetPort && lDraggedPort.direction !== lTargetPort.direction && lDraggedPort.portType === lTargetPort.portType) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Render or update the temporary drag wire path.
     *
     * @param pClientX - Viewport x coordinate.
     * @param pClientY - Viewport y coordinate.
     */
    private renderDragWire(pClientX: number, pClientY: number): void {
        // Check if something is dragged.
        if (!this.mManager.grid.draggedPort.hasPort(this.mDraggedSourcePort) || !this.mDragConnectionSvg || !this.mDragConnectionPath) {
            return;
        }

        // Update dragging pointer position and skip if actual grid position has not changed.
        if (!this.mManager.grid.draggedPort.updatePointer(pClientX, pClientY)) {
            return;
        }

        // Read stored port position of the current dragged port.
        const lPortPosition: PotatnoUiManagerGridPathFindingPoint | undefined = this.mManager.grid.draggedPort.portPositions.get(this.mDraggedSourcePort!);
        if (!lPortPosition) {
            return;
        }

        // Calculate offset to grids [0, 0] point.
        const lPortX: number = lPortPosition.x * this.mManager.grid.gridSize;
        const lPortY: number = lPortPosition.y * this.mManager.grid.gridSize;

        // Update svg transformation to meet current grid interaction.
        this.mDragConnectionSvg.style.setProperty('transform', `translate(${-lPortX}px, ${-lPortY}px)`);

        // Update drag connection path.
        this.mDragConnectionPath.setAttribute('d', this.createDragPath(pClientX, pClientY));
    }

    /**
     * Update the actual component size and position and read all available preview ports.
     *
     * @param pNode - Node data.
     */
    private resyncComponent(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): void {
        // Set the node position on the actual component.
        const lNodeX: number = pNode.transformation.x * this.mManager.grid.gridSize;
        const lNodeY: number = pNode.transformation.y * this.mManager.grid.gridSize;
        this.mComponent.element.style.setProperty('left', `${lNodeX}px`);
        this.mComponent.element.style.setProperty('top', `${lNodeY}px`);

        // Syncron update to reduce popping.
        this.mComponent.updater.update();
    }
}

/**
 * Event data of dragged distance.
 */
export class PotatnoNodeComponentMove {
    private readonly mX: number;
    private readonly mY: number;

    /**
     * Moved x distance.
     */
    public get x(): number {
        return this.mX;
    }


    /**
     * Moved y distance.
     */
    public get y(): number {
        return this.mY;
    }

    /**
     * Constructor.
     * 
     * @param pX - Moved x distance.
     * @param pY - Moved y distance.
     */
    public constructor(pX: number, pY: number) {
        this.mX = pX;
        this.mY = pY;
    }
}

type PotatnoConjunctionNodeGlobalDragoverHandler = (pEvent: DragEvent) => void;
