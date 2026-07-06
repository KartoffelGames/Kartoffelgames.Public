import { Injection } from '@kartoffelgames/core-dependency-injection';
import { PwbChild, PwbComponent, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { IPotatnoDocumentItem } from '../../../document/i-potatno-document-item.interface.ts';
import type { PotatnoDocumentFunction } from '../../../document/potatno-document-function.ts';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager } from '../../manager/potatno-ui-manager.ts';
import connectionLayerCss from './potatno-connection-layer.css' with { type: 'text' };
import connectionLayerTemplate from './potatno-connection-layer.html' with { type: 'text' };

/**
 * SVG connection layer for the node graph.
 */
@PwbComponent({
    selector: 'potatno-connection-layer',
    template: connectionLayerTemplate,
    style: connectionLayerCss,
})
export class PotatnoConnectionLayer implements IComponentOnDeconstruct {
    private readonly mConnectionRegistry: Map<number, PotatnoConnectionLayerConnection>;
    private readonly mManager: PotatnoUiManager;
    private readonly mUnsubscribe: () => void;

    /**
     * SVG element that hosts the connection paths.
     */
    @PwbChild('svgLayer')
    public accessor svgLayer!: SVGSVGElement;

    /**
     * Create the connection layer.
     *
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mConnectionRegistry = new Map<number, PotatnoConnectionLayerConnection>();
        this.mManager = pManager;

        // Debounced svg redraw.
        let lRenderConnectionFrame: number = 0;
        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.SpecialActiveFunction | PotatnoCodeUiManagerChangeType.Node | PotatnoCodeUiManagerChangeType.Connection, null, () => {
            if (lRenderConnectionFrame !== 0) {
                return;
            }

            lRenderConnectionFrame = requestAnimationFrame(() => {
                lRenderConnectionFrame = 0;
                this.renderConnections();
            });
        });
    }

    /**
     * Delete the connection under a right-click on its hit path.
     *
     * @param pEvent - Context menu event from the SVG layer.
     */
    public onConnectionDelete(pEvent: MouseEvent): void {
        if (!(pEvent.target instanceof Element)) {
            return;
        }

        // When something is clicked that has not a connection id, its not a path. Exit.
        const lConnectionId: number = parseInt(pEvent.target.getAttribute('data-connection-id') ?? '');
        if (isNaN(lConnectionId)) {
            return;
        }

        pEvent.preventDefault();
        pEvent.stopPropagation();

        // Read connection by its stored id.
        const lConnection: PotatnoConnectionLayerConnection | undefined = this.mConnectionRegistry.get(lConnectionId);
        if (!lConnection) {
            return;
        }

        // Delete... hopefully.
        this.mManager.graph.disconnectPorts(lConnection.sourcePort, lConnection.targetPort);
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
     * @param pSourcePort - Source port of the connection.
     * @param pStart - Start anchor.
     * @param pEnd - End anchor.
     * @param pValid - Whether the connection is valid.
     */
    private renderConnectionPath(pSvg: SVGSVGElement, pId: number, pSourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pTargetPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pValid: boolean): void {
        const lSvgNamespace: string = 'http://www.w3.org/2000/svg';
        const lPathData: string = this.mManager.connections.getConnectionPath(pSourcePort, pTargetPort);

        // Create visible paths with the valid state as well.
        const lVisiblePath: SVGPathElement = document.createElementNS(lSvgNamespace, 'path') as SVGPathElement;
        lVisiblePath.classList.add('path');
        lVisiblePath.classList.toggle('.path--invalid', !pValid);
        lVisiblePath.setAttribute('d', lPathData);

        // Set type color as drawing color. Leave blank for flow ports. Css handles that.
        if (pSourcePort.portType === 'value') {
            lVisiblePath.style.setProperty('--path-color', this.mManager.generateStringColor(pSourcePort.resolvedDataType));
        }

        // Create path that can be interacted with the mouse.
        const lMousePath: SVGPathElement = document.createElementNS(lSvgNamespace, 'path') as SVGPathElement;
        lMousePath.classList.add('path', 'path--mouse-target');
        lMousePath.setAttribute('d', lPathData);
        lMousePath.setAttribute('data-connection-id', pId.toString());

        // Append paths.
        pSvg.appendChild(lVisiblePath);
        pSvg.appendChild(lMousePath);
    }

    /**
     * Render the current graph connections into the SVG layer.
     */
    private renderConnections(): void {
        // Clear all paths.
        this.svgLayer.innerHTML = '';
        this.mConnectionRegistry.clear();

        // Get current active function.
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            return;
        }

        // Store validaton errors.
        const lErrorItems: ReadonlySet<IPotatnoDocumentItem<PotatnoProjectTypesDefinition>> = this.mManager.integrity.errorItems;

        // Create a counter for each rendered connection.
        let lConnectionIndex: number = 0;

        // Iterate each connected port of a port of a node.
        for (const lNode of lActiveFunction.nodes) {
            for (const lOutputPort of lNode.outputs.list) {
                for (const lConnectedPort of lOutputPort.connectedPorts) {
                    const lConnectionId: number = lConnectionIndex++;
                    
                    // store the connection to later delete it by id.
                    this.mConnectionRegistry.set(lConnectionId, {
                        sourcePort: lOutputPort,
                        targetPort: lConnectedPort
                    });

                    // Read if the connection has an error item and then render the connection.
                    const lHasError: boolean = lErrorItems.has(lOutputPort) || lErrorItems.has(lConnectedPort);
                    this.renderConnectionPath(this.svgLayer, lConnectionId, lOutputPort, lConnectedPort, !lHasError);
                }
            }
        }
    }
}

type PotatnoConnectionLayerConnection = {
    sourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
    targetPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
};
