import { Exception } from '@kartoffelgames/core';
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { KgDraggableModule, KgPanModule, type KgDraggableModuleEvent, type KgPanModuleEvent } from '@kartoffelgames/web-components';
import { Component, ComponentState, PwbComponent, PwbComponentEvent, PwbExport, type ComponentEventEmitter, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { PotatnoFlowConjunctionNodeDefinition } from '../../../project/node_definition/potatno-flow-conjunction-node-definition.ts';
import type { PotatnoPortDefinitionType } from '../../../project/potatno-port-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoPortHandleComponent } from '../potatno_port_handle/potatno-port-handle-component.ts';
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
    components: [PotatnoPortHandleComponent],
    modules: [KgPanModule, KgDraggableModule]
})
export class PotatnoConjunctionNodeComponent implements IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private mNodeData: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null;
    private readonly mUnsubscribeNodeChange: PotatnoCodeUiManagerUnsubscribe;
    private readonly mUnsubscribeValidation: PotatnoCodeUiManagerUnsubscribe;

    /**
     * Emitted with the definition the user picked, for the host to insert.
     */
    @PwbComponentEvent('node-drag')
    private accessor mDrag!: ComponentEventEmitter<PotatnoNodeComponentMove>;

    /**
     * Selected state of node component.
     */
    @ComponentState.state()
    private accessor mSelected: boolean;

    /**
     * CSS class string for the error state.
     */
    public get inputHasError(): boolean {
        // Node has error or input port has an error.
        return this.mManager.integrity.errorItems.has(this.nodeData) || this.mManager.integrity.errorItems.has(this.nodePorts.input);
    }

    /**
     * The sole input port of the conjunction. Used by the port handle.
     */
    public get inputPort(): PotatnoDocumentPort<PotatnoProjectTypesDefinition> {
        return this.nodePorts.input;
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
     * The sole output port of the conjunction. Used by the port handle.
     */
    public get outputPort(): PotatnoDocumentPort<PotatnoProjectTypesDefinition> {
        return this.nodePorts.output;
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
     * Selection state of the button.
     * Reading returns the current state, writing overrides it.
     */
    @PwbExport()
    public get selected(): boolean {
        return this.mSelected;
    } set selected(pSelected: unknown) {
        this.mSelected = this.parseBoolean(pSelected);
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
        this.mSelected = false;

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
     * Handles the drag event for moving the node.
     *
     * @param pEvent - Drag event.
     */
    public dragNode(pEvent: KgPanModuleEvent): void {
        // Scale of any transformed parent: ratio of rendered (actual size) to layout (unscaled) size.
        const lComponentSize: DOMRect = this.mComponent.element.getBoundingClientRect();
        const lScaleX: number = this.mComponent.element.offsetWidth ? lComponentSize.width / this.mComponent.element.offsetWidth : 1;
        const lScaleY: number = this.mComponent.element.offsetHeight ? lComponentSize.height / this.mComponent.element.offsetHeight : 1;

        // Calculate grid position change for current pointer position.
        const lCurrentPositionX: number = Math.round((pEvent.pointerPosition.x / lScaleX) / this.mManager.grid.gridSize);
        const lCurrentPositionY: number = Math.round((pEvent.pointerPosition.y / lScaleY) / this.mManager.grid.gridSize);

        // Calculate grid position of previous pointer position
        const lLastPositionX: number = Math.round(((pEvent.pointerPosition.x - pEvent.moveDistance.x) / lScaleX) / this.mManager.grid.gridSize);
        const lLastPositionY: number = Math.round(((pEvent.pointerPosition.y - pEvent.moveDistance.y) / lScaleY) / this.mManager.grid.gridSize);

        // Calculate grid position change of current movement.
        const lPositionChangeX: number = lCurrentPositionX - lLastPositionX;
        const lPositionChangeY: number = lCurrentPositionY - lLastPositionY;

        // Skip any movement when nothing has changed.
        if (lPositionChangeX === 0 && lPositionChangeY === 0) {
            return;
        }

        // Dispatch drag event.
        this.mDrag.dispatchEvent(new PotatnoNodeComponentMove(lPositionChangeX, lPositionChangeY));

        // And then update node position.
        this.mManager.graph.transformNode(this.nodeData, (pNode) => {
            pNode.moveTo(this.nodeData.transformation.x + lPositionChangeX, this.nodeData.transformation.y + lPositionChangeY);
        });
    }

    /**
     * Remove node on right click.
     * 
     * @param pEvent - Pointer event.
     */
    public nodeDelete(pEvent: PointerEvent): void {
        pEvent.preventDefault();

        // Right click. Delete node.
        if (pEvent.button === 2) {
            this.mManager.graph.removeNode(this.nodeData);
        }
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribeNodeChange();
        this.mUnsubscribeValidation();
    }

    /**
     * Share both conjunction ports as the dragged data on drag start.
     *
     * @param pEvent - Drag start event.
     */
    public onDragStart(pEvent: KgDraggableModuleEvent): void {
        // Share the dragged ports with drop targets. The grid manager reads this to track the drag.
        pEvent.setData<Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>>([this.nodePorts.input, this.nodePorts.output]);
    }

    /**
     * Complete a port drop on this conjunction node.
     *
     * @param pEvent - Drop event.
     */
    public onDrop(pEvent: KgDraggableModuleEvent): void {
        // Read the dragged ports shared by the drag source.
        const lDraggedPorts: Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> | null = pEvent.getData();
        if (!lDraggedPorts) {
            return;
        }

        // Validate the dragged ports. Let the grid handle the release when nothing connects.
        if (!this.draggedPortCanConnect(lDraggedPorts)) {
            return;
        }

        // Mark event as "handled" to inform components in the chain, that the drop data has been used.
        pEvent.preventDefault();

        // Connect ports to conjunction.
        this.mManager.graph.mergeConnectPorts([...this.nodeData.inputs.list, ...this.nodeData.outputs.list], lDraggedPorts);
    }

    /**
     * Check whether any of the dragged ports can be connected to this conjunction node.
     *
     * @param pDraggedPorts - Currently dragged ports.
     *
     * @returns True when at least one dragged port can be connected.
     */
    private draggedPortCanConnect(pDraggedPorts: Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>): boolean {
        // Read sole input and output into a list.
        const lPorts: PotatnoConjunctionNodePorts = this.nodePorts;
        const lPortList: Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> = [lPorts.input, lPorts.output];

        // Accept when any dragged port has a valid inner target port.
        for (const lDraggedPort of pDraggedPorts) {
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
     * Parse an unknown (possibly string attribute) value into a boolean.
     *
     * @param pValue - Value to parse.
     *
     * @returns a boolean.
     */
    private parseBoolean(pValue: unknown): boolean {
        // A string attribute might be the literal "true" or "false".
        if (typeof pValue === 'string') {
            // Empty strings are considered as true also. Because setting a empty attribute also is "true".
            if (pValue === '') {
                return true;
            }

            // Check for a string with the literal true or false string.
            const lValue: string = pValue.toLowerCase();
            if (lValue === 'true' || lValue === 'false') {
                return lValue === 'true';
            }
        }

        return Boolean(pValue);
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
