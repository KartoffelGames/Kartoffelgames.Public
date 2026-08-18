import { Exception } from '@kartoffelgames/core';
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, PwbChild, PwbComponent, PwbComponentEvent, PwbExport, type ComponentEventEmitter, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { PotatnoFlowConjunctionNodeDefinition } from '../../../project/node_definition/potatno-flow-conjunction-node-definition.ts';
import type { PotatnoPortDefinitionType } from '../../../project/potatno-port-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import type { PotatnoUiManagerGridCoordinate } from '../../manager/manager_component/potatno-ui-manager-grid.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoPortComponent } from '../potatno_port/potatno-port-component.ts';
import nodeCss from './potatno-conjunction-node-component.css' with { type: 'text' };
import nodeTemplate from './potatno-conjunction-node-component.html' with { type: 'text' };

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
        // Node has error or input port has an error.
        return this.mManager.integrity.errorItems.has(this.nodeData) || this.mManager.integrity.errorItems.has(this.nodePorts.input);
    }

    /**
     * Get if the sole ouput port is connected to any other port.
     */
    public get isInputConnected(): boolean {
        return this.nodePorts.input.connectedPorts.size > 0;
    }

    /**
     * Get if the sole ouput port is connected to any other port.
     */
    public get isOutputConnected(): boolean {
        return this.nodePorts.output.connectedPorts.size > 0;
    }

    /**
     * The domain node object to render.
     */
    @PwbExport()
    public get nodeData(): PotatnoDocumentNode<PotatnoProjectTypesDefinition> {
        if (!this.mNodeData) {
            throw new Exception('Node data not set.', this);
        }

        return this.mNodeData;
    } set nodeData(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>) {
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
     * CSS class string for the error state.
     */
    public get outputHasError(): boolean {
        // Node has error or output port has an error.
        return this.mManager.integrity.errorItems.has(this.nodeData) || this.mManager.integrity.errorItems.has(this.nodePorts.output);
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
        if (this.nodeData.definitionId === PotatnoFlowConjunctionNodeDefinition.DEFINITION_ID) {
            return 'flow';
        }

        return 'value';
    }

    /**
     * Port type name (shown as tooltip).
     */
    public get portValueType(): string {
        // No valid value type when it cant be read from the first value node.
        if (this.portType !== 'value') {
            return '';
        }

        return this.nodePorts.input.resolvedDataType;
    }

    /**
     * Get nodes input and output port.
     */
    private get nodePorts(): PotatnoConjunctionNodePorts {
        if (this.nodeData.inputs.list.length === 0 || this.nodeData.outputs.list.length === 0) {
            throw new Exception('Malformed conjunction node', this);
        }

        return {
            input: this.nodeData.inputs.list[0],
            output: this.nodeData.outputs.list[0],
        };
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

        // Create the document wide drag handler, as firefox cant fix a 16 year old bug.
        this.mDragPositionEventHandler = (pEvent: DragEvent) => {
            // When nothing is dragged, just stop.
            if (!this.mManager.grid.draggedPort.isDragging) {
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
            this.resyncComponent(this.nodeData);
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
        pEvent.preventDefault();

        // Right click. Delete node.
        if (pEvent.button === 2) {
            this.mManager.graph.removeNode(this.nodeData);
        }

        // Skip anything that is not a left mouse button.
        if (pEvent.button !== 0) {
            return;
        }

        // Save current coordinate so the current pointer position determinates exactly this coordinate.
        const lStartingCoordinateX: number = this.nodeData.transformation.x * this.mManager.grid.gridSize;
        const lStartingCoordinateY: number = this.nodeData.transformation.y * this.mManager.grid.gridSize;

        let lCurrentX: number = this.nodeData.transformation.x;
        let lCurrentY: number = this.nodeData.transformation.y;

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
            this.mManager.graph.transformNode(this.nodeData, (pNode) => {
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
        this.mManager.grid.setDraggingPort([]);

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
     * Start a native port drag from both ports.
     *
     * @param pEvent - Drag event.
     */
    public onDragStart(pEvent: DragEvent): void {
        // Register native drag data. Reuse the port components mime type for interoperability.
        pEvent.stopPropagation();
        pEvent.dataTransfer!.effectAllowed = 'link';

        // Hide the native drag ghost.
        pEvent.dataTransfer!.setDragImage(document.createElement('div'), 0, 0);

        // Set this port as global dragging port information.
        this.mManager.grid.setDraggingPort([this.nodePorts.input, this.nodePorts.output]);

        // Trigger update.
        this.mComponent.updater.updateAsync();
    }

    /**
     * Complete a native port drop on this conjunction node.
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

        // Connect ports to conjunction.
        this.mManager.graph.mergeConnectPorts([...this.nodeData.inputs.list, ...this.nodeData.outputs.list], this.mManager.grid.draggedPort.ports);
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
        // Convert viewport coordinates into grid-local coordinates.
        const lEnd: PotatnoUiManagerGridCoordinate = this.mManager.grid.pixelToGridSpace(pClientX, pClientY);

        // Allways draw from input port, as the svg is left aligned.
        return this.mManager.connections.createTemporaryPath(this.nodePorts.input, lEnd).attributeValue;
    }

    /**
     * Check whether any dragged port can be connected to this conjunction node.
     * Also check whether a native drag contains Potatno port data.
     *
     * @returns True when at least one dragged port can be connected.
     */
    private draggedPortCanConnect(): boolean {
        // Check if something is dragged.
        if (!this.mManager.grid.draggedPort.isDragging) {
            return false;
        }

        // Read sole input and output into a list.
        const lPorts: PotatnoConjunctionNodePorts = this.nodePorts;
        const lPortList: Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> = [lPorts.input, lPorts.output];

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
        // Check if something is dragged. As both, the input and output are dragged at the same time, only the input port must be checked.
        const lInputPort = this.nodePorts.input;
        if (!this.mManager.grid.draggedPort.hasPort(lInputPort)) {
            return;
        }

        // Update dragging pointer position and skip if actual grid position has not changed.
        if (!this.mManager.grid.draggedPort.updatePointer(pClientX, pClientY)) {
            return;
        }

        // Read port position of the current dragged input port. Draw only starts from input port, as the svg is left aligned.
        const lPortPosition: PotatnoUiManagerGridCoordinate | undefined = this.mManager.grid.draggedPort.portPositions.get(lInputPort);
        if (!lPortPosition) {
            return;
        }

        // Calculate offset to grids [0, 0] point.
        const lPortX: number = lPortPosition.x * this.mManager.grid.gridSize;
        const lPortY: number = lPortPosition.y * this.mManager.grid.gridSize;

        // Update svg transformation to meet current grid interaction.
        this.mDragConnectionSvg?.style.setProperty('transform', `translate(${-lPortX}px, ${-lPortY}px)`);

        // Update drag connection path.
        this.mDragConnectionPath?.setAttribute('d', this.createDragPath(pClientX, pClientY));
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

type PotatnoConjunctionNodePorts = {
    input: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
    output: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
};

type PotatnoConjunctionNodeGlobalDragoverHandler = (pEvent: DragEvent) => void;
