import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, PwbComponent, PwbExport, type IComponentOnConnect, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import { PwbChild } from '../../../../../kartoffelgames.web.potato_web_builder/source/module/pwb_child/pwb-child.decorator.ts';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoPreviewDriver } from '../../../preview/potatno-preview-driver.ts';
import { PotatnoFunctionNodeDefinition } from '../../../project/node_definition/potatno-function-node-definition.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import type { PotatnoProject } from '../../../project/potatno-project.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoPreviewModule } from '../../module/potatno-preview.module.ts';
import { PotatnoResizeBoxComponent, type PotatnoResizeBoxComponentResize, PotatnoResizeBoxComponentResizeDirection } from '../potatno-resize-box/potatno-resize-box-component.ts';
import { PotatnoPortComponent } from '../potatno_port/potatno-port-component.ts';
import nodeCss from './potatno-comment-node-component.css' with { type: 'text' };
import nodeTemplate from './potatno-comment-node-component.html' with { type: 'text' };

/**
 * Node component for the potatno-code visual editor.
 * Handles resize and position on its own.
 */
@PwbComponent({
    selector: 'potatno-comment-node',
    template: nodeTemplate,
    style: nodeCss,
    modules: [PotatnoPreviewModule],
    components: [PotatnoPortComponent, PotatnoResizeBoxComponent]
})
export class PotatnoCommentNodeComponent implements IComponentOnConnect, IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private readonly mManager: PotatnoUiManager;
    private readonly mUnsubscribe: PotatnoCodeUiManagerUnsubscribe;
    private readonly mUnsubscribeTransformation: PotatnoCodeUiManagerUnsubscribe;
    private mNodeDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition> | null;
    private mNodeData: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null;
    private mViewReady: boolean;

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
    private accessor resizeBox!: PotatnoResizeBoxComponent & Element | null;

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
     * Read the previewable ports of the node.
     */
    public get previewPorts(): Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> {
        if (!this.nodeData) {
            return new Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>();
        }

        // Read nodes parent function, function definition. It must be allways available.
        const lFunctionDefinition = this.nodeData.project.getFunction(this.nodeData.function.definitionId)!;

        // Create a type buffer to cache already checked types.
        const lTypeBuffer: Map<string, boolean> = new Map<string, boolean>();
        return this.nodeData.outputs.list.filter((pPort) => {
            const lPortDataType: string = pPort.resolvedDataType;

            // Try to read solution from buffer.
            if (lTypeBuffer.has(lPortDataType)) {
                return lTypeBuffer.get(lPortDataType);
            }

            // Read the available preview displays for the current port and store if any display is available into the buffer.
            const lDisplays: Array<string> = this.nodeData!.project.preview.availableDisplays(lFunctionDefinition, pPort.resolvedDataType);
            lTypeBuffer.set(lPortDataType, lDisplays.length > 0);

            // Read it again out of the buffer to return it.
            return lTypeBuffer.get(lPortDataType);
        });
    }

    /**
     * Whether the node exposes a value output and can therefore host an inline preview.
     */
    public get canPreview(): boolean {
        return this.previewPorts.length > 0;
    }

    /**
     * Whether this node currently has an active inline preview opt-in.
     */
    public get isPreviewActive(): boolean {
        return this.nodeData?.preview !== null;
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

        const createDisplayOptions = (pProject: PotatnoProject<PotatnoProjectTypesDefinition>, pDisplayIds: Array<string>): Array<PotatnoNodeComponentPreviewDisplayOption> => {
            return pDisplayIds.map((pDisplayId) => {
                return {
                    id: pDisplayId,
                    label: pProject.preview.getDisplay(pDisplayId)?.name ?? pDisplayId
                };
            });
        };

        const lBinding = this.nodeData.preview;
        const lPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | undefined = lBinding ? this.nodeData.outputs.map.get(lBinding.portDefinitionId) : undefined;
        if (lPort && lPort.portType === 'value') {
            return createDisplayOptions(lProject, lProject.preview.availableDisplays(lFunctionDefinition, lPort.resolvedDataType));
        }

        const lDisplays: Set<string> = new Set<string>();
        for (const lPort of this.nodeData.outputs.value) {
            for (const lDisplay of lProject.preview.availableDisplays(lFunctionDefinition, lPort.resolvedDataType)) {
                lDisplays.add(lDisplay);
            }
        }

        return createDisplayOptions(lProject, [...lDisplays]);
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

        const lPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | undefined = this.nodeData.outputs.map.get(lPreview.portDefinitionId);
        if (!lPort) {
            return null;
        }

        return this.mManager.preview.requestDriver(lPort, lPreview.displayId);
    }

    /**
     * The display id currently selected for the active preview, or '' when none is active.
     */
    public get selectedDisplayId(): string {
        return this.nodeData?.preview?.displayId ?? '';
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
        this.mViewReady = false;

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
     * Apply the initial component transformation once the view is built and connected.
     * The resize box (@PwbChild) only exists after the component built its view, so this can not run in the
     * nodeData setter on the initial binding, which is applied before the first build. From now on the view
     * exists, so later rebinds apply the transformation directly in the setter.
     */
    public onConnect(): void {
        this.mViewReady = true;
        this.updateComponentTransformation(this.nodeData);
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

        // Calculate and update node size.
        if (this.resizeBox) {
            const lNodeWidth: number = pNode.transformation.width * this.mManager.grid.gridSize;
            const lNodeHeight: number = pNode.transformation.height * this.mManager.grid.gridSize;
            this.resizeBox.resize(lNodeWidth, lNodeHeight);
        }

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
     * Choose which output port to preview. Re-selecting the active port turns the preview off.
     *
     * @param pPort - Port to preview.
     */
    public selectPreviewPort(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null): void {
        // Reset preview if no port is selected.
        if (!pPort) {
            return this.mManager.graph.updateNode(this.nodeData, (pNode) => {
                pNode.preview = null;
            });
        }

        // Activate preview for the selected port.
        this.mManager.graph.updateNode(this.nodeData, (pNode) => {
            // Read nodes parent function, function definition. It must be allways available.
            const lFunctionDefinition = pNode.project.getFunction(pNode.function.definitionId)!;

            // Read the available preview displays for the selected port.
            const lDisplays: Array<string> = pNode.project.preview.availableDisplays(lFunctionDefinition, pPort.resolvedDataType);
            if (lDisplays.length === 0) {
                // Bad logic to reset the preview, but the port should never be selectable in the first place.
                pNode.preview = null;
            }

            // Keep the chosen display when it still applies, else default to the first available.
            const lDisplayId: string = (() => {
                if (pNode.preview && lDisplays.includes(pNode.preview.displayId)) {
                    return pNode.preview.displayId;
                }

                return lDisplays[0];
            })();

            pNode.preview = { portDefinitionId: pPort.definitionId, displayId: lDisplayId };
        });
    }

    /**
     * Toggle the current preview. If its enabled, simply disable it.
     * If its disabled, try to select the first port as active preview.
     */
    public togglePreview(): void {
        // Node data must be present.
        if (!this.nodeData) {
            return;
        }

        // Disable preview if a preview is selected.
        if (this.nodeData.preview) {
            return this.selectPreviewPort(null);
        }

        // Select the first available preview port.
        const lPreviewablePorts: Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> = this.previewPorts;
        if (lPreviewablePorts.length === 0) {
            return this.selectPreviewPort(null);
        }

        // Select the first preview able port as active preview.
        return this.selectPreviewPort(lPreviewablePorts[0]);
    }

    /**
     * Change the preview display ("style") for the active preview.
     *
     * @param pEvent - Change event from the style selector.
     */
    public selectPreviewDisplay(pDisplayId: string): void {
        this.mManager.graph.updateNode(this.nodeData, (pNode) => {
            if (pNode.preview) {
                pNode.preview = { portDefinitionId: pNode.preview.portDefinitionId, displayId: pDisplayId };
            }
        });
    }
}

type PotatnoNodeComponentPreviewDisplayOption = {
    readonly id: string;
    readonly label: string;
};
