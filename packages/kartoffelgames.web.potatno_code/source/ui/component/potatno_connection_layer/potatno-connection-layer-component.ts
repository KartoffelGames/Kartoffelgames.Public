import { Injection } from '@kartoffelgames/core-dependency-injection';
import { ComponentState, PwbComponent, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { IPotatnoDocumentItem } from '../../../document/i-potatno-document-item.interface.ts';
import type { PotatnoDocumentNode } from '../../../document/potatno-document-node.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { PotatnoFlowConjunctionNodeDefinition } from '../../../project/node_definition/potatno-flow-conjunction-node-definition.ts';
import type { PotatnoNodeDefinition } from '../../../project/node_definition/potatno-node-definition.ts';
import { PotatnoValueConjunctionNodeDefinition } from '../../../project/node_definition/potatno-value-conjunction-node-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import type { PotatnoUiManagerGridCoordinate } from '../../manager/manager_component/potatno-ui-manager-grid.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager } from '../../manager/potatno-ui-manager.ts';
import connectionLayerCss from './potatno-connection-layer-component.css' with { type: 'text' };
import connectionLayerTemplate from './potatno-connection-layer-component.html' with { type: 'text' };
import type { PotatnoUiManagerConnectionsPath } from '../../manager/manager_component/potatno-ui-manager-connections.ts';

/**
 * SVG connection layer for the node graph.
 */
@PwbComponent({
    selector: 'potatno-connection-layer',
    template: connectionLayerTemplate,
    style: connectionLayerCss,
})
export class PotatnoConnectionLayerComponent implements IComponentOnDeconstruct {
    private readonly mManager: PotatnoUiManager;
    private readonly mTemporaryConnectionDragHandler: (pEvent: DragEvent) => void;
    private readonly mUnsubscribePersistentUpdate: () => void;
    private readonly mUnsubscribeTemporaryUpdate: () => void;

    /**
     * Current connections.
     */
    @ComponentState.state({ complexValue: true })
    public accessor connections: Map<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, PotatnoConnectionLayerComponentConnection>;

    /**
     * The single temporary connection, or null when none is rendered.
     */
    @ComponentState.state({ complexValue: true })
    public accessor temporaryConnection: PotatnoConnectionLayerComponentTemporaryConnection | null;

