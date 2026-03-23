import { PwbComponent, Processor, PwbExport, PwbComponentEvent, ComponentEventEmitter, PwbChild } from '@kartoffelgames/web-potato-web-builder';
import portCss from './potatno-port.css';
import portTemplate from './potatno-port.html';

/**
 * Detail payload emitted on port drag start.
 */
type PortDragStartDetail = {
    nodeId: string;
    portId: string;
    portKind: string;
    direction: string;
    type: string;
    element: HTMLElement;
};

/**
 * Port component for the potatno-code visual editor.
 * Renders a small circle with a label. Input ports show label on the right,
 * output ports show label on the left (via CSS host direction).
 */
@PwbComponent({
    selector: 'potatno-port',
    template: portTemplate,
    style: portCss,
})
export class PotatnoPortComponent extends Processor {
    /**
     * Display name of the port.
     */
    @PwbExport
    public name: string = '';

    /**
     * Data type of the port (empty for flow ports).
     */
    @PwbExport
    public type: string = '';

    /**
     * Unique identifier for this port instance.
     */
    @PwbExport
    public portId: string = '';

    /**
     * Identifier of the node that owns this port.
     */
    @PwbExport
    public nodeId: string = '';

    /**
     * Direction of the port: 'input' or 'output'.
     */
    @PwbExport
    public direction: string = 'input';

    /**
     * Whether this port currently has a connection.
     */
    @PwbExport
    public connected: boolean = false;

    /**
     * Whether this port is in an invalid state (type mismatch, etc.).
     */
    @PwbExport
    public invalid: boolean = false;

    /**
     * Kind of port: 'data' or 'flow'.
     */
    @PwbExport
    public portKind: string = 'data';

    @PwbComponentEvent('port-drag-start')
    private accessor mPortDragStart!: ComponentEventEmitter<PortDragStartDetail>;

    @PwbComponentEvent('port-hover')
    private accessor mPortHover!: ComponentEventEmitter<PortDragStartDetail>;

    @PwbComponentEvent('port-leave')
    private accessor mPortLeave!: ComponentEventEmitter<void>;

    /**
     * Reference to the port circle DOM element for position calculations.
     */
    @PwbChild('portCircle')
    public accessor portCircleElement!: HTMLElement;

    /**
     * CSS class string for the wrapper div that controls layout direction.
     * Output ports use row-reverse to put the circle on the right side.
     */
    public get portWrapperClasses(): string {
        return this.direction === 'output' ? 'port-wrapper direction-output' : 'port-wrapper direction-input';
    }

    /**
     * Combined CSS class string for the port circle element.
     * Includes base class, connection state, validity, and direction.
     */
    public get portCircleClasses(): string {
        const lClasses: Array<string> = ['port-circle'];
        if (this.connected) {
            lClasses.push('connected');
        } else {
            lClasses.push('disconnected');
        }
        if (this.invalid) {
            lClasses.push('invalid');
        }
        lClasses.push(this.direction === 'output' ? 'direction-output' : 'direction-input');
        return lClasses.join(' ');
    }

    /**
     * Computed color for the port circle. Flow ports use the primary text color.
     * Data ports use a deterministic hue derived from the type string.
     */
    public get portColor(): string {
        if (this.portKind === 'flow') {
            return 'var(--pn-text-primary)';
        }
        return this.getTypeColor(this.type);
    }

    /**
     * Handle pointer down on the port circle to initiate connection dragging.
     *
     * @param pEvent - Pointer event.
     */
    public onPointerDown(pEvent: PointerEvent): void {
        pEvent.stopPropagation();
        pEvent.preventDefault();
        this.mPortDragStart.dispatchEvent({
            nodeId: this.nodeId,
            portId: this.portId,
            portKind: this.portKind,
            direction: this.direction,
            type: this.type,
            element: this.portCircleElement
        });
    }

    /**
     * Handle pointer enter on the port circle for connection drop targeting.
     *
     * @param _pEvent - Pointer event.
     */
    public onPointerEnter(_pEvent: PointerEvent): void {
        this.mPortHover.dispatchEvent({
            nodeId: this.nodeId,
            portId: this.portId,
            portKind: this.portKind,
            direction: this.direction,
            type: this.type,
            element: this.portCircleElement
        });
    }

    /**
     * Handle pointer leave on the port circle to clear connection drop target.
     *
     * @param _pEvent - Pointer event.
     */
    public onPointerLeave(_pEvent: PointerEvent): void {
        this.mPortLeave.dispatchEvent(undefined as unknown as void);
    }

    /**
     * Generate a deterministic HSL color from a type string.
     * Uses a simple hash to map type names to hue values.
     *
     * @param pType - The type string.
     * @returns HSL color string.
     */
    private getTypeColor(pType: string): string {
        let lHash: number = 0;
        for (let lIndex: number = 0; lIndex < pType.length; lIndex++) {
            lHash = pType.charCodeAt(lIndex) + ((lHash << 5) - lHash);
        }
        // Use golden angle (137.5 deg) steps for maximum hue separation.
        const lIndex: number = Math.abs(lHash) % 256;
        const lHue: number = (lIndex * 137.508) % 360;
        return `hsl(${lHue}, 70%, 60%)`;
    }
}
