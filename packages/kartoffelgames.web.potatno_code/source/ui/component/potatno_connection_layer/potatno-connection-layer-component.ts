import { Injection } from '@kartoffelgames/core-dependency-injection';
import { ComponentState, PwbComponent, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { IPotatnoDocumentItem } from '../../../document/i-potatno-document-item.interface.ts';
import { PotatnoDocumentNode } from "../../../document/potatno-document-node.ts";
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import { PotatnoFlowConjunctionNodeDefinition } from "../../../project/node_definition/potatno-flow-conjunction-node-definition.ts";
import { PotatnoNodeDefinition } from "../../../project/node_definition/potatno-node-definition.ts";
import { PotatnoValueConjunctionNodeDefinition } from "../../../project/node_definition/potatno-value-conjunction-node-definition.ts";
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoUiManagerGridCoordinate } from "../../manager/manager_component/potatno-ui-manager-grid.ts";
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager } from '../../manager/potatno-ui-manager.ts';
import connectionLayerCss from './potatno-connection-layer-component.css' with { type: 'text' };
import connectionLayerTemplate from './potatno-connection-layer-component.html' with { type: 'text' };
import { PotatnoUiManagerConnectionsPath } from "../../manager/manager_component/potatno-ui-manager-connections.ts";

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
    private readonly mUnsubscribe: () => void;

    /**
     * Current connections.
     */
    @ComponentState.state({ complexValue: true })
    public accessor connections: Map<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, PotatnoConnectionLayerComponentConnection>;

    /**
     * Create the connection layer.
     *
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mManager = pManager;
        this.connections = new Map<PotatnoDocumentPort<PotatnoProjectTypesDefinition>, PotatnoConnectionLayerComponentConnection>();

        // Debounced svg redraw.
        let lRenderConnectionFrame: number = 0;
        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.SpecialActiveFunction | PotatnoCodeUiManagerChangeType.Node | PotatnoCodeUiManagerChangeType.Connection, () => {
            if (lRenderConnectionFrame !== 0) {
                return;
            }

            lRenderConnectionFrame = requestAnimationFrame(() => {
                lRenderConnectionFrame = 0;
                this.updateConnections();
            });
        });
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
        this.mUnsubscribe();
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
