import { Exception } from '@kartoffelgames/core';
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { KgDraggableModule, type KgDraggableModuleEvent } from '@kartoffelgames/web-components';
import { Component, PwbComponent, PwbExport, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoPortDefinitionDirection } from '../../../project/potatno-port-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoPortHandleComponent } from '../potatno_port_handle/potatno-port-handle-component.ts';
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
    components: [PotatnoPortHandleComponent],
    modules: [KgDraggableModule]
})
export class PotatnoPortComponent implements IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private mPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null;
    private readonly mUnsubscribeValidation: PotatnoCodeUiManagerUnsubscribe;

    /**
     * Whether this port currently has a validation error.
     */
    public get hasError(): boolean {
        return this.mManager.integrity.errorItems.has(this.port);
    }

    /**
     * Input element descriptors for the direct-value fields, derived from the port's type definition.
     */
    public get inputDefinitions(): Array<PotatnoPortComponentValueDefinition> {
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
                value: this.port.directValue[pIndex] ?? '',
                totalCount: lTypeDefinition.inputs.length
            };
        });
    }

    /**
     * Get connected state of port.
     */
    public get isConnected(): boolean {
        return this.port.connectedPorts.size > 0;
    }

    /**
     * The domain port object to render.
     */
    @PwbExport()
    public get port(): PotatnoDocumentPort<PotatnoProjectTypesDefinition> {
        if (!this.mPort) {
            throw new Exception('Port is not setup', this);
        }

        return this.mPort;
    } set port(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>) {
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
        if (this.port.portType === 'flow') {
            return 'var(--potatno-color-text)';
        }

        return this.mManager.generateStringColor(this.port.resolvedDataType);
    }

    /**
     * Port direction name.
     */
    public get portDirection(): PotatnoPortDefinitionDirection {
        return this.port.direction ?? 'output';
    }

    /**
     * Port display name.
     */
    public get portName(): string {
        return this.port.label ?? '';
    }

    /**
     * Port type.
     */
    public get portType(): string {
        return this.port.portType;
    }

    /**
     * Port type name (shown as tooltip).
     */
    public get portValueType(): string {
        if (this.port.portType !== 'value') {
            return '';
        }

        return this.port.resolvedDataType ?? '';
    }

    /**
     * Whether to show the direct-value input fields.
     * Only for unconnected, non-generic value input ports.
     */
    public get showValueInput(): boolean {
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

        // Update component on any connection change.
        this.mUnsubscribeValidation = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Connection | PotatnoCodeUiManagerChangeType.SpecialValidation, () => {
            this.mComponent.updater.updateAsync();
        });
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribeValidation();
    }

    /**
     * Handle input changes on a direct-value input field.
     *
     * @param pEvent - Input event.
     * @param pIndex - Index of the changed value within the directValue array.
     */
    public onDirectValueInput(pEvent: Event, pIndex: number): void {
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
     * Clear drag state on drag end.
     */
    public onDragEnd(): void {
        this.mManager.grid.setDraggingPort([]);

        // Trigger update to add potential direct values.
        this.mComponent.updater.updateAsync();
    }

    /**
     * Share this port as the dragged data and set it as the global dragging port on drag start.
     *
     * @param pEvent - Drag start event.
     */
    public onDragStart(pEvent: KgDraggableModuleEvent): void {
        // Share the dragged port with drop targets.
        pEvent.setData<Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>>([this.port]);

        // Keep the global dragging state for the temporary wire and value input hiding.
        this.mManager.grid.setDraggingPort([this.port]);

        // Trigger update to remove potential direct values.
        this.mComponent.updater.updateAsync();
    }

    /**
     * Complete a port drop by connecting each dragged port to this port.
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

        // Throw each dragged port agains the connection. Connections that are not allowed simply return false (ignore the return)
        // In the end only the valid connections are connected. ??? => Profit.
        for (const lDraggedPort of lDraggedPorts) {
            // Connect ports.
            this.mManager.graph.connectPorts(lDraggedPort, this.port);
        }
    }

    /**
     * Check whether any of the dragged ports can be connected to this port.
     *
     * @param pDraggedPorts - Currently dragged ports.
     *
     * @returns True when the ports can be connected.
     */
    private draggedPortCanConnect(pDraggedPorts: Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>): boolean {
        // Check each dragged port for valid connectivity. Accept if any is valid.
        for (const lDraggedPort of pDraggedPorts) {
            // Not same port, opposing direction and must have the same port type. (For a connection, the value type does not matter).
            if (lDraggedPort !== this.port && lDraggedPort.direction !== this.port.direction && lDraggedPort.portType === this.port.portType) {
                return true;
            }
        }

        return false;
    }
}

export type PotatnoPortComponentValueDefinition = {
    htmlType: string;
    index: number;
    name: string;
    value: string;
    totalCount: number;
};
