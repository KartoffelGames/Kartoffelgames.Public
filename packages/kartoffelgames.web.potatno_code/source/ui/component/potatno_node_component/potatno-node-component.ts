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
import { PotatnoResizeBoxComponent, PotatnoResizeBoxComponentResize, PotatnoResizeBoxComponentResizeDirection } from '../potatno-resize-box/potatno-resize-box-component.ts';
import { PotatnoPortComponent } from '../potatno_port/potatno-port-component.ts';
import nodeCss from './potatno-node-component.css' with { type: 'text' };
import nodeTemplate from './potatno-node-component.html' with { type: 'text' };
import { PwbChild } from "../../../../../kartoffelgames.web.potato_web_builder/source/module/pwb_child/pwb-child.decorator.ts";

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
    private readonly mUnsubscribe: PotatnoCodeUiManagerUnsubscribe;
    private readonly mUnsubscribeTransformation: PotatnoCodeUiManagerUnsubscribe;
    private mNodeDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition> | null;
    private mNodeData: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null;

    /**
     * The domain node object to render.
     */
    @PwbExport
    public get nodeData(): PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null {
        return this.mNodeData;
    } set nodeData(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null) {
        this.mNodeData = pNode;

        this.updateComponentTransformation(pNode);
    }

    @PwbChild('ResizeBox')
    private accessor resizeBox!: PotatnoResizeBoxComponent & Element;

    /**
     * CSS class string for the error state.
     */
    public get hasError(): boolean {
        if (!this.nodeData) {
            return false;
        }

        // Node has error.
        if (this.mManager.integrity.errorItems.has(this.nodeData)) {
            return true;
        }

        // Any input port has an error.
        for (const lInputPort of this.nodeData.inputs.list) {
            if (this.mManager.integrity.errorItems.has(lInputPort)) {
                return true;
            }
        }

        // Any output port has an error.
        for (const lOutputPort of this.nodeData.outputs.list) {
            if (this.mManager.integrity.errorItems.has(lOutputPort)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Whether this is a function-category node.
     */
    public get isFunction(): boolean {
        return this.mNodeDefinition instanceof PotatnoFunctionNodeDefinition;
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
        this.mNodeData = null;

        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.SpecialActiveFunction | PotatnoCodeUiManagerChangeType.Node | PotatnoCodeUiManagerChangeType.Connection, () => {
            this.mComponent.updater.updateAsync();
        });

        this.mUnsubscribeTransformation = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.NodeTransform, (pItem) => {
            // Only trigger a transformation if its affects the current node data.
            if (pItem.item !== this.nodeData) {
                return;
            }

            // Calculate the current size of the component.
            this.updateComponentTransformation(this.nodeData);
        });
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe();
        this.mUnsubscribeTransformation();
    }

    /**
     * Resize the node data to the set resize data.
     * The node resize restriction applies.
     * 
     * @param pResize - Resize data.
     */
    public transformNodeData(pResize: PotatnoResizeBoxComponentResize): void {
        this.mManager.graph.transformNode(this.nodeData, (pNode) => {
            // Save size before resizing.
            const lLastWidth: number = pNode.transformation.width;
            const lLastheight: number = pNode.transformation.height;

            // Resize size.
            pNode.resizeTo(pResize.width / this.mManager.grid.gridSize, pResize.height / this.mManager.grid.gridSize);

            // Calculate size change.
            const lWidthChange: number = pNode.transformation.width - lLastWidth;
            const lHeightChange: number = pNode.transformation.height - lLastheight;

            // Move the coordinate in the right direction based on the used handle.
            if (lHeightChange !== 0 && (pResize.resizeHandle & PotatnoResizeBoxComponentResizeDirection.top) > 0) {
                // Move y coordinate up the moved height amount.
                pNode.moveTo(pNode.transformation.x, pNode.transformation.y - lHeightChange);
            }
            if (lWidthChange !== 0 && (pResize.resizeHandle & PotatnoResizeBoxComponentResizeDirection.left) > 0) {
                // Move y coordinate up the moved height amount.
                pNode.moveTo(pNode.transformation.x - lWidthChange, pNode.transformation.y);
            }
        });
    }

    /**
     * Update the actual component size and position.
     * 
     * @param pNode - Node data. 
     */
    private updateComponentTransformation(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null): void {
        if (!pNode) {
            return;
        }

        // Calculate 
        const lNodeWidth: number = pNode.transformation.width * this.mManager.grid.gridSize;
        const lNodeHeight: number = pNode.transformation.height * this.mManager.grid.gridSize;
        this.resizeBox.resize(lNodeWidth, lNodeHeight);

        // Set the node position on the actual component.
        const lNodeX: number = pNode.transformation.x * this.mManager.grid.gridSize;
        const lNodeY: number = pNode.transformation.y * this.mManager.grid.gridSize;
        this.mComponent.element.style.setProperty('left', `${lNodeX}px`);
        this.mComponent.element.style.setProperty('top', `${lNodeY}px`);
    }

    /**
     * Open the document function represented by this function node.
     */
    public openFunction(): void {
        // Node data must be set for this node and be a function node definition.
        if (!(this.mNodeDefinition instanceof PotatnoFunctionNodeDefinition)) {
            return;
        }

        // Set nodes function.
        this.mManager.setActiveFunction(this.mNodeDefinition.function);
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
    public selectPreviewPort(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null): void {
        // Reset preview if no port is selected.
        if (pPort === null) {
            return this.mManager.graph.updateNode(this.nodeData, (pNode) => {
                pNode.preview = null;
            });
        }

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
}

type PotatnoNodeComponentPreviewDisplayOption = {
    readonly id: string;
    readonly label: string;
};
