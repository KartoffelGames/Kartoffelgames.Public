import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbComponent, PwbComponentEvent, PwbExport, type ComponentEventEmitter, type IComponentOnConnect, type IComponentOnDeconstruct, type IComponentOnUpdate } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
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
export class PotatnoPortComponent implements IComponentOnConnect, IComponentOnDeconstruct, IComponentOnUpdate {
    private readonly mComponent: Component;
    private mLastRegisteredElement: HTMLElement | null;
    private mLastRegisteredPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null;
    private readonly mManager: PotatnoUiManager;
    private mUnsubscribe: (() => void) | null;

    /**
     * The domain port object to render.
     */
    @PwbExport
    @ComponentState.state()
    public accessor port: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null = null;

    @PwbComponentEvent('port-drag-start')
    private accessor mPortDragStart!: ComponentEventEmitter<PortInteractionDetail>;

    /**
     * Input element descriptors for the direct-value fields, derived from the port's type definition.
     */
    public get inputDefinitions(): Array<PotatnoPortValueDefinition> {
        if (!this.port || this.port.portType !== 'value') {
            return [];
        }
        if (this.port.node.project.types.isGenericType(this.port.dataType ?? '')) {
            return [];
        }
        const lTypeDefinition = this.port.project.types.getType(this.port.dataType ?? '');
        return lTypeDefinition.inputs.map((pInput, pIndex) => ({
            htmlType: pInput.type === 'number' ? 'number' : pInput.type === 'boolean' ? 'checkbox' : 'text',
            index: pIndex,
            name: pInput.name,
            value: this.port!.directValue[pIndex] ?? '',
            totalCount: lTypeDefinition.inputs.length
        }));
    }

    /**
     * Whether this port currently has a validation error.
     */
    public get hasError(): boolean {
        return this.port !== null && this.mManager.integrity.errorItems.has(this.port);
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

        return this.getTypeColor(this.port.resolvedDataType);
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
            return 'port-handle--disconnected';
        }
        const lClasses: Array<string> = new Array<string>();
        lClasses.push(this.port.connectedPorts.size > 0 ? 'port-handle--connected' : 'port-handle--disconnected');
        lClasses.push(this.port.portType === 'value' ? 'port-handle--type-value' : 'port-handle--type-flow');
        if (this.hasError) {
            lClasses.push('port-handle--has-error');
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
     * Port type label (shown as tooltip).
     */
    public get portTypeLabel(): string {
        return this.port?.dataType ?? '';
    }

    /**
     * Whether to show the direct-value input fields.
     * Only for unconnected, non-generic value input ports.
     */
    public get showDirectValueInput(): boolean {
        if (!this.port) {
            return false;
        }
        return this.port.portType === 'value'
            && this.port.direction === 'input'
            && this.port.connectedPorts.size === 0
            && !this.port.node.project.types.isGenericType(this.port.dataType ?? '');
    }

    /**
     * Create the port component.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mComponent = pComponent;
        this.mLastRegisteredElement = null;
        this.mLastRegisteredPort = null;
        this.mManager = pManager;
        this.mUnsubscribe = null;
    }

    /**
     * Subscribe to manager events that change this port's connection-dependent visuals.
     */
    public onConnect(): void {
        this.mUnsubscribe = this.mManager.subscribe(
            PotatnoCodeUiManagerChangeType.Connection | PotatnoCodeUiManagerChangeType.Node,
            null,
            () => {
                this.mComponent.updater.update();
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
        const lNewValues: Array<string> = [...this.port.directValue];
        lNewValues[pIndex] = lTarget.type === 'checkbox' ? (lTarget.checked ? 'true' : 'false') : lTarget.value;
        this.mManager.graph.setPortDirectValue(this.port, lNewValues);
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
        this.mPortDragStart.dispatchEvent({
            port: this.port!
        });
    }

    /**
     * After each update, register this port component with the shared grid manager.
     */
    public onUpdate(): void {
        const lPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null = this.port;
        if (!lPort) {
            return;
        }

        const lPortElement: HTMLElement = this.mComponent.element;

        if (lPort === this.mLastRegisteredPort && lPortElement === this.mLastRegisteredElement) {
            return;
        }

        this.mLastRegisteredElement = lPortElement;
        this.mLastRegisteredPort = lPort;
        this.mManager.grid.registerPortElement(lPort, lPortElement);
    }

    /**
     * Generate a deterministic HSL color from a type string.
     *
     * @param pType - Type identifier to derive a colour from.
     *
     * @returns A CSS HSL color string.
     */
    private getTypeColor(pType: string): string {
        let lHash: number = 0;
        for (let lIndex: number = 0; lIndex < pType.length; lIndex++) {
            lHash = pType.charCodeAt(lIndex) + ((lHash << 5) - lHash);
        }
        const lHue: number = (Math.abs(lHash) * 137.508) % 360;
        return `hsl(${lHue}, 70%, 60%)`;
    }
}

export type PortInteractionDetail = {
    port: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
};

type PotatnoPortValueDefinition = {
    htmlType: string;
    index: number;
    name: string;
    value: string;
    totalCount: number;
};
