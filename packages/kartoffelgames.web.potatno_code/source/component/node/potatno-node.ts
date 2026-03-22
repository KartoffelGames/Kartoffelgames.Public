import { PwbComponent, Processor, PwbExport, PwbComponentEvent, ComponentEventEmitter } from '@kartoffelgames/web-potato-web-builder';
import type { ComponentEvent } from '@kartoffelgames/web-potato-web-builder';
import { NodeCategory } from '../../data_model/enum/node-category.enum.ts';
import nodeCss from './potatno-node.css';
import nodeTemplate from './potatno-node.html';

// Ensure the port component is registered before the node template is processed.
import '../port/potatno-port.ts';

/**
 * Plain render data for a node, pre-computed by the parent editor.
 * All arrays are already spread from Map.values() and all text fields
 * are pre-extracted, so no untrackable Map/Array calls occur in the
 * component getters.
 */
export interface NodeRenderData {
    id: string;
    definitionName: string;
    category: string;
    categoryColor: string;
    categoryIcon: string;
    label: string;
    position: { x: number; y: number };
    size: { w: number; h: number };
    system: boolean;
    selected: boolean;
    inputs: Array<{ id: string; name: string; type: string; direction: string; connectedTo: string | null }>;
    outputs: Array<{ id: string; name: string; type: string; direction: string; connectedTo: string | null }>;
    flowInputs: Array<{ id: string; name: string; direction: string; connectedTo: string | null }>;
    flowOutputs: Array<{ id: string; name: string; direction: string; connectedTo: string | null }>;
    hasDefinition: boolean;
    valueText: string;
    commentText: string;
    pixelX: number;
    pixelY: number;
}

/**
 * Detail payload for port drag start events, re-emitted from child ports.
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
 * Detail payload for node selection events.
 */
type NodeSelectDetail = {
    nodeId: string;
    shiftKey: boolean;
};

/**
 * Detail payload for node drag start events.
 */
type NodeDragStartDetail = {
    nodeId: string;
    startX: number;
    startY: number;
};

/**
 * Detail payload for the open-function event.
 */
type OpenFunctionDetail = {
    definitionName: string;
};

/**
 * Detail payload for value change events on value nodes.
 */
type ValueChangeDetail = {
    nodeId: string;
    property: string;
    value: string;
};

/**
 * Detail payload for comment text change events.
 */
type CommentChangeDetail = {
    nodeId: string;
    text: string;
};

/**
 * Detail payload for resize events on comment nodes.
 */
type ResizeStartDetail = {
    nodeId: string;
    startX: number;
    startY: number;
};

/**
 * Node component for the potatno-code visual editor.
 * Renders a visual node with a colored header, ports, and body content.
 * Supports standard nodes, value nodes (with text input), and comment nodes (resizable).
 */
@PwbComponent({
    selector: 'potatno-node',
    template: nodeTemplate,
    style: nodeCss,
})
export class PotatnoNodeComponent extends Processor {
    // ── Exported properties ─────────────────────────────────────────────

    /**
     * The node render data. Set by the parent editor. Contains pre-computed
     * arrays and text fields so no Map/Array iteration happens inside this
     * component's getters.
     */
    @PwbExport
    public nodeData: NodeRenderData | null = null;

    /**
     * Whether this node is currently selected.
     */
    @PwbExport
    public selected: boolean = false;

    /**
     * Grid size in pixels. Used to convert grid-unit positions to pixel values.
     */
    @PwbExport
    public gridSize: number = 20;

    // ── Event emitters ──────────────────────────────────────────────────

    /**
     * Fired when the user clicks the node to select it.
     */
    @PwbComponentEvent('node-select')
    private accessor mNodeSelect!: ComponentEventEmitter<NodeSelectDetail>;

    /**
     * Fired when the user starts dragging the node.
     */
    @PwbComponentEvent('node-drag-start')
    private accessor mNodeDragStart!: ComponentEventEmitter<NodeDragStartDetail>;

    /**
     * Fired when a child port emits a drag start (re-emitted for the canvas).
     */
    @PwbComponentEvent('port-drag-start')
    private accessor mPortDragStart!: ComponentEventEmitter<PortDragStartDetail>;

    /**
     * Fired when the pointer enters a child port (re-emitted for the canvas).
     */
    @PwbComponentEvent('port-hover')
    private accessor mPortHover!: ComponentEventEmitter<PortDragStartDetail>;

    /**
     * Fired when the pointer leaves a child port (re-emitted for the canvas).
     */
    @PwbComponentEvent('port-leave')
    private accessor mPortLeave!: ComponentEventEmitter<void>;

    /**
     * Fired when the open-function button is clicked on a function node.
     */
    @PwbComponentEvent('open-function')
    private accessor mOpenFunction!: ComponentEventEmitter<OpenFunctionDetail>;

    /**
     * Fired when the value input on a value node changes.
     */
    @PwbComponentEvent('value-change')
    private accessor mValueChange!: ComponentEventEmitter<ValueChangeDetail>;

    /**
     * Fired when the comment text on a comment node changes.
     */
    @PwbComponentEvent('comment-change')
    private accessor mCommentChange!: ComponentEventEmitter<CommentChangeDetail>;

