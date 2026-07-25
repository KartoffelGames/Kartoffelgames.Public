import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, type ComponentEventEmitter, ComponentState, PwbComponent, PwbComponentEvent, PwbExport, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoPreviewDriver } from '../../../preview/potatno-preview-driver.ts';
import { PotatnoFunctionNodeDefinition } from '../../../project/node_definition/potatno-function-node-definition.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import type { PotatnoFunctionDefinition } from '../../../project/potatno-function-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import { PotatnoPreviewModule } from '../../module/potatno-preview.module.ts';
import { PotatnoResizeBoxComponent } from '../potatno-resize-box/potatno-resize-box-component.ts';
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
    private mNodeData: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null;
    private mNodeDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition> | null;
    private readonly mUnsubscribe: PotatnoCodeUiManagerUnsubscribe;

    /**
     * Whether the node exposes a value output that can select a preview display.
     */
    public get canPreview(): boolean {
        return this.previewPorts.length > 0;
    }

    /**
     * Emitted with the definition the user picked, for the host to insert.
     */
    @PwbComponentEvent('drag')
    private accessor mDrag!: ComponentEventEmitter<PotatnoNodeComponentMove>;

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
     * All input ports in definition order (flow and value).
     */
    public get inputPorts(): ReadonlyArray<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> {
        if (!this.nodeData) {
            return new Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>();
        }

        return this.nodeData.inputs.list;
    }

    /**
     * Whether this is a function-category node.
     */
    public get isFunction(): boolean {
        return this.mNodeDefinition instanceof PotatnoFunctionNodeDefinition;
    }

    /**
     * Whether this node currently has an active inline preview.
     */
    public get isPreviewActive(): boolean {
        return !!this.nodeData?.preview;
    }

    /**
     * Is the preview display selection open.
     */
    @ComponentState.state()
    public accessor isPreviewDisplaySelectionOpen: boolean;

    /**
     * Category display color.
     */
    public get nodeColor(): string {
        return this.mManager.generateStringColor(this.mNodeDefinition?.category.name ?? '');
    }

    /**
     * The domain node object to render.
     */
    @PwbExport
    public get nodeData(): PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null {
        return this.mNodeData;
    } set nodeData(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> | null) {
        // Set node data and reset node definition.
        this.mNodeData = pNode;
        this.mNodeDefinition = null;

        // For syncing, a node must be specified.
        if (!pNode) {
            return;
        }

        // Set find node definition of node data.
        this.mNodeDefinition = (() => {
            if (!this.mManager.activeFunction) {
                return null;
            }

            // Find node data.
            return this.mManager.activeFunction.nodeDefinitions.find((pNodeDefinition) => {
                return pNodeDefinition.id === this.nodeData!.definitionId;
            }) ?? null;
        })();

        // Resync nodes transformation on change.
        this.resyncComponent(pNode);
    }

    /**
     * Category display icon.
     */
    public get nodeIcon(): string {
        return this.mNodeDefinition?.category.icon ?? '';
    }

    /**
     * Node display label.
     */
    public get nodeLabel(): string {
        return this.nodeData?.label ?? '';
    }

    /**
     * Component transformation, Size and position.
     */
    @ComponentState.state({ proxy: true })
    private accessor nodeTransformation: PotatnoNodeComponentTransformation;

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
     * Read the previewable ports of the node.
     */
    @ComponentState.state({ complexValue: true })
    public accessor previewPorts: Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>;

    /**
     * Display ("style") ids registered for the node's function, from the project's preview registry.
     */
    @ComponentState.state({ complexValue: true })
    public accessor previewDisplays: Array<PotatnoNodeComponentPreviewDisplayOption>;

    /**
     * The display id currently selected as the active preview.
     */
    public get previewDisplayId(): string {
        return this.nodeData?.preview?.displayId ?? '';
    }

    /**
     * Get the preview driver of the selected port and display of the preview.
     */
    public get previewDriver(): PotatnoPreviewDriver<PotatnoProjectTypesDefinition> | null {
        // No preview no preview driver.
        if (!this.nodeData?.preview) {
            return null;
        }

        // Get instance of selected port id.
        const lPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | undefined = this.nodeData.outputs.map.get(this.nodeData.preview.portDefinitionId);
        if (!lPort) {
            return null;
        }

        return this.mManager.preview.requestDriver(lPort, this.nodeData.preview.displayId);
    }

    /**
     * The port id currently selected for the active preview.
     */
    public get previewPortDefinitionId(): string {
        return this.nodeData?.preview?.portDefinitionId ?? '';
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
        this.isPreviewDisplaySelectionOpen = false;

        // Define default transformation.
        this.nodeTransformation = {
            height: 0,
            width: 0
        };

        // Define empty preview ports.
        this.previewPorts = new Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>();
        this.previewDisplays = new Array<PotatnoNodeComponentPreviewDisplayOption>();

        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Node, (pItem) => {
            // Only trigger a transformation if its affects the current node data.
            if (pItem.item !== this.nodeData) {
                return;
            }

            // Calculate the current size of the component.
            this.resyncComponent(this.nodeData!);
        });
    }

    /**
     * Handle pointer down on the resize corners handle.
     *
     * @param pEvent - Pointer event from the resize handle.
     */
    public dragNode(pEvent: PointerEvent): void {
        // Cant transform without 
        if (!this.nodeData) {
            return;
        }

        pEvent.preventDefault();
        pEvent.stopPropagation();

        // Save current size so the current pointer position determinates exactly this size.
        const lStartingCoordinateX: number = this.nodeData.transformation.x * this.mManager.grid.gridSize;
        const lStartingCoordinateY: number = this.nodeData.transformation.y * this.mManager.grid.gridSize;

        let lCurrentX: number = this.nodeData.transformation.x;
        let lCurrentY: number = this.nodeData.transformation.y;

        // Scale of any transformed parent: ratio of rendered (actual size) to layout (unscaled) size.
        const lComponentSize: DOMRect = this.mComponent.element.getBoundingClientRect();
        const lScaleX: number = this.mComponent.element.offsetWidth ? lComponentSize.width / this.mComponent.element.offsetWidth : 1;
        const lScaleY: number = this.mComponent.element.offsetHeight ? lComponentSize.height / this.mComponent.element.offsetHeight : 1;

        // Save the starting pointer coordinates to only transform the actual movement.
        const lStartX = pEvent.clientX;
        const lStartY = pEvent.clientY;

        // Resize magic listener (●'◡'●)つ━☆・*。
        const lPointerMoveListener = (pMoveEvent: PointerEvent): void => {
            // Resize from top-left corner: moving left/up increases size.
            // Divide by scale to convert mouse movement into scale actual drag.
            const lMovementChangeX: number = (pMoveEvent.clientX - lStartX) / lScaleX;
            const lMovementChangeY: number = (pMoveEvent.clientY - lStartY) / lScaleY;

            // Change window size but clamp it down to a minimum size.
            const lX: number = Math.round((lStartingCoordinateX + lMovementChangeX) / this.mManager.grid.gridSize);
            const lY: number = Math.round((lStartingCoordinateY + lMovementChangeY) / this.mManager.grid.gridSize);

            // Skip any movement when nothing has changed.
            if (lCurrentX === lX && lCurrentY === lY) {
                return;
            }

            // And then update component size.
            this.mManager.graph.transformNode(this.nodeData, (pNode) => {
                pNode.moveTo(lX, lY);
            });

            // Dispatch drag event.
            this.mDrag.dispatchEvent(new PotatnoNodeComponentMove(lX - lCurrentX, lY - lCurrentY));

            // Save new current position.
            lCurrentX = lX;
            lCurrentY = lY;
        };

        // Pointer up listener, cleaning up temporary listener.
        const lPointerUpListener = (): void => {
            // Remove temporary mouse move listener.
            document.removeEventListener('pointermove', lPointerMoveListener);
            document.removeEventListener('pointerup', lPointerUpListener);
        };

        // Add temporary mouse move listener.
        document.addEventListener('pointermove', lPointerMoveListener);
        document.addEventListener('pointerup', lPointerUpListener);
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe();
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
     * Change the preview display ("style") for the active preview.
     *
     * @param pEvent - Change event from the style selector.
     */
    public selectPreviewDisplay(pDisplayId: string): void {
        this.mManager.graph.updateNode(this.nodeData, (pNode) => {
            // Preview should be set when this function is called, so we can assume its not null.
            pNode.preview = { portDefinitionId: pNode.preview!.portDefinitionId, displayId: pDisplayId };
        });

        // Hacky but doable. Reset current focus of icon to close menu.
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }

    /**
     * Choose which output port to preview.
     * Not selecting anything, toggles the preview on or off with the first available preview port.
     *
     * @param pPort - Port to preview.
     */
    public selectPreviewPort(pPortDefinitionId?: string | null): void {
        // Node data must be present.
        if (!this.nodeData) {
            return;
        }

        // Select port that should be previewed, eighter use the provided port or toggle.
        const lPreviewPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null = (() => {
            // Get all ports that support preview displays.
            const lPreviewablePorts: Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> = this.previewPorts;
            if (lPreviewablePorts.length === 0) {
                return null;
            }

            // Use the selected port id to find the port instance.
            if (typeof pPortDefinitionId !== 'undefined') {
                return lPreviewablePorts.find((pPort) => {
                    return pPort.definitionId === pPortDefinitionId;
                }) ?? null;
            }

            // Toggle preview port when no port is specified.
            return !!this.nodeData.preview ? null : lPreviewablePorts[0];
        })();

        // Reset preview if no port is selected.
        if (!lPreviewPort) {
            return this.mManager.graph.updateNode(this.nodeData, (pNode) => {
                pNode.preview = null;
            });
        }

        // Activate preview for the selected port.
        this.mManager.graph.updateNode(this.nodeData, (pNode) => {
            // Read nodes parent function, function definition. It must be allways available.
            const lFunctionDefinition: PotatnoFunctionDefinition<PotatnoProjectTypesDefinition> | undefined = pNode.project.getFunction(pNode.function.definitionId)!;

            // Read the available preview displays for the selected port.
            const lDisplays: Array<string> = pNode.project.preview.availableDisplays(lFunctionDefinition, lPreviewPort.resolvedDataType);
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

            pNode.preview = { portDefinitionId: lPreviewPort.definitionId, displayId: lDisplayId };
        });

        // Resync, as the port can have different available displays.
        this.resyncComponent(this.nodeData);
    }

    /**
     * Get all available preview displays mapped to the ports result type.
     * 
     * @param pPort - Port.
     * 
     * @returns all available preview displays of the port. 
     */
    private getPreviewDisplays(pPortDefinitionId: string | null): Array<PotatnoNodeComponentPreviewDisplayOption> {
        // Cant find any port without node data or port id.
        if (!this.nodeData || !pPortDefinitionId) {
            return new Array<PotatnoNodeComponentPreviewDisplayOption>();
        }

        // Find nodes port by definition id. 
        const lPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | undefined = this.nodeData.outputs.map.get(pPortDefinitionId);
        if (!lPort) {
            return new Array<PotatnoNodeComponentPreviewDisplayOption>();
        }

        // Read the current function definition of the ports node.
        const lFunctionDefinition: PotatnoFunctionDefinition<PotatnoProjectTypesDefinition> | undefined = lPort.project.getFunction(lPort.node.function.definitionId);
        if (!lFunctionDefinition) {
            return new Array<PotatnoNodeComponentPreviewDisplayOption>();
        }

        // Read all available preview displays of ports data type.
        const lAvailableDisplayIds: Array<string> = lPort.project.preview.availableDisplays(lFunctionDefinition, lPort.resolvedDataType);

        // Remap available display ids to display id and label.
        return lAvailableDisplayIds.map((pDisplayId) => {
            return {
                id: pDisplayId,
                label: lPort.project.preview.getDisplay(pDisplayId)?.name ?? pDisplayId
            };
        });
    }

    /**
     * Get all previewable port of the specified node.
     * 
     * @param pNode - Node.
     * 
     * @returns all ports that are previewable for the node.
     */
    private getPreviewablePorts(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>> {
        if (!this.mManager.activeFunction) {
            return new Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>();
        }

        // Read nodes parent function, function definition. It must be allways available.
        const lFunctionDefinition: PotatnoFunctionDefinition<PotatnoProjectTypesDefinition> | undefined = pNode.project.getFunction(pNode.function.definitionId)!;

        // Find node in dynamic nodes.
        const lDynamicNodeDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition> | undefined = this.mManager.activeFunction.dynamicNodeDefinitions.find((pNodeDefinition) => {
            return pNodeDefinition.id === pNode.definitionId;
        });

        // Only when its dynamic, it should be capable to have a preview.
        if (!lDynamicNodeDefinition) {
            return new Array<PotatnoDocumentPort<PotatnoProjectTypesDefinition>>();
        }

        // Create a type buffer to cache already checked types.
        const lTypeBuffer: Map<string, boolean> = new Map<string, boolean>();
        return pNode.outputs.value.filter((pPort) => {
            const lPortDataType: string = pPort.resolvedDataType;

            // Try to read solution from buffer.
            if (lTypeBuffer.has(lPortDataType)) {
                return lTypeBuffer.get(lPortDataType);
            }

            // Read the available preview displays for the current port and store if any display is available into the buffer.
            const lDisplays: Array<string> = pNode.project.preview.availableDisplays(lFunctionDefinition, pPort.resolvedDataType);
            lTypeBuffer.set(lPortDataType, lDisplays.length > 0);

            // Read it again out of the buffer to return it.
            return lTypeBuffer.get(lPortDataType);
        });
    }

    /**
     * Update the actual component size and position and read all available preview ports.
     * 
     * @param pNode - Node data. 
     */
    private resyncComponent(pNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition>): void {
        // Set the node position on the actual component.
        const lNodeX: number = pNode.transformation.x * this.mManager.grid.gridSize;
        const lNodeY: number = pNode.transformation.y * this.mManager.grid.gridSize;
        this.mComponent.element.style.setProperty('left', `${lNodeX}px`);
        this.mComponent.element.style.setProperty('top', `${lNodeY}px`);

        // Update general size transformation.
        this.nodeTransformation.width = pNode.transformation.width;
        this.nodeTransformation.height = pNode.transformation.height;

        // Reset previewable ports and displays.
        this.previewPorts = this.getPreviewablePorts(this.nodeData!);
        this.previewDisplays = this.getPreviewDisplays(pNode.preview?.portDefinitionId ?? null);
    }
}

/**
 * Event data of dragged distance.
 */
export class PotatnoNodeComponentMove {
    private readonly mX: number;
    private readonly mY: number;

    /**
     * Moved x distance.
     */
    public get x(): number {
        return this.mX;
    }


    /**
     * Moved y distance.
     */
    public get y(): number {
        return this.mY;
    }

    /**
     * Constructor.
     * 
     * @param pX - Moved x distance.
     * @param pY - Moved y distance.
     */
    public constructor(pX: number, pY: number) {
        this.mX = pX;
        this.mY = pY;
    }
}

type PotatnoNodeComponentPreviewDisplayOption = {
    readonly id: string;
    readonly label: string;
};

type PotatnoNodeComponentTransformation = {
    width: number;
    height: number;
};