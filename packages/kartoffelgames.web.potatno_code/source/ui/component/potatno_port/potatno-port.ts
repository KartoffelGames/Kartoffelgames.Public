import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbChild, PwbComponent, PwbComponentEvent, PwbExport, type ComponentEventEmitter, type IComponentOnConnect, type IComponentOnDeconstruct, type IComponentOnUpdate } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoProjectTypesDefinition } from "../../../project/potatno-project-types-definition.ts";
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

    /**
     * The node that owns this port — included in all emitted events.
     */
    @PwbExport
    @ComponentState.state()
    public accessor ownerNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null = null;

    @PwbComponentEvent('port-drag-start')
    private accessor mPortDragStart!: ComponentEventEmitter<PortInteractionDetail>;

    @PwbComponentEvent('port-hover')
    private accessor mPortHover!: ComponentEventEmitter<PortInteractionDetail>;

    @PwbComponentEvent('port-leave')
    private accessor mPortLeave!: ComponentEventEmitter<void>;

    /**
     * Reference to the port circle DOM element for position calculations.
     */
    @PwbChild('portCircle')
    public accessor portCircleElement!: HTMLElement;

    /**
     * Reference to the full port row DOM element for pointer hit tests.
     */
    @PwbChild('portWrapper')
    public accessor portWrapperElement!: HTMLElement;

    /**
     * Whether this port currently has a validation error.
     */
    public get hasError(): boolean {
        return this.port !== null && this.mManager.integrity.errorItems.has(this.port);
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
     * CSS class string for the wrapper div.
     */
    public get portWrapperClasses(): string {
        const lDir: string = this.port?.direction === 'output' ? 'direction-output' : 'direction-input';
        return `port-wrapper ${lDir}`;
    }

    /**
     * CSS class string for the port circle element.
     */
    public get portCircleClasses(): string {
        if (!this.port) {
            return 'port-circle disconnected direction-input';
        }
        const lClasses: Array<string> = ['port-circle'];
        lClasses.push(this.port.connectedPorts.size > 0 ? 'connected' : 'disconnected');
        lClasses.push(this.port.direction === 'output' ? 'direction-output' : 'direction-input');
        lClasses.push(this.port.portType === 'value' ? 'port-type-value' : 'port-type-flow');
        if (this.hasError) {
            lClasses.push('has-error');
        }
        return lClasses.join(' ');
    }

    /**
     * Computed color for the port circle.
     * Flow ports use the primary text color; value ports use a type-derived hue.
     * Generic value ports use the connected port's resolved type color, or muted when unconnected.
     */
    public get portColor(): string {
        if (!this.port || this.port.portType === 'flow') {
            return 'var(--pn-text-primary)';
        }
        if (this.port.node.project.types.isGenericType(this.port.dataType ?? '')) {
            if (this.port.connectedPorts.size > 0) {
                const lConnected = [...this.port.connectedPorts][0];
                return this.getTypeColor(lConnected.dataType ?? '');
            }
            return 'var(--pn-text-muted)';
        }
        return this.getTypeColor(this.port.dataType ?? '');
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
     * Input element descriptors for the direct-value fields, derived from the port's type definition.
     */
    public get directValueInputDefs(): Array<DirectValueInputDef> {
        if (!this.port || this.port.portType !== 'value') {
            return [];
        }
        if (this.port.node.project.types.isGenericType(this.port.dataType ?? '')) {
            return [];
        }
        const lTypeDef = this.port.project.types.getType(this.port.dataType ?? '');
        return lTypeDef.inputs.map((lInput, lIndex) => ({
            htmlType: lInput.type === 'number' ? 'number' : lInput.type === 'boolean' ? 'checkbox' : 'text',
            index: lIndex,
            name: lInput.name,
            value: this.port!.directValue[lIndex] ?? ''
        }));
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
     * After each update, register this port's anchor and hit elements with the shared grid manager.
     * The connection layer anchors wires to the small handle, while interaction can use the full row.
     */
    public onUpdate(): void {
        const lPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null = this.port;
        const lNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null = this.ownerNode;
        if (!lPort || !lNode) {
            return;
        }

        let lCircleEl: HTMLElement = this.portCircleElement;

        if (lPort === this.mLastRegisteredPort && lCircleEl === this.mLastRegisteredElement ) {
            return;
        }

        this.mLastRegisteredElement = lCircleEl;
        this.mLastRegisteredPort = lPort;
        this.mManager.grid.registerPortElement(lPort, lCircleEl);

        // The port element's real position is now known; nudge the connection layer to redraw any
        // wire that used an estimated anchor before this port mounted. An empty transformation
        // re-applies the node's current geometry, so this only fires the redraw notification.
        this.mManager.graph.transformNode(lNode, {});
    }

    /**
     * Handle pointer down on the port circle to initiate connection dragging.
     *
     * @param pEvent - Pointer event from the port circle.
     */
    public onPointerDown(pEvent: PointerEvent): void {
        pEvent.stopPropagation();
        pEvent.preventDefault();
        if (!this.port || !this.ownerNode) {
            return;
        }
        this.mPortDragStart.dispatchEvent({
            node: this.ownerNode,
            port: this.port,
            element: this.portCircleElement
        });
    }

    /**
     * Handle pointer enter on the port circle for connection drop targeting.
     */
    public onPointerEnter(): void {
        if (!this.port || !this.ownerNode) {
            return;
        }
        this.mPortHover.dispatchEvent({
            node: this.ownerNode,
            port: this.port,
            element: this.portCircleElement
        });
    }

    /**
     * Handle pointer leave on the port circle.
     */
    public onPointerLeave(): void {
        this.mPortLeave.dispatchEvent(undefined as unknown as void);
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
    node: PotatnoDocumentNode<PotatnoProjectTypesDefinition>;
    port: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
    element: HTMLElement;
};

type DirectValueInputDef = {
    htmlType: string;
    index: number;
    name: string;
    value: string;
};
