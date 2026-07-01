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
 *
 * Owns persistent and transient wire rendering. The layer resolves port anchors through the shared
 * {@link PotatnoUiManager} grid component and routes wires on the graph grid instead of drawing
 * free-form curves.
 */
@PwbComponent({
    selector: 'potatno-connection-layer',
    template: connectionLayerTemplate,
    style: connectionLayerCss,
})
export class PotatnoConnectionLayer implements IComponentOnDeconstruct {
    private readonly mConnectionRegistry: Map<string, PotatnoConnectionLayerRecord>;
    private readonly mManager: PotatnoUiManager;
    private mUnsubscribe: () => void;

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
        this.mConnectionRegistry = new Map<string, PotatnoConnectionLayerRecord>();
        this.mManager = pManager;

        // debounced svg redraw.
        let renderConnectionFrame: number = 0;
        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Document | PotatnoCodeUiManagerChangeType.Function | PotatnoCodeUiManagerChangeType.SpecialActiveFunction | PotatnoCodeUiManagerChangeType.Node | PotatnoCodeUiManagerChangeType.NodeTransform | PotatnoCodeUiManagerChangeType.Connection, null, () => {
            if (renderConnectionFrame !== 0) {
                return;
            }

            renderConnectionFrame = requestAnimationFrame(() => {
                renderConnectionFrame = 0;
                this.renderConnections();
            });
        });
    }


    /**
     * Detach the manager subscription and cancel any pending render frame.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe();
    }

    /**
     * Delete the connection under a right-click on its hit path.
     *
     * @param pEvent - Context menu event from the SVG layer.
     */
    public onContextMenu(pEvent: MouseEvent): void {
        if (!(pEvent.target instanceof Element)) {
            return;
        }

        const lConnectionId: string | null = pEvent.target.getAttribute('data-connection-id');
        if (!lConnectionId) {
            return;
        }

        pEvent.preventDefault();
        pEvent.stopPropagation();
        this.deleteConnectionById(lConnectionId);
    }

    /**
     * Clear connection paths from the SVG layer.
     *
     * @param pSvg - SVG layer to clear.
     */
    private clearPaths(pSvg: SVGSVGElement): void {
        const lPaths: NodeListOf<Element> = pSvg.querySelectorAll('path');
        for (const lPath of lPaths) {
            lPath.remove();
        }
    }

    /**
     * Delete a connection by its rendered connection id.
     *
     * @param pConnectionId - Rendered connection id from the SVG hit path.
     */
    private deleteConnectionById(pConnectionId: string): void {
        const lConnection: PotatnoConnectionLayerRecord | undefined = this.mConnectionRegistry.get(pConnectionId);
        if (!lConnection) {
            return;
        }

        const lSource: PotatnoDocumentPort<PotatnoProjectTypesDefinition> = lConnection.sourcePort.node.outputs.map.get(lConnection.sourcePort.definitionId) ?? lConnection.sourcePort;
        const lTarget: PotatnoDocumentPort<PotatnoProjectTypesDefinition> = lConnection.targetPort.node.inputs.map.get(lConnection.targetPort.definitionId) ?? lConnection.targetPort;
        this.mManager.graph.disconnectPorts(lSource, lTarget);
    }

    /**
     * Render the current graph connections into the SVG layer.
     */
    private renderConnections(): void {
        const lActiveFunction: PotatnoDocumentFunction<PotatnoProjectTypesDefinition> | null = this.mManager.activeFunction;
        if (!lActiveFunction) {
            this.clearPaths(this.svgLayer);
            this.mConnectionRegistry.clear();
            return;
        }

        this.clearPaths(this.svgLayer);
        this.mConnectionRegistry.clear();

        const lErrorItems: ReadonlySet<IPotatnoDocumentItem<PotatnoProjectTypesDefinition>> = this.mManager.integrity.errorItems;
        let lConnectionIndex: number = 0;
        for (const lNode of lActiveFunction.nodes) {
            for (const lOutputPort of lNode.outputs.list) {
                for (const lConnectedPort of lOutputPort.connectedPorts) {
                    const lId: string = `c${lConnectionIndex++}`;
                    const lHasError: boolean = lErrorItems.has(lOutputPort) || lErrorItems.has(lConnectedPort);

                    this.mConnectionRegistry.set(lId, {
                        sourcePort: lOutputPort,
                        targetPort: lConnectedPort
                    });

                    this.renderConnectionPath(this.svgLayer, lId, lOutputPort, lConnectedPort, !lHasError);
                }
            }
        }

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
    private renderConnectionPath(pSvg: SVGSVGElement, pId: string, pSourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pTargetPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>, pValid: boolean): void {
        const lPathData: string = this.mManager.connections.getConnectionPath(pSourcePort, pTargetPort);

        const lSvgNamespace: string = 'http://www.w3.org/2000/svg';

        const lHitPath: SVGPathElement = document.createElementNS(lSvgNamespace, 'path') as SVGPathElement;
        lHitPath.setAttribute('d', lPathData);
        lHitPath.setAttribute('data-connection-id', pId);
        lHitPath.setAttribute('data-hit-area', 'true');
        lHitPath.setAttribute('fill', 'none');
        lHitPath.style.cursor = 'pointer';
        lHitPath.style.pointerEvents = 'stroke';
        lHitPath.style.stroke = 'transparent';
        lHitPath.style.strokeLinecap = 'round';
        lHitPath.style.strokeLinejoin = 'round';
        lHitPath.style.strokeWidth = '12';
        pSvg.appendChild(lHitPath);

        const lPath: SVGPathElement = document.createElementNS(lSvgNamespace, 'path') as SVGPathElement;
        lPath.setAttribute('d', lPathData);
        lPath.setAttribute('data-connection-id', pId);
        lPath.setAttribute('fill', 'none');
        lPath.style.pointerEvents = 'none';
        lPath.style.stroke = pValid ? '#a6adc8' : '#f38ba8';
        lPath.style.strokeLinecap = 'round';
        lPath.style.strokeLinejoin = 'round';
        lPath.style.strokeWidth = '2';

        if (!pValid) {
            lPath.setAttribute('stroke-dasharray', '6 3');
        }

        pSvg.appendChild(lPath);
    }
}

type PotatnoConnectionLayerRecord = {
    sourcePort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
    targetPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>;
};