    /**
     * Create the connection layer.
     *
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mManager = pManager;
        this.connections = new Map<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, PotatnoConnectionLayerComponentConnection>();
        this.temporaryConnection = null;

        // Debounced svg redraw.
        let lRenderConnectionFrame: number = 0;
        this.mUnsubscribePersistentUpdate = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.SpecialActiveFunction | PotatnoCodeUiManagerChangeType.Node | PotatnoCodeUiManagerChangeType.Connection, () => {
            if (lRenderConnectionFrame !== 0) {
                return;
            }

            lRenderConnectionFrame = requestAnimationFrame(() => {
                lRenderConnectionFrame = 0;
                this.updateConnections();
            });
        });

        // Redraw the temporary connection whenever it changes.
        this.mUnsubscribeTemporaryUpdate = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.SpecialTemporaryConnection, () => {
            this.temporaryConnection = this.createTemporaryConnection();
        });

        // Single document wide drag handler tracking the pointer while a port is dragged.
        // Uses capture so it still fires while hovering ports that stop propagation because firefox cant fix a 16 year old bug.
        this.mTemporaryConnectionDragHandler = (pEvent: DragEvent) => {
            // Only track while a port is dragged.
            if (!this.mManager.grid.draggedPort.isDragging) {
                return;
            }

            // Play the gamble and skip event when the time differs too much.
            if (performance.now() - pEvent.timeStamp > 100) {
                return;
            }

            // Skip when the pointer has not moved into a new grid cell.
            if (!this.mManager.grid.draggedPort.updatePointer(pEvent.clientX, pEvent.clientY)) {
                return;
            }

            // Redraw only the temporary connection with the new pointer position.
            this.mManager.dispatch(PotatnoCodeUiManagerChangeType.SpecialTemporaryConnection, null);
        };
        document.addEventListener('dragover', this.mTemporaryConnectionDragHandler, { capture: true });
    }

    /**
     * Create a conjunction on the double click position.
     * 
     * @param pEvent - Double click event.
     * @param pConnection - Target connection.
     */
    public createConjunction(pEvent: MouseEvent, pConnection: PotatnoConnectionLayerComponentConnection): void {
        pEvent.preventDefault();
        pEvent.stopPropagation();

        // Get the correct conjunction definition based on the connected port type.
        const lConjunctionDefinition: PotatnoNodeDefinition<PotatnoProjectTypesDefinition> = (() => {
            if (pConnection.port.output.portType === 'flow') {
                return this.mManager.project.nodeDefinitions.get(PotatnoFlowConjunctionNodeDefinition.DEFINITION_ID)!;
            }

            return this.mManager.project.nodeDefinitions.get(PotatnoValueConjunctionNodeDefinition.DEFINITION_ID)!;
        })();

        // Convert pointer position into local (component space) and grid space.
        const lGridPosition: PotatnoUiManagerGridCoordinate = this.mManager.grid.pixelToGridSpace(pEvent.clientX, pEvent.clientY);

        // Create new conjunction node on the clicked grid position.
        const lConjunctionNode: PotatnoDocumentNode<PotatnoProjectTypesDefinition> = this.mManager.graph.addNode(this.mManager.activeFunction, lConjunctionDefinition, {
            x: lGridPosition.x,
            y: lGridPosition.y,

            // Let the auto min size do the work.
            height: 0,
            width: 0
        });

        // Disconnect previous connection.
        this.mManager.graph.disconnectPorts(pConnection.port.output, pConnection.port.input);

        // Get both, input and output port of the conjunction.
        const lInputPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> = lConjunctionNode.inputs.list[0];
        const lOutputPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> = lConjunctionNode.outputs.list[0];

        // And reconnect.
        this.mManager.graph.connectPorts(lInputPort, pConnection.port.output);
        this.mManager.graph.connectPorts(lInputPort, pConnection.port.input);
        this.mManager.graph.connectPorts(lOutputPort, pConnection.port.output);
        this.mManager.graph.connectPorts(lOutputPort, pConnection.port.input);
    }

    /**
     * Delete the connection under a right-click on its hit path.
     *
     * @param pEvent - Context menu event from the SVG layer.
     * @param pConnection - Target connection.
     */
    public deleteConnection(pEvent: MouseEvent, pConnection: PotatnoConnectionLayerComponentConnection): void {
        // Delete can only be triggered on right click.
        if (pEvent.button !== 2) {
            return;
        }

        pEvent.preventDefault();
        pEvent.stopPropagation();

        // Delete... hopefully.
        this.mManager.graph.disconnectPorts(pConnection.port.output, pConnection.port.input);
    }

    /**
     * Detach the manager subscription and cancel any pending render frame.
     */
    public onDeconstruct(): void {
        this.mUnsubscribePersistentUpdate();
        this.mUnsubscribeTemporaryUpdate();

        // Remove the global dragover handler.
        document.removeEventListener('dragover', this.mTemporaryConnectionDragHandler, { capture: true });
    }

