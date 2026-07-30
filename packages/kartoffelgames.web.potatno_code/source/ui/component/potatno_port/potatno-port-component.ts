import { Exception } from '@kartoffelgames/core';
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, PwbChild, PwbComponent, PwbExport, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoPortDefinitionDirection } from '../../../project/potatno-port-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import type { PotatnoUiManagerGridPathFindingPoint } from '../../manager/helper/potatno-ui-grid-path-finding.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import portCss from './potatno-port-component.css' with { type: 'text' };
import portTemplate from './potatno-port-component.html' with { type: 'text' };

/**
 * Port component for the potatno-code visual editor.
 * Renders a single {@link PotatnoDocumentPort}.
 */
@PwbComponent({
    selector: 'potatno-port',
    template: portTemplate,
    style: portCss,
})
export class PotatnoPortComponent implements IComponentOnDeconstruct {
    private static readonly DRAG_MIME_TYPE: string = 'application/x-potatno-port';



    private readonly mComponent: Component;
    private readonly mDragPositionEventHandler: PotatnoPortComponentGlobalDragoverHandler;
    private readonly mManager: PotatnoUiManager;
    private mPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null;
    private readonly mUnsubscribe: PotatnoCodeUiManagerUnsubscribe;

    /**
     * Drag position event handler.
     */
    public get dragPositionEventHandler(): PotatnoPortComponentGlobalDragoverHandler {
        return this.mDragPositionEventHandler;
    }

    /**
     * SVG element used for the temporary drag wire.
     */
    @PwbChild('dragConnection')
    public accessor dragConnectionSvg!: SVGSVGElement | null;

    /**
     * Whether this port currently has a validation error.
     */
    public get hasError(): boolean {
        if (this.port === null) {
            return false;
        }

        return this.mManager.integrity.errorItems.has(this.port);
    }

    /**
     * Input element descriptors for the direct-value fields, derived from the port's type definition.
     */
    public get inputDefinitions(): Array<PotatnoPortComponentValueDefinition> {
        // Must be set.
        if (!this.port) {
            return new Array<PotatnoPortComponentValueDefinition>();
        }

        // No further checks a this property is guarded by showValueInput.

        // Read the type definition.
        const lTypeDefinition = this.port.project.types.getType(this.port.resolvedDataType);

        // Map types input definitions with more information.
        return lTypeDefinition.inputs.map((pInput, pIndex) => {
            // Map input type to ... aahm.. input type i guess.
            const lInputType: string = (() => {
                switch (pInput.type) {
                    case 'boolean': return 'checkbox';
                    case 'number': return 'number';
                    case 'string': return 'text';
                }
            })();

            return {
                htmlType: lInputType,
                index: pIndex,
                name: pInput.name,
                value: this.port!.directValue[pIndex] ?? '',
                totalCount: lTypeDefinition.inputs.length
            };
        });
    }

    /**
     * The domain port object to render.
     */
    @PwbExport
    public get port(): PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null {
        return this.mPort;
    } set port(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null) {
        // Skip reassigning the port.
        if (this.mPort === pPort) {
            return;
        }

        // A nullport should never be assigned.
        if (pPort === null) {
            throw new Exception('A null port cant be assigned.', this);
        }

        this.mPort = pPort;

        // Manually update. Synchron.
        this.mComponent.updater.update();
    }

    /**
     * Computed color for the port handle.
     * Flow ports use the primary text color; value ports use a type-derived hue.
     * Generic value ports use the connected port's resolved type color, or muted when unconnected.
     */
    public get portColor(): string {
        // Color for flow ports. Also catch a port null with this.
        if (!this.port || this.port.portType === 'flow') {
            return 'var(--potatno-color-text)';
        }

        return this.mManager.generateStringColor(this.port.resolvedDataType);
    }

    /**
     * Port direction name.
     */
    public get portDirection(): PotatnoPortDefinitionDirection {
        return this.port?.direction ?? 'output';
    }

    /**
     * CSS class string for the port handle element.
     */
    public get portHandleClasses(): string {
        if (!this.port) {
            return '';
        }

        // Create array with port type, connected state and error state.
        const lClasses: Array<string> = [this.port.portType];
        if (this.port.connectedPorts.size > 0) {
            lClasses.push('connected');
        }
        if (this.hasError) {
            lClasses.push('error');
        }

        return lClasses.join(' ');
    }

    /**
     * Port display name.
     */
    public get portName(): string {
        return this.port?.label ?? '';
    }