    /**
     * Fired when the user starts resizing a comment node.
     */
    @PwbComponentEvent('resize-start')
    private accessor mResizeStart!: ComponentEventEmitter<ResizeStartDetail>;

    // ── Computed template properties ────────────────────────────────────

    /**
     * Inline CSS style string for positioning the node on the canvas.
     * Converts grid-unit position and size to pixel values.
     */
    public get nodeStyle(): string {
        if (!this.nodeData) {
            return '';
        }
        return `left: ${this.nodeData.position.x * this.gridSize}px; top: ${this.nodeData.position.y * this.gridSize}px; width: ${this.nodeData.size.w * this.gridSize}px;`;
    }

    /**
     * The unique node id from the render data.
     */
    public get nodeId(): string {
        return this.nodeData?.id ?? '';
    }

    /**
     * CSS class string for the selected state.
     */
    public get selectedClass(): string {
        return this.selected ? 'selected' : '';
    }

    /**
     * Whether this is a comment-category node.
     */
    public get isComment(): boolean {
        return this.nodeData?.category === NodeCategory.Comment;
    }

    /**
     * Whether this is a value-category node.
     */
    public get isValue(): boolean {
        return this.nodeData?.category === NodeCategory.Value;
    }

    /**
     * Whether this is a function-category node (shows the open button).
     */
    public get isFunction(): boolean {
        return this.nodeData?.category === NodeCategory.Function;
    }

    /**
     * Whether the open-function button should be shown.
     * Only for non-system function nodes that represent user-defined functions.
     * Currently always false since user-function node types are not yet supported.
     */
    public get showOpenButton(): boolean {
        return false;
    }

    /**
     * Data input ports as a pre-spread array from the render data.
     */
    public get inputPorts(): Array<any> {
        return this.nodeData?.inputs ?? [];
    }

    /**
     * Data output ports as a pre-spread array from the render data.
     */
    public get outputPorts(): Array<any> {
        return this.nodeData?.outputs ?? [];
    }

    /**
     * Flow input ports as a pre-spread array from the render data.
     */
    public get flowInputPorts(): Array<any> {
        return this.nodeData?.flowInputs ?? [];
    }

    /**
     * Flow output ports as a pre-spread array from the render data.
     */
    public get flowOutputPorts(): Array<any> {
        return this.nodeData?.flowOutputs ?? [];
    }

    // ── Event handlers ──────────────────────────────────────────────────

    /**
     * Handle pointer down on the node for selection and drag initiation.
     */
    public onNodePointerDown(pEvent: PointerEvent): void {
        // Ignore clicks that originated from port elements.
        // Inside this shadow DOM, event retargeting makes pEvent.target the
        // <potatno-port> host element when the click originates from within
        // the port's own shadow DOM.
        if ((pEvent.target as HTMLElement).tagName?.toLowerCase() === 'potatno-port') {
            return;
        }

        // Emit selection event.
        this.mNodeSelect.dispatchEvent({
            nodeId: this.nodeId,
            shiftKey: pEvent.shiftKey
        });

        // Emit drag start event for the canvas to handle positioning.
        this.mNodeDragStart.dispatchEvent({
            nodeId: this.nodeId,
            startX: pEvent.clientX,
            startY: pEvent.clientY
        });
    }

    /**
     * Re-emit a port-drag-start event received from a child port component.
     */
    public onPortDragStart(pEvent: ComponentEvent<PortDragStartDetail>): void {
        this.mPortDragStart.dispatchEvent(pEvent.value);
    }

    /**
     * Re-emit a port-hover event received from a child port component.
     */
    public onPortHover(pEvent: ComponentEvent<PortDragStartDetail>): void {
        this.mPortHover.dispatchEvent(pEvent.value);
    }

    /**
     * Re-emit a port-leave event received from a child port component.
     */
    public onPortLeave(_pEvent: ComponentEvent<void>): void {
        this.mPortLeave.dispatchEvent(undefined as unknown as void);
    }

    /**
     * Handle click on the open-function button.
     */
    public onOpenFunction(pEvent: MouseEvent): void {
        pEvent.stopPropagation();
        this.mOpenFunction.dispatchEvent({
            definitionName: this.nodeData?.definitionName ?? ''
        });
    }

    /**
     * Handle text input changes on value nodes.
     */
    public onValueInput(pEvent: Event): void {
        const lTarget: HTMLInputElement = pEvent.target as HTMLInputElement;
        this.mValueChange.dispatchEvent({
            nodeId: this.nodeId,
            property: 'value',
            value: lTarget.value
        });
    }

    /**
     * Handle text input changes on comment nodes.
     */
    public onCommentInput(pEvent: Event): void {
        const lTarget: HTMLTextAreaElement = pEvent.target as HTMLTextAreaElement;
        this.mCommentChange.dispatchEvent({
            nodeId: this.nodeId,
            text: lTarget.value
        });
    }

    /**
     * Handle pointer down on the resize handle of comment nodes.
     */
    public onResizeStart(pEvent: PointerEvent): void {
        pEvent.stopPropagation();
        pEvent.preventDefault();
        this.mResizeStart.dispatchEvent({
            nodeId: this.nodeId,
            startX: pEvent.clientX,
            startY: pEvent.clientY
        });
    }
}