    /**
     * Render a persistent connection path and its hit area.
     *
     * @param pSvg - SVG layer to render into.
     * @param pId - Connection id.
     * @param pOutputPort - Source port of the connection.
     * @param pStart - Start anchor.
     * @param pEnd - End anchor.
     * @param pValid - Whether the connection is valid.
     */
    private createConnection(pPreviousConnections: Map<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, unknown>, pOutputPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pInputPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>): PotatnoConnectionLayerComponentConnection {
        // Find errors in source or target port.
        const lErrorItems: ReadonlySet<IPotatnoDocumentItem<PotatnoProjectTypesDefinition>> = this.mManager.integrity.errorItems;
        const lHasError: boolean = lErrorItems.has(pOutputPort) || lErrorItems.has(pInputPort);

        // Get port that can only have a single 
        const lPrimaryPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> = (() => {
            switch (pInputPort.portType) {
                case 'value': return pInputPort;
                case 'flow': return pOutputPort;
            }
        })();

        // Get port color from type name.
        const lPortColor: string = (() => {
            // Leave blank for flow ports. Templare handles that.
            if (pOutputPort.portType === 'flow') {
                return '';
            }

            // Set type color as drawing color. 
            return this.mManager.generateStringColor(pOutputPort.resolvedDataType);
        })();

        // Create path.
        const lSvgPath: PotatnoUiManagerConnectionsPath = this.mManager.connections.getConnectionPath(pOutputPort, pInputPort);

        // Construct connection.
        return {
            color: lPortColor,
            path: {
                attributeValue: lSvgPath.attributeValue,
                length: lSvgPath.length
            },
            state: {
                isNew: !pPreviousConnections.has(lPrimaryPort),
                hasError: lHasError
            },
            port: {
                primary: lPrimaryPort,
                output: pOutputPort,
                input: pInputPort
            }
        };
    }

    /**
     * Build the temporary connection from the currently dragged port to the pointer, or null when not dragging.
     */
    private createTemporaryConnection(): PotatnoConnectionLayerComponentTemporaryConnection | null {
        const lDraggedPort = this.mManager.grid.draggedPort;

        // No wire when nothing is dragged.
        if (!lDraggedPort.isDragging || !Number.isFinite(lDraggedPort.pointerGridPosition.x)) {
            return null;
        }

        // Draw from the first dragged port to the pointer.
        const lStartPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> = lDraggedPort.ports[0];

        // Get port color from type name.
        const lColor: string = (() => {
            // Leave blank for flow ports. Templare handles that.
            if (lStartPort.portType === 'flow') {
                return '';
            }

            // Set type color as drawing color. 
            return this.mManager.generateStringColor(lStartPort.resolvedDataType);
        })();
        
        // Build the path in grid space, same as persistent connections.
        const lEnd: PotatnoUiManagerGridCoordinate = { x: lDraggedPort.pointerGridPosition.x, y: lDraggedPort.pointerGridPosition.y };
        const lPath: PotatnoUiManagerConnectionsPath = this.mManager.connections.createTemporaryPath(lStartPort, lEnd);

        return {
            attributeValue: lPath.attributeValue,
            color: lColor
        };
    }

    /**
     * Render the current graph connections into the SVG layer.
     */
    private updateConnections(): void {
        // Save old connections to compare them agains new.
        const lPreviousConnections: Map<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, PotatnoConnectionLayerComponentConnection> = this.connections;

        // Clear all paths.
        this.connections = new Map<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, PotatnoConnectionLayerComponentConnection>();

        // Iterate each connected port of a port of a node.
        for (const lNode of this.mManager.activeFunction.nodes) {
            for (const lOutputPort of lNode.outputs.list) {
                for (const lInputPort of lOutputPort.connectedPorts) {
                    // Create connection and store it with the primary port as id.
                    const lConnection: PotatnoConnectionLayerComponentConnection = this.createConnection(lPreviousConnections, lOutputPort, lInputPort);
                    this.connections.set(lConnection.port.primary, lConnection);
                }
            }
        }
    }
}

type PotatnoConnectionLayerComponentTemporaryConnection = {
    attributeValue: string;
    color: string;
};

type PotatnoConnectionLayerComponentConnection = {
    /**
     * CSS color of connection.
     */
    color: string;

    /**
     * Svg path string.
     */
    path: {
        attributeValue: string;
        length: number;
    };

    state: {
        hasError: boolean;
        isNew: boolean;
    };

    /**
     * Ports of connection.
     */
    port: {
        /**
         * Port that can only have one sole connection.
         */
        primary: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
        output: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
        input: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
    };
};
