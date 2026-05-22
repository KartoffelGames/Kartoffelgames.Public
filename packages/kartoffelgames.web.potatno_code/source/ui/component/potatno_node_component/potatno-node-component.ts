import type { ComponentEvent, IComponentOnUpdate } from '@kartoffelgames/web-potato-web-builder';
import { ComponentEventEmitter, ComponentState, PwbChild, PwbComponent, PwbComponentEvent, PwbExport } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PortInteractionDetail } from '../potatno_port/potatno-port.ts';
import nodeCss from './potatno-node-component.css' with { type: 'text' };
import nodeTemplate from './potatno-node-component.html' with { type: 'text' };

// Ensure the port component is registered before the node template is processed.
import { NodeCategory, NodeCategoryMeta } from "../../node/node-category.enum.ts";
import '../potatno_port/potatno-port.ts';

/**
 * Node component for the potatno-code visual editor.
 * Receives a PotatnoDocumentNode object reference and renders its state.
 */
@PwbComponent({
    selector: 'potatno-node',
    template: nodeTemplate,
    style: nodeCss,
})
export class PotatnoNodeComponent implements IComponentOnUpdate {
    // ── Exported properties ─────────────────────────────────────────────

    /**
     * The domain node object to render.
     */
    @PwbExport
    @ComponentState.state()
    public accessor nodeData: PotatnoDocumentNode<any> | null = null;

    /**
     * Version counter that increments whenever any connection in the document changes.
     * Passed down to port components so they re-render and re-evaluate connection state.
     */
    @PwbExport
    @ComponentState.state()
    public accessor connectionVersion: number = 0;

    /**
     * Whether this node is currently selected.
     */
    @PwbExport
    @ComponentState.state()
    public accessor selected: boolean = false;

    /**
     * Whether this node has a validation error (triggers red outline).
     */
    @PwbExport
    @ComponentState.state()
    public accessor hasError: boolean = false;

    /**
     * Set of ports on this node that have validation errors.
     * Shared read-only reference from the graph — checked per-port in the template.
     */
    @PwbExport
    @ComponentState.state({ complexValue: true })
    public accessor errorPorts: ReadonlySet<PotatnoDocumentPort<any>> = new Set();

    /**
     * Grid size in pixels. Used to convert grid-unit positions to pixel values.
     */
    @PwbExport
    @ComponentState.state()
    public accessor gridSize: number = 20;

    /**
     * Preview element to display inline. Set by the parent editor via template binding.
     */
    @PwbExport
    public previewElement: HTMLElement | null = null;

    /**
     * Reference to the preview container element inside the node.
     * Only available for standard nodes (not reroute or comment).
     */
    @PwbChild('NodePreview')
    private accessor mPreviewContainer!: HTMLDivElement;

    // ── Event emitters ──────────────────────────────────────────────────

    @PwbComponentEvent('node-select')
    private accessor mNodeSelect!: ComponentEventEmitter<NodeSelectDetail>;

    @PwbComponentEvent('node-drag-start')
    private accessor mNodeDragStart!: ComponentEventEmitter<NodeDragStartDetail>;

    @PwbComponentEvent('port-drag-start')
    private accessor mPortDragStart!: ComponentEventEmitter<PortInteractionDetail>;

    @PwbComponentEvent('port-hover')
    private accessor mPortHover!: ComponentEventEmitter<PortInteractionDetail>;

    @PwbComponentEvent('port-leave')
    private accessor mPortLeave!: ComponentEventEmitter<void>;

    @PwbComponentEvent('open-function')
    private accessor mOpenFunction!: ComponentEventEmitter<OpenFunctionDetail>;

    @PwbComponentEvent('comment-change')
    private accessor mCommentChange!: ComponentEventEmitter<CommentChangeDetail>;

    @PwbComponentEvent('resize-start')
    private accessor mResizeStart!: ComponentEventEmitter<ResizeStartDetail>;

    @PwbComponentEvent('direct-value-change')
    private accessor mDirectValueChange!: ComponentEventEmitter<DirectValueChangeDetail>;

    @PwbComponentEvent('port-element-ready')
    private accessor mPortElementReady!: ComponentEventEmitter<PortInteractionDetail>;

    // ── Computed template properties ────────────────────────────────────

    /**
     * CSS class string for the selected state.
     */
    public get selectedClass(): string {
        return this.selected ? 'selected' : '';
    }

    /**
     * CSS class string for the error state.
     */
    public get hasErrorClass(): string {
        return this.hasError ? 'has-error' : '';
    }

    /**
     * Return whether the given port has a validation error.
     *
     * @param pPort - Port to check.
     */
    public isPortError(pPort: PotatnoDocumentPort<any>): boolean {
        return this.errorPorts.has(pPort);
    }

    /**
     * Whether this is a comment-category node.
     */
    public get isComment(): boolean {
        return this.nodeData?.category === NodeCategory.Comment;
    }

    /**
     * Whether this is a reroute passthrough node.
     */
    public get isReroute(): boolean {
        return this.nodeData?.category === NodeCategory.Reroute;
    }

    /**
     * Whether this is a function-category node.
     */
    public get isFunction(): boolean {
        return this.nodeData?.category === NodeCategory.Function;
    }

    /**
     * Whether the open-function button should be shown.
     * Only for non-system function nodes.
     */
    public get showOpenButton(): boolean {
        if (!this.nodeData) {
            return false;
        }
        return this.isFunction && !this.nodeData.isSystem;
    }

    /**
     * Category display color.
     */
    public get categoryColor(): string {
        if (!this.nodeData) {
            return '';
        }
        return NodeCategoryMeta.get(this.nodeData.category).cssColor;
    }