    /**
     * Port type name (shown as tooltip).
     */
    public get portValueType(): string {
        if (!this.port || this.port.portType !== 'value') {
            return '';
        }

        return this.port.resolvedDataType ?? '';
    }

    /**
     * Whether to show the direct-value input fields.
     * Only for unconnected, non-generic value input ports.
     */
    public get showValueInput(): boolean {
        if (!this.port) {
            return false;
        }

        // Must be a value port and an be an input.
        if (this.port.portType !== 'value' || this.port.direction !== 'input') {
            return false;
        }

        // Must be without connection.
        if (this.port.connectedPorts.size > 0) {
            return false;
        }

        // Hide value input while this port owns a native drag.
        if (this.mManager.grid.draggedPort.hasPort(this.port)) {
            return false;
        }

        // And lastly. Should not be generic.
        return !this.port.node.project.types.isGenericType(this.port.dataType ?? '');
    }

    /**
     * Create the port component.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mComponent = pComponent;
        this.mManager = pManager;
        this.mPort = null;

        // Create the document wide drag handler, as firefox cant fix a 16 year old bug.
        this.mDragPositionEventHandler = (pEvent: DragEvent) => {
            // When nothing is dragged, just stop.
            if (!this.mManager.grid.draggedPort.isDragging) {
                return;
            }

            // Only fire event when the port is matched.
            if (!this.mManager.grid.draggedPort.hasPort(this.port)) {
                return;
            }

            // Play the gamble and skip event when the time differs too much.
            if (performance.now() - pEvent.timeStamp > 100) {
                return;
            }

            this.renderDragWire(pEvent.clientX, pEvent.clientY);
        };
        document.addEventListener('dragover', this.mDragPositionEventHandler, { capture: true });

        // Update component on any connection change.
        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Connection | PotatnoCodeUiManagerChangeType.SpecialValidation, () => {
            this.mComponent.updater.updateAsync();
        });
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe();

        // Remove the global dragover handler when the port gets removed.
        document.removeEventListener('dragover', this.mDragPositionEventHandler, { capture: true });
    }

    /**
     * Handle input changes on a direct-value input field.
     *
     * @param pEvent - Input event.
     * @param pIndex - Index of the changed value within the directValue array.
     */
    public onDirectValueInput(pEvent: Event, pIndex: number): void {
        if (!this.port) {
            return;
        }
        const lTarget: HTMLInputElement = pEvent.target as HTMLInputElement;

        // Read and copy the current port values.
        const lCurrentValues: Array<string> = [...this.port.directValue];

        // Update single value.
        lCurrentValues[pIndex] = (() => {
            // If its a checkbox, convert the checked state.
            if (lTarget.type === 'checkbox') {
                return lTarget.checked ? 'true' : 'false';
            }

            return lTarget.value;
        })();

        // Update port values.
        this.mManager.graph.setPortDirectValue(this.port, lCurrentValues);
    }

    /**
     * Clear native drag state.
     *
     * @param pEvent - Drag event.
     */
    public onDragEnd(pEvent: DragEvent): void {
        pEvent.stopPropagation();
        pEvent.preventDefault();

        this.mManager.grid.setDraggingPort(new Array());

        // Clear drag state.
        if (this.dragConnectionSvg) {
            this.dragConnectionSvg.innerHTML = '';
        }
        this.mComponent.updater.updateAsync();
    }

    /**
     * Keep a valid native port drag droppable on compatible ports.
     *
     * @param pEvent - Drag event.
     */
    public onDragOver(pEvent: DragEvent): void {
        // Validate current dragged ports.
        if (!this.draggedPortCanConnect(pEvent.dataTransfer)) {
            return;
        }

        // Allow a drop on this port.
        pEvent.preventDefault();
        pEvent.stopPropagation();

        // Update the dragging effect.
        if (pEvent.dataTransfer) {
            pEvent.dataTransfer.dropEffect = 'link';
        }
    }

    /**
     * Start a native port drag.
     *
     * @param pEvent - Drag event.
     */
    public onDragStart(pEvent: DragEvent): void {
        if (!this.port || !pEvent.dataTransfer) {
            pEvent.preventDefault();
            return;
        }

        // Register native drag data.
        pEvent.stopPropagation();
        pEvent.dataTransfer.effectAllowed = 'link';
        pEvent.dataTransfer.setData(PotatnoPortComponent.DRAG_MIME_TYPE, this.port.definitionId);

        // Hide the native drag ghost.
        pEvent.dataTransfer.setDragImage(document.createElement('div'), 0, 0);

        // Set this port as global draggin port information.
        this.mManager.grid.setDraggingPort([this.port]);

        // Trigger update to remove potential direct values.
        this.mComponent.updater.updateAsync();
    }

