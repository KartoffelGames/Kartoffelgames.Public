import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentEventEmitter, ComponentState, PwbChild, PwbComponent, PwbComponentEvent, PwbExport, type ComponentEvent, type IComponentOnConnect, type IComponentOnDeconstruct, type IComponentOnUpdate } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { PotatnoCodeUiManager, PotatnoCodeUiManagerEventType } from '../../potatno-code-ui-manager.ts';
import type { PotatnoUiProject } from '../../potatno-node-definition-list.ts';
import type { PortInteractionDetail } from '../potatno_port/potatno-port.ts';
import nodeCss from './potatno-node-component.css' with { type: 'text' };
import nodeTemplate from './potatno-node-component.html' with { type: 'text' };

// Ensure the port component is registered before the node template is processed.
import { NodeCategory, NodeCategoryMeta } from "../../node/node-category.enum.ts";
import '../potatno_port/potatno-port.ts';

/**
 * Node component for the potatno-code visual editor.
 *
 * Renders a single {@link PotatnoDocumentNode}. Layout inputs (which node, selected, grid size)
 * are pushed in by the graph; everything else — validation highlighting, the inline preview
 * element and its available displays, and every mutation (label edits, preview opt-in, opening a
 * function) — goes through the shared {@link PotatnoCodeUiManager}. The component self-updates by
 * subscribing to manager events instead of receiving refresh tokens.
 */
@PwbComponent({
    selector: 'potatno-node',
    template: nodeTemplate,
    style: nodeCss,
})
export class PotatnoNodeComponent implements IComponentOnConnect, IComponentOnDeconstruct, IComponentOnUpdate {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoCodeUiManager;
    private mPreviewElement: HTMLElement | null;
    private mUnsubscribe: (() => void) | null;

    /**
     * The domain node object to render.
     */
    @PwbExport
    @ComponentState.state()
    public accessor nodeData: PotatnoDocumentNode<PotatnoUiProject> | null = null;

    /**
     * Whether this node is currently selected.
     */
    @PwbExport
    @ComponentState.state()
    public accessor selected: boolean = false;

    /**
     * Grid size in pixels. Used to convert grid-unit positions to pixel values.
     */
    @PwbExport
    @ComponentState.state()
    public accessor gridSize: number = 20;

    /**
     * Reference to the preview container element inside the node.
     * Only available for standard nodes (not reroute or comment).
     */
    @PwbChild('NodePreview')
    private accessor mPreviewContainer!: HTMLDivElement;

    @PwbComponentEvent('port-drag-start')
    private accessor mPortDragStart!: ComponentEventEmitter<PortInteractionDetail>;

    @PwbComponentEvent('port-hover')
    private accessor mPortHover!: ComponentEventEmitter<PortInteractionDetail>;

    @PwbComponentEvent('port-leave')
    private accessor mPortLeave!: ComponentEventEmitter<void>;

    @PwbComponentEvent('resize-start')
    private accessor mResizeStart!: ComponentEventEmitter<ResizeStartDetail>;

