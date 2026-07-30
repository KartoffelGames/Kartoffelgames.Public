import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, PwbComponent, PwbComponentEvent, PwbExport, type ComponentEventEmitter, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoPortComponent } from '../potatno_port/potatno-port-component.ts';
import nodeCss from './potatno-conjunction-node-component.css' with { type: 'text' };
import nodeTemplate from './potatno-conjunction-node-component.html' with { type: 'text' };
import { PotatnoPortDefinitionType } from "../../../project/potatno-port-definition.ts";
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
    private readonly mManager: PotatnoUiManager;
    private mNodeData: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null;
    private readonly mUnsubscribe: PotatnoCodeUiManagerUnsubscribe;

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
        if(!this.mNodeData || this.mNodeData.inputs.list.length === 0) {
            return false;
        }

        return this.mNodeData.inputs.list[0].connectedPorts.size > 0;
    }

    /**
     * Get if the sole ouput port is connected to any other port.
     */
    public get isOutputConnected(): boolean {
        // Not connected when neighter the data nor outputs exists.
        if(!this.mNodeData || this.mNodeData.outputs.list.length === 0) {
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
        if(this.mNodeData?.definitionId === PotatnoFlowConjunctionNodeDefinition.DEFINITION_ID){
            return 'flow'
        }

        return 'value'
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

        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Node, (pItem) => {
            // Only trigger a transformation if its affects the current node data.
            if (pItem.item !== this.mNodeData) {
                return;
            }

            // Calculate the current size of the component.
            this.resyncComponent(this.mNodeData!);
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
        this.mUnsubscribe();
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
