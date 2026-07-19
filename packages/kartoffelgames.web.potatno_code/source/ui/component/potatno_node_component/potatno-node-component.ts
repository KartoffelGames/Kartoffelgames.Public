import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, ComponentState, PwbComponent, PwbExport, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoPreviewDriver } from '../../../preview/potatno-preview-driver.ts';
import { PotatnoFunctionNodeDefinition } from '../../../project/node_definition/potatno-function-node-definition.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../../../project/potatno-project.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoPreviewModule } from '../../module/potatno-preview.module.ts';
import { NodeCategory } from '../../node/node-category.enum.ts';
import { PotatnoResizeBoxComponent, PotatnoResizeBoxComponentSize } from "../potatno-resize-box/potatno-resize-box-component.ts";
import { PotatnoPortComponent } from '../potatno_port/potatno-port-component.ts';
import nodeCss from './potatno-node-component.css' with { type: 'text' };
import nodeTemplate from './potatno-node-component.html' with { type: 'text' };

/**
 * Node component for the potatno-code visual editor.
 * Handles resize and position on its own.
 */
@PwbComponent({
    selector: 'potatno-node',
    template: nodeTemplate,
    style: nodeCss,
    modules: [PotatnoPreviewModule],
    components: [PotatnoPortComponent, PotatnoResizeBoxComponent]
})
export class PotatnoNodeComponent implements IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private mUnsubscribe: PotatnoCodeUiManagerUnsubscribe;
    private mNodeDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition> | null;

    /**
     * The domain node object to render.
     */
    @PwbExport
    @ComponentState.state()
    public accessor nodeData: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null = null;

    /**
     * CSS class string for the error state.
     */
    public get hasErrorClass(): string {
        return (this.nodeData !== null && this.mManager.integrity.errorItems.has(this.nodeData)) ? 'has-error' : '';
    }

    /**
     * Whether this is a function-category node.
     */
    public get isFunction(): boolean {
        return this.nodeDefinition?.category.name === NodeCategory.Function;
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
        return this.nodeData?.preview !== null;
    }

    /**
     * CSS class for the eye button, reflecting its active state.
     */
    public get previewEyeClass(): string {
        return this.isPreviewActive ? 'preview-eye-btn active' : 'preview-eye-btn';
    }

    /**
     * Display ("style") ids registered for the node's function, from the project's preview registry.
     */
    public get previewDisplays(): Array<PotatnoNodeComponentPreviewDisplayOption> {
        if (!this.nodeData) {
            return [];
        }

        const lProject: PotatnoProject<PotatnoProjectTypesDefinition> = this.nodeData.project;
        const lFunctionDefinition = lProject.getFunction(this.nodeData.function.definitionId);
        if (!lFunctionDefinition) {
            return [];
        }

        const lBinding = this.nodeData.preview;
        const lPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | undefined = lBinding ? this.nodeData.outputs.map.get(lBinding.portId) : undefined;
        if (lPort && lPort.portType === 'value') {
            return this.createDisplayOptions(lProject, lProject.preview.availableDisplays(lFunctionDefinition, lPort.resolvedDataType));
        }

        const lDisplays: Set<string> = new Set<string>();
        for (const lPort of this.valueOutputPorts) {
            for (const lDisplay of lProject.preview.availableDisplays(lFunctionDefinition, lPort.resolvedDataType)) {
                lDisplays.add(lDisplay);
            }
        }

        return this.createDisplayOptions(lProject, [...lDisplays]);
    }

    /**
     * The driver backing this node's inline preview, bound by the template's `potatno-preview`
     * module to mount the preview element. `null` when the node has no active preview so the module
     * clears the container.
     */
    public get previewDriver(): PotatnoPreviewDriver<PotatnoProjectTypesDefinition> | null {
        const lPreview = this.nodeData?.preview;
        if (!this.nodeData || !lPreview) {
            return null;
        }

        const lPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | undefined = this.nodeData.outputs.map.get(lPreview.portId);
        if (!lPort) {
            return null;
        }

        return this.mManager.preview.requestDriver(lPort, lPreview.displayId);
    }

    /**
     * The node's value output ports — the candidates for an inline preview.
     */
    public get valueOutputPorts(): Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> {
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
        return this.mManager.generateStringColor(this.nodeDefinition?.category.name ?? '');
    }

    /**
     * Category display icon.
     */
    public get categoryIcon(): string {
        if (!this.nodeData) {
            return '';
        }

        return this.nodeDefinition?.category.icon ?? '';
    }

    /**
     * Node display label.
     */
    public get nodeLabel(): string {
        return this.nodeData?.label ?? '';
    }

    /**
     * Inline CSS style for grid-sized node layout.
     */
    public get nodeGridStyle(): string {
        const lGridSize: number = this.mManager.grid.gridSize;

        return `--pn-grid-size: ${lGridSize}px; --pn-grid-half-size: ${lGridSize / 2}px; --pn-node-port-gap: ${lGridSize}px;`;
    }

    /**
     * All input ports in definition order (flow and value).
     */
    public get inputPorts(): ReadonlyArray<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> {
        if (!this.nodeData) {
            return new Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>();
        }

        return this.nodeData.inputs.list;
    }

    /**
     * All output ports in definition order (flow and value).
     */
    public get outputPorts(): ReadonlyArray<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> {
        if (!this.nodeData) {
            return new Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>();
        }

        return this.nodeData.outputs.list;
    }

    /**
     * Get node definition of node component.
     */
    private get nodeDefinition(): PotatnoNodeDefinition<PotatnoProjectTypesDefinition> | null {
        if (!this.nodeData) {
            return null;
        }

        if (this.mNodeDefinition && this.mNodeDefinition.id == this.nodeData.definitionId) {
            return this.mNodeDefinition;
        }

        if (!this.mManager.activeFunction) {
            return null;
        }

        // Find node data.
        const lNodeDefinition = this.mManager.activeFunction.nodeDefinitions.find((pNodeDefinition) => {
            return pNodeDefinition.id === this.nodeData!.definitionId;
        });

        if (!lNodeDefinition) {
            return null;
        }

        // Buffer found node definition.
        this.mNodeDefinition = lNodeDefinition;

        return lNodeDefinition;
    }

    /**
     * Create the node component.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mComponent = pComponent;
        this.mManager = pManager;
        this.mNodeDefinition = null;

        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.SpecialActiveFunction | PotatnoCodeUiManagerChangeType.Node | PotatnoCodeUiManagerChangeType.Connection, () => {
            this.mComponent.updater.updateAsync();
        });
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe();
    }

    public resizeNode(pResize: PotatnoResizeBoxComponentSize): void {
        this.mManager.graph.transformNode(this.nodeData, (pNode) => {
            const lWidth: number = pResize.width / this.mManager.grid.gridSize;
            const lHeight: number = pResize.height / this.mManager.grid.gridSize;

            pNode.resizeTo(lWidth, lHeight);
        });
    }

















    /**
     * Whether the given port is the one currently previewed.
     *
     * @param pPort - Port to check.
     */
    public isPreviewedPort(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): boolean {
        return this.nodeData?.preview?.portId === pPort.definitionId;
    }

    

    /**
     * Choose which output port to preview. Re-selecting the active port turns the preview off.
     *
     * @param pEvent - Click event from the port row.
     * @param pPort - Port to preview.
     */
    public onSelectPreviewPort(pEvent: MouseEvent, pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): void {
        pEvent.stopPropagation();

        const lDisplays: Array<string> = this.previewDisplaysForPort(pPort);
        this.mManager.graph.updateNode(this.nodeData, (pNode) => {
            // Toggle off when re-selecting the active port.
            if (pNode.preview?.portId === pPort.definitionId) {
                pNode.preview = null;
                return;
            }

            // Keep the chosen display when it still applies, else default to the first available.
            const lDisplayId: string | undefined = (pNode.preview && lDisplays.includes(pNode.preview.displayId)) ? pNode.preview.displayId : lDisplays[0];
            if (lDisplayId) {
                pNode.preview = { portId: pPort.definitionId, displayId: lDisplayId };
            }
        });
    }

    /**
     * Display ids that can render the given value output port.
     *
     * @param pPort - Port whose preview displays should be listed.
     */
    private previewDisplaysForPort(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): Array<string> {
        if (!this.nodeData) {
            return [];
        }

        const lFunctionDefinition = this.nodeData.project.getFunction(this.nodeData.function.definitionId);
        if (!lFunctionDefinition) {
            return [];
        }

        return this.nodeData.project.preview.availableDisplays(lFunctionDefinition, pPort.resolvedDataType);
    }

    /**
     * Disable this node's inline preview (the "None" row).
     *
     * @param pEvent - Click event from the row.
     */
    public onClearPreview(pEvent: MouseEvent): void {
        pEvent.stopPropagation();
        this.mManager.graph.updateNode(this.nodeData, (pNode) => {
            pNode.preview = null;
        });
    }

    /**
     * Change the preview display ("style") for the active preview.
     *
     * @param pEvent - Change event from the style selector.
     */
    public onSelectPreviewStyle(pEvent: Event): void {
        pEvent.stopPropagation();

        const lDisplayId: string = (pEvent.target as HTMLSelectElement).value;
        this.mManager.graph.updateNode(this.nodeData, (pNode) => {
            if (pNode.preview) {
                pNode.preview = { portId: pNode.preview.portId, displayId: lDisplayId };
            }
        });
    }

    /**
     * Convert registry ids to selector options using display names.
     *
     * @param pProject - Project owning the preview registry.
     * @param pDisplayIds - Display ids to convert.
     */
    private createDisplayOptions(pProject: PotatnoProject<PotatnoProjectTypesDefinition>, pDisplayIds: Array<string>): Array<PotatnoNodeComponentPreviewDisplayOption> {
        return pDisplayIds.map((pDisplayId) => {
            return {
                id: pDisplayId,
                label: pProject.preview.getDisplay(pDisplayId)?.name ?? pDisplayId
            };
        });
    }

    /**
     * Open the document function represented by this function node.
     *
     * @param pEvent - Click event from the open button.
     */
    public onOpenFunction(pEvent: MouseEvent): void {
        pEvent.stopPropagation();

        // Node data and document must be set for this function.
        if (!this.nodeData || !this.mManager.graph.document) {
            return;
        }

        const lNodeDefinitionId: string = this.nodeData.definitionId;
        const lNodeDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition> | undefined = this.mManager.graph.document.nodeDefinitions.find((pNodeDefinition) => {
            return pNodeDefinition.id === lNodeDefinitionId;
        });

        // Skip when the node definition is a function node definition.
        if (!(lNodeDefinition instanceof PotatnoFunctionNodeDefinition)) {
            return;
        }

        // Set nodes function.
        this.mManager.setActiveFunction(lNodeDefinition.function);
    }
}

type PotatnoNodeComponentPreviewDisplayOption = {
    readonly id: string;
    readonly label: string;
};
