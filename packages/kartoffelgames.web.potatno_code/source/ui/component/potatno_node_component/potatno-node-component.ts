import type { ComponentEvent, IComponentOnUpdate } from '@kartoffelgames/web-potato-web-builder';
import { ComponentEventEmitter, ComponentState, PwbChild, PwbComponent, PwbComponentEvent, PwbExport } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoUiProject } from '../../potatno-node-definition-list.ts';
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
    public accessor nodeData: PotatnoDocumentNode<PotatnoUiProject> | null = null;

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
    public accessor errorPorts: ReadonlySet<PotatnoDocumentPort<PotatnoUiProject>> = new Set();

    /**
     * Grid size in pixels. Used to convert grid-unit positions to pixel values.
     */
    @PwbExport
    @ComponentState.state()
    public accessor gridSize: number = 20;

    private mPreviewElement: HTMLElement | null = null;

    /**
     * Preview element to display inline, pushed by the graph via template binding. (Re)attaching
     * happens in the setter rather than only in `onUpdate`, because the element is mounted
     * imperatively (not through the template) — so a swapped-in canvas after a rebuild, or a
     * cleared preview, takes effect immediately instead of waiting for an unrelated template
     * change (e.g. selecting the node).
     */
    @PwbExport
    public set previewElement(pValue: HTMLElement | null) {
        if (this.mPreviewElement === pValue) {
            return;
        }

        this.mPreviewElement = pValue;
        this.attachPreviewElement();
    }

    /**
     * Get the inline preview element.
     */
    public get previewElement(): HTMLElement | null {
        return this.mPreviewElement;
    }

    /**
     * Display ids available for previewing this node's outputs, supplied by the graph from the
     * project's preview registry. Drives the "style" selector shown on an active preview.
     */
    @PwbExport
    @ComponentState.state({ complexValue: true })
    public accessor previewDisplays: Array<string> = [];

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

    @PwbComponentEvent('preview-select')
    private accessor mPreviewSelect!: ComponentEventEmitter<PreviewSelectDetail>;

    @PwbComponentEvent('preview-style')
    private accessor mPreviewStyle!: ComponentEventEmitter<PreviewStyleDetail>;

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
    public isPortError(pPort: PotatnoDocumentPort<PotatnoUiProject>): boolean {
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
     * Only for function nodes.
     */
    public get showOpenButton(): boolean {
        if (!this.nodeData) {
            return false;
        }
        return this.isFunction;
    }

    /**
     * Whether the node exposes a value output and can therefore host an inline preview.
     */
    public get canPreview(): boolean {
        return this.valueOutputPorts.length > 0;
    }

    /**
     * Whether this node currently has an active inline preview opt-in.
     */
    public get isPreviewActive(): boolean {
        return this.nodeData?.preview != null;
    }

    /**
     * CSS class for the eye button, reflecting its active state.
     */
    public get previewEyeClass(): string {
        return this.isPreviewActive ? 'preview-eye-btn active' : 'preview-eye-btn';
    }

    /**
     * The node's value output ports — the candidates for an inline preview.
     */
    public get valueOutputPorts(): Array<PotatnoDocumentPort<PotatnoUiProject>> {
        if (!this.nodeData) {
            return [];
        }
        return [...this.nodeData.outputs.value];
    }

    /**
     * The display id currently selected for the active preview, or '' when none is active.
     */
    public get selectedDisplayId(): string {
        return this.nodeData?.preview?.displayId ?? '';
    }

    /**
     * Whether the given port is the one currently previewed.
     *
     * @param pPort - Port to check.
     */
    public isPreviewedPort(pPort: PotatnoDocumentPort<PotatnoUiProject>): boolean {
        return this.nodeData?.preview?.portId === pPort.definitionId;
    }

    /**
     * CSS class for a port row in the preview menu.
     *
     * @param pPort - Port the row represents.
     */
    public previewPortClass(pPort: PotatnoDocumentPort<PotatnoUiProject>): string {
        return this.isPreviewedPort(pPort) ? 'preview-port-item active' : 'preview-port-item';
    }

    /**
     * CSS class for the "None" (disable) row — active when no preview is set.
     */
    public get previewNoneClass(): string {
        return this.isPreviewActive ? 'preview-port-item' : 'preview-port-item active';
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
    public get inputPorts(): Array<PotatnoDocumentPort<PotatnoUiProject>> {
        if (!this.nodeData) {
            return [];
        }
        return [...this.nodeData.inputs.list];
    }

    /**
     * All output ports in definition order (flow and value).
     */
    public get outputPorts(): Array<PotatnoDocumentPort<PotatnoUiProject>> {
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
        // The container is (re)created by the template; re-run the attach so the preview element
        // lands in the fresh container after a template update.
        this.attachPreviewElement();
    }

    /**
     * Mount the current preview element into the preview container, replacing any previous
     * occupant, or clear the container when there is no preview (e.g. after selecting "None").
     * Called from the `previewElement` setter and from `onUpdate`.
     */
    private attachPreviewElement(): void {
        let lContainer: HTMLDivElement;
        try {
            lContainer = this.mPreviewContainer;
        } catch {
            // The container is not in the DOM yet (node not rendered, or a reroute/comment node).
            return;
        }

        const lPreviewEl: HTMLElement | null = this.mPreviewElement;

        // No preview → remove any previously mounted element.
        if (!lPreviewEl) {
            if (lContainer.firstChild) {
                lContainer.innerHTML = '';
            }
            return;
        }

        if (lContainer.firstChild === lPreviewEl && lContainer.childNodes.length === 1) {
            return;
        }

        lContainer.innerHTML = '';
        lContainer.appendChild(lPreviewEl);
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
     * Choose which output port to preview. Lets the graph apply the opt-in.
     *
     * @param pEvent - Click event from the port row.
     * @param pPort - Port to preview.
     */
    public onSelectPreviewPort(pEvent: MouseEvent, pPort: PotatnoDocumentPort<PotatnoUiProject>): void {
        pEvent.stopPropagation();
        if (!this.nodeData) {
            return;
        }
        this.mPreviewSelect.dispatchEvent({ node: this.nodeData, portId: pPort.definitionId });
    }

    /**
     * Disable this node's inline preview (the "None" row).
     *
     * @param pEvent - Click event from the row.
     */
    public onClearPreview(pEvent: MouseEvent): void {
        pEvent.stopPropagation();
        if (!this.nodeData) {
            return;
        }
        this.mPreviewSelect.dispatchEvent({ node: this.nodeData, portId: '' });
    }

    /**
     * Change the preview display ("style") for the active preview.
     *
     * @param pEvent - Change event from the style selector.
     */
    public onSelectPreviewStyle(pEvent: Event): void {
        pEvent.stopPropagation();
        if (!this.nodeData) {
            return;
        }
        this.mPreviewStyle.dispatchEvent({ node: this.nodeData, displayId: (pEvent.target as HTMLSelectElement).value });
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
    node: PotatnoDocumentNode<PotatnoUiProject>;
    shiftKey: boolean;
};

export type NodeDragStartDetail = {
    node: PotatnoDocumentNode<PotatnoUiProject>;
    startX: number;
    startY: number;
};

export type OpenFunctionDetail = {
    node: PotatnoDocumentNode<PotatnoUiProject>;
};

export type PreviewSelectDetail = {
    node: PotatnoDocumentNode<PotatnoUiProject>;
    portId: string;
};

export type PreviewStyleDetail = {
    node: PotatnoDocumentNode<PotatnoUiProject>;
    displayId: string;
};

export type CommentChangeDetail = {
    node: PotatnoDocumentNode<PotatnoUiProject>;
    text: string;
};

export type ResizeStartDetail = {
    node: PotatnoDocumentNode<PotatnoUiProject>;
    startX: number;
    startY: number;
};

export type DirectValueChangeDetail = {
    port: PotatnoDocumentPort<PotatnoUiProject>;
    values: Array<string>;
};