    @PwbComponentEvent('port-element-ready')
    private accessor mPortElementReady!: ComponentEventEmitter<PortInteractionDetail>;

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
        return (this.nodeData !== null && this.mManager.errorNodes.has(this.nodeData)) ? 'has-error' : '';
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
     * Whether the open-function button should be shown. Only for function nodes.
     */
    public get showOpenButton(): boolean {
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
     * Display ids available for previewing this node's outputs, resolved from the manager.
     */
    public get previewDisplays(): Array<string> {
        if (!this.nodeData) {
            return [];
        }
        return this.mManager.getPreviewDisplaysForNode(this.nodeData);
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

    /**
     * Create the node component.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoCodeUiManager = Injection.use(PotatnoCodeUiManager)) {
        this.mComponent = pComponent;
        this.mManager = pManager;
        this.mPreviewElement = null;
        this.mUnsubscribe = null;
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
     * Subscribe to manager events that affect this node's rendering.
     */
    public onConnect(): void {
        this.mUnsubscribe = this.mManager.listen([
            PotatnoCodeUiManagerEventType.NodeAdd,
            PotatnoCodeUiManagerEventType.NodeChange,
            PotatnoCodeUiManagerEventType.NodeDelete,
            PotatnoCodeUiManagerEventType.ConnectionAdd,
            PotatnoCodeUiManagerEventType.ConnectionDelete,
            PotatnoCodeUiManagerEventType.PreviewChange
        ], () => {
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
     * After each update cycle, ensure the inline preview element is mounted.
     */
    public onUpdate(): void {
        this.attachPreviewElement();
    }

    /**
     * Re-emit a port-drag-start event from a child port component.
     *
     * @param pEvent - Port interaction event from the port component.
     */
    public onPortDragStart(pEvent: ComponentEvent<PortInteractionDetail>): void {
        this.mPortDragStart.dispatchEvent(pEvent.value);
    }

    /**
     * Re-emit a port-hover event from a child port component.
     *
     * @param pEvent - Port interaction event from the port component.
     */
    public onPortHover(pEvent: ComponentEvent<PortInteractionDetail>): void {
        this.mPortHover.dispatchEvent(pEvent.value);
    }

    /**
     * Re-emit a port-leave event from a child port component.
     */
    public onPortLeave(): void {
        this.mPortLeave.dispatchEvent(undefined as unknown as void);
    }

    /**
     * Re-emit a port-element-ready event from a child port component.
     *
     * @param pEvent - Port interaction event from the port component.
     */
    public onPortElementReady(pEvent: ComponentEvent<PortInteractionDetail>): void {
        this.mPortElementReady.dispatchEvent(pEvent.value);
    }

    /**
     * Choose which output port to preview.
     *
     * @param pEvent - Click event from the port row.
     * @param pPort - Port to preview.
     */
    public onSelectPreviewPort(pEvent: MouseEvent, pPort: PotatnoDocumentPort<PotatnoUiProject>): void {
        pEvent.stopPropagation();
        if (!this.nodeData) {
            return;
        }
        this.mManager.setNodePreview(this.nodeData, pPort.definitionId);
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
        this.mManager.setNodePreview(this.nodeData, '');
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
        this.mManager.setNodePreviewDisplay(this.nodeData, (pEvent.target as HTMLSelectElement).value);
    }

    /**
     * Open the document function represented by this function node.
     *
     * @param pEvent - Click event from the open button.
     */
    public onOpenFunction(pEvent: MouseEvent): void {
        pEvent.stopPropagation();
        if (!this.nodeData) {
            return;
        }
        this.mManager.openNodeFunction(this.nodeData);
    }

    /**
     * Handle text input changes on comment nodes.
     *
     * @param pEvent - Input event from the comment textarea.
     */
    public onCommentInput(pEvent: Event): void {
        const lTarget: HTMLTextAreaElement = pEvent.target as HTMLTextAreaElement;
        if (!this.nodeData) {
            return;
        }
        this.nodeData.label = lTarget.value;
        this.mManager.commitNodeChange(false, this.nodeData);
    }

    /**
     * Handle pointer down on the resize handle of comment nodes.
     *
     * @param pEvent - Pointer event from the resize handle.
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

    /**
     * Mount the current inline preview element (resolved from the manager) into the preview
     * container, replacing any previous occupant, or clear the container when there is no preview.
     */
    private attachPreviewElement(): void {
        let lContainer: HTMLDivElement;
        try {
            lContainer = this.mPreviewContainer;
        } catch {
            // The container is not in the DOM yet (node not rendered, or a reroute/comment node).
            return;
        }

        const lPreviewEl: HTMLElement | null = this.nodeData ? this.mManager.getNodePreviewElement(this.nodeData) : null;
        this.mPreviewElement = lPreviewEl;

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
}

export type ResizeStartDetail = {
    node: PotatnoDocumentNode<PotatnoUiProject>;
    startX: number;
    startY: number;
};