    /**
     * Complete a native port drop.
     *
     * @param pEvent - Drag event.
     */
    public onDrop(pEvent: DragEvent): void {
        // Validate current dragged ports.
        if (!this.draggedPortCanConnect(pEvent.dataTransfer)) {
            return;
        }

        // Connect and consume the drop.
        pEvent.preventDefault();
        pEvent.stopPropagation();

        // Check if something is dragged.
        if (!this.mManager.grid.draggedPort.isDragging) {
            return;
        }

        if (!this.port) {
            return;
        }

        // Throw each dragged port agains the connection. Connections that are not allowed simply return false (ignore the return)
        // In the end only the valid connections are connected. ??? => Profit.
        // Check each dragged port for valid connectivity. Accept if any is valid.
        for (const lDraggedPort of this.mManager.grid.draggedPort.ports) {
            // Connect ports.
            this.mManager.graph.connectPorts(lDraggedPort, this.port);
        }
    }

    /**
     * Create the temporary connection path for a native drag position.
     *
     * @param pClientX - Viewport x coordinate.
     * @param pClientY - Viewport y coordinate.
     *
     * @returns SVG path data in local port coordinates.
     */
    private createDragPath(pClientX: number, pClientY: number): string {
        if (!this.port) {
            return '';
        }

        // Convert viewport coordinates into this port's grid-local coordinates.
        const lEnd: PotatnoUiManagerGridPathFindingPoint = this.mManager.connections.pixelToGridSpace(pClientX, pClientY);

        return this.mManager.connections.createTemporaryPath(this.port, lEnd);
    }

    /**
     * Check whether the dragged port can be connected too this port.
     * Also check whether a native drag contains Potatno port data.
     * Cant check definition id of stored data transfer as its not allways a drop event.
     *
     * @param pDataTransfer - Drag data transfer object.
     *
     * @returns True when the ports can be connected.
     */
    private draggedPortCanConnect(pDataTransfer: DataTransfer | null): boolean {
        // Current port must be loaded.
        if (!this.port) {
            return false;
        }

        // Check if something is dragged.
        if (!this.mManager.grid.draggedPort.isDragging) {
            return false;
        }

        // Datatransfer must include drag type.
        if (!pDataTransfer || !pDataTransfer.types.includes(PotatnoPortComponent.DRAG_MIME_TYPE)) {
            return false;
        }

        // Check each dragged port for valid connectivity. Accept if any is valid.
        for (const lDraggedPort of this.mManager.grid.draggedPort.ports) {
            // Not same port, opposing direction and must have the same port type. (For a connection, the value type does not matter).
            if (lDraggedPort !== this.port && lDraggedPort.direction !== this.port.direction && lDraggedPort.portType === this.port.portType) {
                return true;
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
        if (!this.mManager.grid.draggedPort.hasPort(this.port) || !this.dragConnectionSvg) {
            return;
        }

        // Try to read first element of svg element or create a new.
        let lDragConnectionElement: SVGPathElement | null = this.dragConnectionSvg.firstChild as SVGPathElement | null;
        if (!lDragConnectionElement) {
            lDragConnectionElement = document.createElementNS('http://www.w3.org/2000/svg', 'path') as SVGPathElement;
            this.dragConnectionSvg.appendChild(lDragConnectionElement);
        }

        // Update dragging pointer position and skip if actual grid position has not changed.
        if (!this.mManager.grid.draggedPort.updatePointer(pClientX, pClientY)) {
            return;
        }

        // Read stored port position of the current dragged port.
        const lPortPosition: PotatnoUiManagerGridPathFindingPoint | undefined = this.mManager.grid.draggedPort.portPositions.get(this.port!);
        if (!lPortPosition) {
            return;
        }

        // Calculate offset to grids [0, 0] point.
        const lPortX: number = lPortPosition.x * this.mManager.grid.gridSize;
        const lPortY: number = lPortPosition.y * this.mManager.grid.gridSize;

        // Update svg transformation to meet current grid interaction.
        this.dragConnectionSvg.style.setProperty('transform', `translate(${-lPortX}px, ${-lPortY}px)`);

        // Update drag connection path.
        lDragConnectionElement.setAttribute('d', this.createDragPath(pClientX, pClientY));
    }
}

export type PotatnoPortComponentValueDefinition = {
    htmlType: string;
    index: number;
    name: string;
    value: string;
    totalCount: number;
};

type PotatnoPortComponentGlobalDragoverHandler = (pEvent: DragEvent) => void;