    /**
     * Category display icon.
     */
    public get categoryIcon(): string {
        if (!this.nodeData) {
            return '';
        }
        return NodeCategoryMeta.get(this.nodeData.category).icon;
    }

    /**
     * Node display label.
     */
    public get nodeLabel(): string {
        return this.nodeData?.label ?? '';
    }

    /**
     * Node definition name (shown as the node's title in the header).
     */
    public get nodeName(): string {
        if (!this.nodeData) {
            return '';
        }
        const lNodeData = this.nodeData;
        const lDef = lNodeData.project.nodeDefinitions.find((lNodeDef: { id: string; }) => lNodeDef.id === lNodeData.definitionId);
        return lDef?.label ?? lNodeData.label;
    }

    /**
     * Inline CSS style for comment node sizing.
     */
    public get commentSizeStyle(): string {
        if (!this.nodeData) {
            return '';
        }
        return `height: ${this.nodeData.transformation.height * this.gridSize}px;`;
    }

    /**
     * All input ports in definition order (flow and value).
     */
    public get inputPorts(): Array<PotatnoDocumentPort<any>> {
        if (!this.nodeData) {
            return [];
        }
        return [...this.nodeData.inputs.list];
    }

    /**
     * All output ports in definition order (flow and value).
     */
    public get outputPorts(): Array<PotatnoDocumentPort<any>> {
        if (!this.nodeData) {
            return [];
        }
        return [...this.nodeData.outputs.list];
    }

    // ── Lifecycle ───────────────────────────────────────────────────────

    /**
     * After each update cycle, ensure the preview element is appended to the container.
     */
    public onUpdate(): void {
        const lPreviewEl: HTMLElement | null = this.previewElement;
        if (!lPreviewEl) {
            return;
        }

        let lContainer: HTMLDivElement;
        try {
            lContainer = this.mPreviewContainer;
        } catch {
            return;
        }

        if (lPreviewEl.parentElement !== lContainer) {
            lContainer.innerHTML = '';
            lContainer.appendChild(lPreviewEl);
        }
    }

    // ── Event handlers ──────────────────────────────────────────────────

    /**
     * Handle pointer down on the node for selection and drag initiation.
     */
    public onNodePointerDown(pEvent: PointerEvent): void {
        if ((pEvent.target as HTMLElement).tagName?.toLowerCase() === 'potatno-port') {
            return;
        }
        if (!this.nodeData) {
            return;
        }

        this.mNodeSelect.dispatchEvent({
            node: this.nodeData,
            shiftKey: pEvent.shiftKey
        });

        this.mNodeDragStart.dispatchEvent({
            node: this.nodeData,
            startX: pEvent.clientX,
            startY: pEvent.clientY
        });
    }

    /**
     * Re-emit a port-drag-start event from a child port component.
     */
    public onPortDragStart(pEvent: ComponentEvent<PortInteractionDetail>): void {
        this.mPortDragStart.dispatchEvent(pEvent.value);
    }

    /**
     * Re-emit a port-hover event from a child port component.
     */
    public onPortHover(pEvent: ComponentEvent<PortInteractionDetail>): void {
        this.mPortHover.dispatchEvent(pEvent.value);
    }

    /**
     * Re-emit a port-leave event from a child port component.
     */
    public onPortLeave(_pEvent: ComponentEvent<void>): void {
        this.mPortLeave.dispatchEvent(undefined as unknown as void);
    }

    /**
     * Re-emit a direct-value-change event from a child port component.
     */
    public onDirectValueChange(pEvent: ComponentEvent<DirectValueChangeDetail>): void {
        this.mDirectValueChange.dispatchEvent(pEvent.value);
    }

    /**
     * Re-emit a port-element-ready event from a child port component.
     */
    public onPortElementReady(pEvent: ComponentEvent<PortInteractionDetail>): void {
        this.mPortElementReady.dispatchEvent(pEvent.value);
    }

    /**
     * Handle click on the open-function button.
     */
    public onOpenFunction(pEvent: MouseEvent): void {
        pEvent.stopPropagation();
        if (!this.nodeData) {
            return;
        }
        this.mOpenFunction.dispatchEvent({ node: this.nodeData });
    }

    /**
     * Handle text input changes on comment nodes.
     */
    public onCommentInput(pEvent: Event): void {
        const lTarget: HTMLTextAreaElement = pEvent.target as HTMLTextAreaElement;
        if (!this.nodeData) {
            return;
        }
        this.nodeData.label = lTarget.value;
        this.mCommentChange.dispatchEvent({ node: this.nodeData, text: lTarget.value });
    }

    /**
     * Handle pointer down on the resize handle of comment nodes.
     */
    public onResizeStart(pEvent: PointerEvent): void {
        pEvent.stopPropagation();
        pEvent.preventDefault();
        if (!this.nodeData) {
            return;
        }
        this.mResizeStart.dispatchEvent({
            node: this.nodeData,
            startX: pEvent.clientX,
            startY: pEvent.clientY
        });
    }
}

export type NodeSelectDetail = {
    node: PotatnoDocumentNode<any>;
    shiftKey: boolean;
};

export type NodeDragStartDetail = {
    node: PotatnoDocumentNode<any>;
    startX: number;
    startY: number;
};

export type OpenFunctionDetail = {
    node: PotatnoDocumentNode<any>;
};

export type CommentChangeDetail = {
    node: PotatnoDocumentNode<any>;
    text: string;
};

export type ResizeStartDetail = {
    node: PotatnoDocumentNode<any>;
    startX: number;
    startY: number;
};

export type DirectValueChangeDetail = {
    port: PotatnoDocumentPort<any>;
    values: Array<string>;
};
