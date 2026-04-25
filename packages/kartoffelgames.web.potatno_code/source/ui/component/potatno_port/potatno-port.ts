import { PwbComponent, PwbExport, PwbComponentEvent, ComponentEventEmitter, PwbChild, ComponentState } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import portCss from './potatno-port.css' with { type: 'text' };
import portTemplate from './potatno-port.html' with { type: 'text' };

/**
 * Port component for the potatno-code visual editor.
 * Receives a PotatnoDocumentPort object reference and renders its state.
 * Input value ports that are not connected display editable direct-value inputs.
 */
@PwbComponent({
    selector: 'potatno-port',
    template: portTemplate,
    style: portCss,
})
export class PotatnoPortComponent {
    /**
     * The domain port object to render.
     */
    @PwbExport
    @ComponentState.state()
    public accessor port: PotatnoDocumentPort | null = null;

    /**
     * The node that owns this port — included in all emitted events.
     */
    @PwbExport
    @ComponentState.state()
    public accessor ownerNode: PotatnoDocumentNode | null = null;

    @PwbComponentEvent('port-drag-start')
    private accessor mPortDragStart!: ComponentEventEmitter<PortInteractionDetail>;

    @PwbComponentEvent('port-hover')
    private accessor mPortHover!: ComponentEventEmitter<PortInteractionDetail>;

    @PwbComponentEvent('port-leave')
    private accessor mPortLeave!: ComponentEventEmitter<void>;

    @PwbComponentEvent('direct-value-change')
    private accessor mDirectValueChange!: ComponentEventEmitter<DirectValueChangeDetail>;

    /**
     * Reference to the port circle DOM element for position calculations.
     */
    @PwbChild('portCircle')
    public accessor portCircleElement!: HTMLElement;

    /**
     * Port display name.
     */
    public get portName(): string {
        return this.port?.name ?? '';
    }

    /**
     * Port type label (shown as tooltip).
     */
    public get portTypeLabel(): string {
        return this.port?.type ?? '';
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
        return lClasses.join(' ');
    }

    /**
     * Computed color for the port circle.
     * Flow ports use the primary text color; value ports use a type-derived hue.
     */
    public get portColor(): string {
        if (!this.port || this.port.portType === 'flow') {
            return 'var(--pn-text-primary)';
        }
        return this.getTypeColor(this.port.type);
    }

    /**
     * Whether to show the direct-value input fields.
     * Only for unconnected value input ports.
     */
    public get showDirectValueInput(): boolean {
        if (!this.port) {
            return false;
        }
        return this.port.portType === 'value'
            && this.port.direction === 'input'
            && this.port.connectedPorts.size === 0;
    }

    /**
     * Input element descriptors for the direct-value fields, derived from the port's type definition.
     */
    public get directValueInputDefs(): Array<DirectValueInputDef> {
        if (!this.port || this.port.portType !== 'value') {
            return [];
        }
        const lTypeDef = this.port.project.types.getType(this.port.type);
        return lTypeDef.inputs.map((lInput, lIndex) => ({
            htmlType: lInput.type === 'number' ? 'number' : lInput.type === 'boolean' ? 'checkbox' : 'text',
            index: lIndex,
            name: lInput.name,
            value: this.port!.directValue[lIndex] ?? ''
        }));
    }

    /**
     * Handle pointer down on the port circle to initiate connection dragging.
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
    public onPointerEnter(_pEvent: PointerEvent): void {
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
    public onPointerLeave(_pEvent: PointerEvent): void {
        this.mPortLeave.dispatchEvent(undefined as unknown as void);
    }

    /**
     * Handle input changes on a direct-value input field.
     *
     * @param pEvent - Input event.
     * @param pIndex - Index of the changed value within directValue array.
     */
    public onDirectValueInput(pEvent: Event, pIndex: number): void {
        if (!this.port) {
            return;
        }
        const lTarget: HTMLInputElement = pEvent.target as HTMLInputElement;
        const lNewValues: Array<string> = [...this.port.directValue];
        lNewValues[pIndex] = lTarget.type === 'checkbox' ? (lTarget.checked ? 'true' : 'false') : lTarget.value;
        this.port.setDirectValue(lNewValues);
        this.mDirectValueChange.dispatchEvent({ port: this.port, values: lNewValues });
    }

    /**
     * Generate a deterministic HSL color from a type string.
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
    node: PotatnoDocumentNode;
    port: PotatnoDocumentPort;
    element: HTMLElement;
};

type DirectValueChangeDetail = {
    port: PotatnoDocumentPort;
    values: Array<string>;
};

type DirectValueInputDef = {
    htmlType: string;
    index: number;
    name: string;
    value: string;
};
