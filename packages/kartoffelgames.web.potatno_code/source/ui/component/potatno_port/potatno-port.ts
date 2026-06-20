import { Exception } from "@kartoffelgames/core";
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, PwbComponent, PwbComponentEvent, PwbExport, type ComponentEventEmitter, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoPortDefinitionDirection } from '../../../project/potatno-port-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager } from '../../manager/potatno-ui-manager.ts';
import portCss from './potatno-port.css' with { type: 'text' };
import portTemplate from './potatno-port.html' with { type: 'text' };

/**
 * Port component for the potatno-code visual editor.
 *
 * Renders a single {@link PotatnoDocumentPort}. The owning node pushes in the port and owner-node
 * references; error highlighting comes from the shared {@link PotatnoUiManager}, and direct-value
 * edits are committed through it. The component self-updates by subscribing to manager events so it
 * re-renders its connection-dependent visuals (direct-value inputs, colour) without a version token.
 */
@PwbComponent({
    selector: 'potatno-port',
    template: portTemplate,
    style: portCss,
})
export class PotatnoPortComponent implements IComponentOnConnect, IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private mPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null;
    private readonly mManager: PotatnoUiManager;
    private mUnsubscribe: (() => void) | null;

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
        this.mManager.grid.registerPortElement(pPort, this.mComponent.element);

        // Manually update.
        this.mComponent.updater.updateAsync();
    }

    @PwbComponentEvent('port-drag-start')
    private accessor mPortDragStart!: ComponentEventEmitter<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>;

    /**
     * Input element descriptors for the direct-value fields, derived from the port's type definition.
     */
    public get inputDefinitions(): Array<PotatnoPortValueDefinition> {
        // Must be set.
        if (!this.port) {
            return new Array<PotatnoPortValueDefinition>();
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
     * Whether this port currently has a validation error.
     */
    public get hasError(): boolean {
        if (this.port === null) {
            return false;
        }

        return this.mManager.integrity.errorItems.has(this.port);
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

        return this.mManager.generateTypeColor(this.port.resolvedDataType);
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
        const lClasses: Array<string> = [this.port.portType]
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
    public get portType(): string {
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
        this.mPort = null;
        this.mManager = pManager;
        this.mUnsubscribe = null;
    }

    /**
     * Subscribe to manager events that change this port's connection-dependent visuals.
     */
    public onConnect(): void {
        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Connection | PotatnoCodeUiManagerChangeType.Node, null, () => {
            this.mComponent.updater.updateAsync();
        });
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe?.();
        this.mUnsubscribe = null;
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
     * Handle pointer down on the port to initiate connection dragging.
     *
     * @param pEvent - Pointer event from the port.
     */
    public onPointerDown(pEvent: PointerEvent): void {
        // Skip anything when clicking the port.
        pEvent.stopPropagation();
        pEvent.preventDefault();

        // Dispatch a drag start event.
        // When the port is displayed, the port should be initialized. 
        this.mPortDragStart.dispatchEvent(this.port!);
    }
}

type PotatnoPortValueDefinition = {
    htmlType: string;
    index: number;
    name: string;
    value: string;
    totalCount: number;
};
